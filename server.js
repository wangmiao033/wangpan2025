// Node.js 后端服务器 - 文件传输API
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import cors from 'cors';
import { fileURLToPath } from 'url';
import archiver from 'archiver';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// 创建上传目录
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 文件存储配置
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
    // 允许所有文件类型，但可以在这里添加限制
    cb(null, true);
};

// 上传配置
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 * 1024, // 10GB 限制
        files: 10 // 最多10个文件
    }
});

// 文件信息存储（实际应用中应使用数据库）
const fileDatabase = new Map();

// 生成唯一ID
function generateId() {
    return crypto.randomBytes(16).toString('hex');
}

// 生成下载码
function generateDownloadCode() {
    return crypto.randomBytes(8).toString('hex');
}

// 文件上传API (Vercel兼容版本)
app.post('/api/upload', (req, res) => {
    try {
        // 模拟文件上传成功（演示模式）
        const password = req.body.password || null;
        const expiry = parseInt(req.body.expiry) || 7; // 默认7天
        const downloadCode = generateDownloadCode();
        
        // 计算过期时间
        const expiryDate = expiry === 0 ? null : new Date(Date.now() + expiry * 24 * 60 * 60 * 1000);
        
        // 模拟文件信息
        const fileInfo = {
            id: generateId(),
            downloadCode: downloadCode,
            files: [{
                originalName: 'demo-file.txt',
                filename: 'demo-file.txt',
                size: 1024,
                mimetype: 'text/plain',
                path: '/tmp/demo-file.txt'
            }],
            password: password,
            expiryDate: expiryDate,
            uploadDate: new Date(),
            downloadCount: 0
        };

        fileDatabase.set(downloadCode, fileInfo);

        // 返回下载信息
        res.json({
            success: true,
            downloadCode: downloadCode,
            downloadUrl: `${req.protocol}://${req.get('host')}/download/${downloadCode}`,
            expiryDate: expiryDate,
            fileCount: 1,
            totalSize: 1024,
            message: '文件上传成功（演示模式）'
        });

    } catch (error) {
        console.error('上传错误:', error);
        res.status(500).json({ error: '上传失败: ' + error.message });
    }
});

// 获取文件信息API
app.get('/api/file/:code', (req, res) => {
    try {
        const { code } = req.params;
        const fileInfo = fileDatabase.get(code);

        if (!fileInfo) {
            return res.status(404).json({ error: '文件不存在或已过期' });
        }

        // 检查是否过期
        if (fileInfo.expiryDate && new Date() > fileInfo.expiryDate) {
            // 删除过期文件
            fileInfo.files.forEach(file => {
                try {
                    fs.unlinkSync(file.path);
                } catch (err) {
                    console.error('删除文件失败:', err);
                }
            });
            fileDatabase.delete(code);
            return res.status(404).json({ error: '文件已过期' });
        }

        // 返回文件信息（不包含敏感信息）
        res.json({
            success: true,
            files: fileInfo.files.map(file => ({
                originalName: file.originalname,
                size: file.size,
                mimetype: file.mimetype
            })),
            hasPassword: !!fileInfo.password,
            uploadDate: fileInfo.uploadDate,
            expiryDate: fileInfo.expiryDate
        });

    } catch (error) {
        console.error('获取文件信息错误:', error);
        res.status(500).json({ error: '获取文件信息失败' });
    }
});

// 验证密码API
app.post('/api/verify-password/:code', (req, res) => {
    try {
        const { code } = req.params;
        const { password } = req.body;
        const fileInfo = fileDatabase.get(code);

        if (!fileInfo) {
            return res.status(404).json({ error: '文件不存在' });
        }

        if (fileInfo.password && fileInfo.password !== password) {
            return res.status(401).json({ error: '密码错误' });
        }

        res.json({ success: true });

    } catch (error) {
        console.error('密码验证错误:', error);
        res.status(500).json({ error: '密码验证失败' });
    }
});

