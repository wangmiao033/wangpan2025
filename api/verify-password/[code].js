// Vercel Serverless Function - 密码验证 API
export default async function handler(req, res) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { code } = req.query;
  const { password } = req.body;
  
  if (!code) {
    return res.status(400).json({ error: '缺少文件码' });
  }

  try {
    // 模拟密码验证
    res.json({ 
      success: true,
      message: '密码验证成功（演示模式）'
    });

  } catch (error) {
    console.error('密码验证错误:', error);
    res.status(500).json({ error: '密码验证失败' });
  }
}