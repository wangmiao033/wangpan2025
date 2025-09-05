// Vercel Serverless Function - 密码验证 API
import { fileStorage } from '../storage.js';

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

  const { code } = req.query;
  const { password } = req.body;
  
  if (!code) {
    return res.status(400).json({ error: '缺少文件码' });
  }

  if (!password) {
    return res.status(400).json({ error: '缺少密码' });
  }

  try {
    const fileInfo = fileStorage.get(code);

    if (!fileInfo) {
      return res.status(404).json({ error: '文件不存在' });
    }

    // 检查是否过期
    if (fileInfo.expiryDate && new Date() > fileInfo.expiryDate) {
      fileStorage.delete(code);
      return res.status(404).json({ error: '文件已过期' });
    }

    if (fileInfo.password && fileInfo.password !== password) {
      return res.status(401).json({ error: '密码错误' });
    }

    res.json({ 
      success: true,
      message: '密码验证成功'
    });

  } catch (error) {
    console.error('密码验证错误:', error);
    res.status(500).json({ error: '密码验证失败' });
  }
}
