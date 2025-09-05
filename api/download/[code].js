// Vercel Serverless Function - 文件下载 API
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
    return res.status(400).json({ error: '缺少下载码' });
  }

  try {
    // 模拟文件下载
    res.status(200).json({
      success: true,
      message: '文件下载成功（演示模式）',
      downloadCode: code,
      note: '这是一个演示版本，实际文件传输功能需要完整实现'
    });

  } catch (error) {
    console.error('下载错误:', error);
    res.status(500).json({ error: '下载失败' });
  }
}