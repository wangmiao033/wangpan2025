export default function handler(req, res) {
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
    // 模拟文件上传成功（演示模式）
    const password = req.body.password || null;
    const expiry = parseInt(req.body.expiry) || 7;
    const downloadCode = Math.random().toString(36).substring(2, 15);
    
    // 计算过期时间
    const expiryDate = expiry === 0 ? null : new Date(Date.now() + expiry * 24 * 60 * 60 * 1000);
    
    // 返回下载信息
    res.status(200).json({
      success: true,
      downloadCode: downloadCode,
      downloadUrl: `${req.headers.origin || 'https://wangpan2025.vercel.app'}/download/${downloadCode}`,
      expiryDate: expiryDate,
      fileCount: 1,
      totalSize: 1024,
      message: '文件上传成功（演示模式）'
    });

  } catch (error) {
    console.error('处理上传错误:', error);
    res.status(500).json({ error: '上传失败: ' + error.message });
  }
}