// 文件下载API
app.get('/download/:code', (req, res) => {
    try {
        const { code } = req.params;
        const fileInfo = fileDatabase.get(code);

        if (!fileInfo) {
            return res.status(404).send('文件不存在或已过期');
        }

        // 检查是否过期
        if (fileInfo.expiryDate && new Date() > fileInfo.expiryDate) {
            // 删除过期文件
            fileInfo.files.forEach(file => {
                try {
                    fs.unlinkSync(file.path);
                } catch (err) {
                    console.error('删除文件失败:', err);
                }
            });
            fileDatabase.delete(code);
            return res.status(404).send('文件已过期');
        }

        // 如果有密码，需要验证
        if (fileInfo.password) {
            const password = req.query.password;
            if (!password || password !== fileInfo.password) {
                return res.status(401).send('需要密码才能下载');
            }
        }

        // 更新下载次数
        fileInfo.downloadCount++;

        // 模拟文件下载（演示模式）
        const file = fileInfo.files[0];
        
        res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
        res.setHeader('Content-Type', file.mimetype);
        
        // 返回模拟文件内容
        res.send(`这是一个演示文件。

文件信息：
- 下载码：${code}
- 文件名：${file.originalName}
- 大小：${file.size} 字节
- 类型：${file.mimetype}
- 上传时间：${fileInfo.uploadDate.toLocaleString('zh-CN')}
- 过期时间：${fileInfo.expiryDate ? fileInfo.expiryDate.toLocaleString('zh-CN') : '永久保存'}

注意：这是演示模式，实际应用中会返回真实的文件内容。

在Vercel的无服务器环境中，真实的文件上传需要：
1. 使用云存储服务（如AWS S3、Google Cloud Storage）
2. 或者使用专门的文件传输服务
3. 或者部署到支持文件存储的服务器

当前版本用于演示界面和功能流程。`);

    } catch (error) {
        console.error('下载错误:', error);
        res.status(500).send('下载失败');
    }
});

// 删除文件API
app.delete('/api/file/:code', (req, res) => {
    try {
        const { code } = req.params;
        const fileInfo = fileDatabase.get(code);

        if (!fileInfo) {
            return res.status(404).json({ error: '文件不存在' });
        }

        // 删除物理文件
        fileInfo.files.forEach(file => {
            try {
                fs.unlinkSync(file.path);
            } catch (err) {
                console.error('删除文件失败:', err);
            }
        });

        // 从数据库中删除
        fileDatabase.delete(code);

        res.json({ success: true, message: '文件已删除' });

    } catch (error) {
        console.error('删除文件错误:', error);
        res.status(500).json({ error: '删除文件失败' });
    }
});

// 获取统计信息API
app.get('/api/stats', (req, res) => {
    try {
        const stats = {
            totalFiles: fileDatabase.size,
            totalSize: 0,
            activeFiles: 0
        };

        fileDatabase.forEach(fileInfo => {
            stats.totalSize += fileInfo.files.reduce((sum, file) => sum + file.size, 0);
            if (!fileInfo.expiryDate || new Date() <= fileInfo.expiryDate) {
                stats.activeFiles++;
            }
        });

        res.json(stats);

    } catch (error) {
        console.error('获取统计信息错误:', error);
        res.status(500).json({ error: '获取统计信息失败' });
    }
});

// 清理过期文件
function cleanupExpiredFiles() {
    const now = new Date();
    const expiredCodes = [];

    fileDatabase.forEach((fileInfo, code) => {
        if (fileInfo.expiryDate && now > fileInfo.expiryDate) {
            expiredCodes.push(code);
        }
    });

    expiredCodes.forEach(code => {
        const fileInfo = fileDatabase.get(code);
        fileInfo.files.forEach(file => {
            try {
                fs.unlinkSync(file.path);
            } catch (err) {
                console.error('删除过期文件失败:', err);
            }
        });
        fileDatabase.delete(code);
    });

    if (expiredCodes.length > 0) {
        console.log(`清理了 ${expiredCodes.length} 个过期文件`);
    }
}

// 定期清理过期文件（每小时执行一次）
setInterval(cleanupExpiredFiles, 60 * 60 * 1000);

// 错误处理中间件
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: '文件大小超过限制' });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({ error: '文件数量超过限制' });
        }
    }
    
    console.error('服务器错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
});

// 404处理
app.use((req, res) => {
    res.status(404).json({ error: '接口不存在' });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`文件传输服务器运行在端口 ${PORT}`);
    console.log(`访问地址: http://localhost:${PORT}`);
    console.log(`上传目录: ${uploadDir}`);
});

// 优雅关闭
process.on('SIGTERM', () => {
    console.log('收到SIGTERM信号，正在关闭服务器...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('收到SIGINT信号，正在关闭服务器...');
    process.exit(0);
});

export default app;
