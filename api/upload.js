// Vercel Serverless Function - 文件上传 API
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
    // 模拟文件上传成功
    const downloadCode = Math.random().toString(36).substring(2, 15);
    
    res.status(200).json({
      success: true,
      downloadCode: downloadCode,
      downloadUrl: `${req.headers.origin || 'https://wangpan2025.vercel.app'}/api/download/${downloadCode}`,
      message: '文件上传成功（演示模式）'
    });

  } catch (error) {
    console.error('上传错误:', error);
    res.status(500).json({ error: '上传失败: ' + error.message });
  }
}