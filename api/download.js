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

    // 模拟文件下载（演示模式）
    res.setHeader('Content-Disposition', 'attachment; filename="demo-file.txt"');
    res.setHeader('Content-Type', 'text/plain');
    
    // 返回模拟文件内容
    res.send(`这是一个演示文件。

文件信息：
- 下载码：${code}
- 文件名：demo-file.txt
- 大小：1024 字节
- 类型：text/plain
- 上传时间：${new Date().toLocaleString('zh-CN')}

注意：这是演示模式，实际应用中会返回真实的文件内容。`);

  } catch (error) {
    console.error('下载错误:', error);
    res.status(500).json({ error: '下载失败' });
  }
}
