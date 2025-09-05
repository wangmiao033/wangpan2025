// Vercel Serverless Function - 获取文件信息 API
import { fileStorage } from '../storage.js';

export default async function handler(req, res) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: '只支持 GET 请求' });
  }

  const { code } = req.query;
  
  if (!code) {
    return res.status(400).json({ error: '缺少文件码' });
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

    // 返回文件信息（不包含敏感信息）
    res.json({
      success: true,
      files: fileInfo.files.map(file => ({
        originalName: file.originalName,
        size: file.size,
        mimetype: file.mimetype
      })),
      hasPassword: !!fileInfo.password,
      uploadDate: fileInfo.uploadDate,
      expiryDate: fileInfo.expiryDate,
      downloadCount: fileInfo.downloadCount
    });

  } catch (error) {
    console.error('获取文件信息错误:', error);
    res.status(500).json({ error: '获取文件信息失败' });
  }
}
