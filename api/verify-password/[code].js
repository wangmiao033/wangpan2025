// 验证密码API
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
    const { code } = req.query;
    const { password } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: '缺少下载码参数' });
    }

    // 从全局文件数据库获取文件信息
    const fileInfo = global.fileDatabase?.get(code);

    if (!fileInfo) {
      return res.status(404).json({ error: '文件不存在' });
    }

    // 检查密码
    if (fileInfo.password && fileInfo.password !== password) {
      return res.status(401).json({ error: '密码错误' });
    }

    res.status(200).json({ success: true });

  } catch (error) {
    console.error('密码验证错误:', error);
    res.status(500).json({ error: '密码验证失败' });
  }
}