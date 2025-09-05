// Vercel Serverless Function - 文件下载 API
import { fileStorage } from '../storage.js';

export default async function handler(req, res) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { code } = req.query;
  
  if (!code) {
    return res.status(400).json({ error: '缺少下载码' });
  }

  try {
    const fileInfo = fileStorage.get(code);

    if (!fileInfo) {
      return res.status(404).json({ error: '文件不存在或已过期' });
    }

    // 检查是否过期
    if (fileInfo.expiryDate && new Date() > fileInfo.expiryDate) {
      fileStorage.delete(code);
      return res.status(404).json({ error: '文件已过期' });
    }

    // 如果有密码，需要验证
    if (fileInfo.password) {
      const password = req.query.password || req.body?.password;
      if (!password || password !== fileInfo.password) {
        return res.status(401).json({ error: '需要密码才能下载' });
      }
    }

    // 更新下载次数
    fileInfo.downloadCount++;

    // 如果只有一个文件，直接下载
    if (fileInfo.files.length === 1) {
      const file = fileInfo.files[0];
      const fileBuffer = Buffer.from(file.content, 'base64');
      
      res.setHeader('Content-Type', file.mimetype);
      res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
      res.setHeader('Content-Length', fileBuffer.length);
      
      return res.send(fileBuffer);
    } else {
      // 多个文件，返回文件列表
      return res.json({
        success: true,
        files: fileInfo.files.map(file => ({
          originalName: file.originalName,
          size: file.size,
          mimetype: file.mimetype,
          downloadUrl: `${req.headers.origin || 'https://your-app.vercel.app'}/api/download/${code}?file=${encodeURIComponent(file.originalName)}`
        })),
        uploadDate: fileInfo.uploadDate,
        expiryDate: fileInfo.expiryDate
      });
    }

  } catch (error) {
    console.error('下载错误:', error);
    res.status(500).json({ error: '下载失败' });
  }
}
