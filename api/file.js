export default function handler(req, res) {
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

  try {
    const { code } = req.query;
    
    if (!code) {
      return res.status(400).json({ error: '缺少下载码参数' });
    }

    // 模拟文件信息（演示模式）
    res.status(200).json({
      success: true,
      files: [{
        originalName: 'demo-file.txt',
        size: 1024,
        mimetype: 'text/plain'
      }],
      hasPassword: false,
      uploadDate: new Date(),
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

  } catch (error) {
    console.error('获取文件信息错误:', error);
    res.status(500).json({ error: '获取文件信息失败' });
  }
}
