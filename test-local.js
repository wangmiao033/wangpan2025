// 本地测试脚本
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

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

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 * 1024, // 10GB
        files: 10
    }
});

// 文件信息存储
const fileDatabase = new Map();

// 生成下载码
function generateDownloadCode() {
    return crypto.randomBytes(8).toString('hex');
}

// 文件上传API
app.post('/api/upload', upload.array('files', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: '没有文件被上传' });
        }

        const password = req.body.password || null;
        const expiry = parseInt(req.body.expiry) || 7;
        const downloadCode = generateDownloadCode();
        
        const expiryDate = expiry === 0 ? null : new Date(Date.now() + expiry * 24 * 60 * 60 * 1000);
        
        const fileInfo = {
            id: crypto.randomBytes(16).toString('hex'),
            downloadCode: downloadCode,
            files: req.files.map(file => ({
                originalName: file.originalname,
                filename: file.filename,
                size: file.size,
                mimetype: file.mimetype,
                path: file.path
            })),
            password: password,
            expiryDate: expiryDate,
            uploadDate: new Date(),
            downloadCount: 0
        };

        fileDatabase.set(downloadCode, fileInfo);

        res.json({
            success: true,
            downloadCode: downloadCode,
            downloadUrl: `${req.protocol}://${req.get('host')}/download/${downloadCode}`,
            expiryDate: expiryDate,
            fileCount: req.files.length,
            totalSize: req.files.reduce((sum, file) => sum + file.size, 0)
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

        if (fileInfo.expiryDate && new Date() > fileInfo.expiryDate) {
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

        res.json({
            success: true,
            files: fileInfo.files.map(file => ({
                originalName: file.originalName,
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

        if (fileInfo.expiryDate && new Date() > fileInfo.expiryDate) {
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

        if (fileInfo.password) {
            const password = req.query.password;
            if (!password || password !== fileInfo.password) {
                return res.status(401).send('需要密码才能下载');
            }
        }

        fileInfo.downloadCount++;

        if (fileInfo.files.length === 1) {
            const file = fileInfo.files[0];
            res.download(file.path, file.originalName);
        } else {
            res.status(501).send('多文件下载功能需要安装archiver包');
        }

    } catch (error) {
        console.error('下载错误:', error);
        res.status(500).send('下载失败');
    }
});

// 测试API
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'Hello from local server!',
        timestamp: new Date().toISOString(),
        success: true
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`本地测试服务器运行在端口 ${PORT}`);
    console.log(`访问地址: http://localhost:${PORT}`);
    console.log(`上传目录: ${uploadDir}`);
});

export default app;
