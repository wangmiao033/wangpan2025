// Vercel Serverless Function - 获取文件信息 API
export default async function handler(req, res) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { code } = req.query;
  
  if (!code) {
    return res.status(400).json({ error: '缺少文件码' });
  }

  try {
    // 模拟文件信息
    res.json({
      success: true,
      files: [{
        originalName: 'demo-file.txt',
        size: 1024,
        mimetype: 'text/plain'
      }],
      hasPassword: false,
      uploadDate: new Date(),
      message: '演示模式 - 文件信息获取成功'
    });

  } catch (error) {
    console.error('获取文件信息错误:', error);
    res.status(500).json({ error: '获取文件信息失败' });
  }
}