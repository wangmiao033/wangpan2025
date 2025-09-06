// 文件下载API

// 文件下载API
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
    const { password } = req.query;
    
    if (!code) {
      return res.status(400).json({ error: '缺少下载码参数' });
    }

    // 从全局文件数据库获取文件信息
    const fileInfo = global.fileDatabase?.get(code);

    if (!fileInfo) {
      return res.status(404).json({ error: '文件不存在或已过期' });
    }

    // 检查是否过期
    if (fileInfo.expiryDate && new Date() > fileInfo.expiryDate) {
      // 删除过期文件
      fileInfo.files.forEach(file => {
        try {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (err) {
          console.error('删除文件失败:', err);
        }
      });
      global.fileDatabase?.delete(code);
      return res.status(404).json({ error: '文件已过期' });
    }

    // 检查密码
    if (fileInfo.password && fileInfo.password !== password) {
      return res.status(401).json({ error: '需要密码才能下载' });
    }

    // 更新下载次数
    fileInfo.downloadCount++;

    // 模拟文件下载（演示模式）
    const file = fileInfo.files[0];
    
    res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
    res.setHeader('Content-Type', file.mimetype);
    
    // 返回模拟文件内容
    res.send('这是一个演示文件。在实际应用中，这里会返回真实的文件内容。\n\n文件信息：\n- 文件名：' + file.originalName + '\n- 大小：' + file.size + ' 字节\n- 类型：' + file.mimetype);

  } catch (error) {
    console.error('下载错误:', error);
    res.status(500).json({ error: '下载失败' });
  }
}