// Vercel Serverless Function - 文件上传 API
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// 由于 Vercel 是无状态的，我们使用内存存储
// 实际应用中应该使用外部存储服务如 AWS S3
const fileStorage = new Map();

// 生成唯一ID
function generateId() {
  return crypto.randomBytes(16).toString('hex');
}

// 生成下载码
function generateDownloadCode() {
  return crypto.randomBytes(8).toString('hex');
}

export default async function handler(req, res) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持 POST 请求' });
  }

  try {
    // 解析表单数据
    const form = formidable({
      maxFileSize: 100 * 1024 * 1024, // 100MB 限制（Vercel 限制）
      maxFiles: 5,
      uploadDir: '/tmp', // Vercel 临时目录
      keepExtensions: true
    });

    const [fields, files] = await form.parse(req);
    
    if (!files.files || files.files.length === 0) {
      return res.status(400).json({ error: '没有文件被上传' });
    }

    const password = fields.password ? fields.password[0] : null;
    const expiry = parseInt(fields.expiry ? fields.expiry[0] : '7');
    const downloadCode = generateDownloadCode();
    
    // 计算过期时间
    const expiryDate = expiry === 0 ? null : new Date(Date.now() + expiry * 24 * 60 * 60 * 1000);
    
    // 处理上传的文件
    const uploadedFiles = [];
    const fileArray = Array.isArray(files.files) ? files.files : [files.files];
    
    for (const file of fileArray) {
      // 读取文件内容
      const fileContent = fs.readFileSync(file.filepath);
      
      // 存储文件信息
      uploadedFiles.push({
        originalName: file.originalFilename,
        filename: file.newFilename,
        size: file.size,
        mimetype: file.mimetype,
        content: fileContent.toString('base64') // 转换为 base64 存储
      });
      
      // 删除临时文件
      fs.unlinkSync(file.filepath);
    }

    // 存储文件信息
    const fileInfo = {
      id: generateId(),
      downloadCode: downloadCode,
      files: uploadedFiles,
      password: password,
      expiryDate: expiryDate,
      uploadDate: new Date(),
      downloadCount: 0
    };

    fileStorage.set(downloadCode, fileInfo);

    // 返回下载信息
    res.status(200).json({
      success: true,
      downloadCode: downloadCode,
      downloadUrl: `${req.headers.origin || 'https://your-app.vercel.app'}/api/download/${downloadCode}`,
      expiryDate: expiryDate,
      fileCount: uploadedFiles.length,
      totalSize: uploadedFiles.reduce((sum, file) => sum + file.size, 0)
    });

  } catch (error) {
    console.error('上传错误:', error);
    res.status(500).json({ error: '上传失败: ' + error.message });
  }
}

// 导出配置
export const config = {
  api: {
    bodyParser: false, // 禁用默认的 body parser，使用 formidable
  },
};
