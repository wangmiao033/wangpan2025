# 📁 免费大文件传输网站

一个功能强大的文件传输网站，支持无限制文件大小，快速安全传输。

## ✨ 功能特点

- 🚀 **无文件大小限制** - 支持任意大小的文件传输
- 🔒 **安全加密** - 所有文件传输都经过加密处理
- 🛡️ **密码保护** - 可为文件设置访问密码
- ⏰ **自动过期** - 文件会在设定时间后自动删除
- 📱 **响应式设计** - 完美支持手机、平板、电脑
- 🎨 **现代UI** - 美观的用户界面，优秀的用户体验
- 🌐 **多语言支持** - 支持中文界面
- 📊 **实时进度** - 显示上传下载进度

## 🛠️ 技术栈

### 前端
- HTML5
- CSS3 (响应式设计)
- JavaScript (ES6+)
- 现代浏览器API

### 后端
- Node.js
- Express.js
- Multer (文件上传)
- CORS (跨域支持)

## 📦 安装和运行

### 环境要求
- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/wangmiao033/wangpan2025.git
cd wangpan2025
```

2. **安装依赖**
```bash
npm install
```

3. **启动服务器**
```bash
npm start
```

4. **开发模式** (可选)
```bash
npm run dev
```

5. **访问网站**
打开浏览器访问: `http://localhost:3000`

## 🚀 部署到生产环境

### 使用 Heroku 部署

1. **安装 Heroku CLI**
```bash
# 下载并安装 Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli
```

2. **登录 Heroku**
```bash
heroku login
```

3. **创建应用**
```bash
heroku create your-app-name
```

4. **部署**
```bash
git add .
git commit -m "Initial commit"
git push heroku main
```

5. **打开应用**
```bash
heroku open
```

### 使用 Vercel 部署

1. **安装 Vercel CLI**
```bash
npm i -g vercel
```

2. **部署**
```bash
vercel
```

3. **按照提示完成部署**

### 使用 Netlify 部署

1. **构建项目**
```bash
npm run build
```

2. **上传到 Netlify**
- 访问 [Netlify](https://netlify.com)
- 拖拽 `dist` 文件夹到部署区域

## 📖 使用说明

### 上传文件
1. 点击"选择文件"按钮或直接拖拽文件到上传区域
2. 可选择设置密码和有效期
3. 点击"开始上传"等待完成
4. 复制生成的下载链接分享给他人

### 下载文件
1. 在上方输入下载码或粘贴下载链接
2. 点击"获取文件"按钮
3. 如有密码，输入密码后下载

## 🔧 API 接口

### 上传文件
```
POST /api/upload
Content-Type: multipart/form-data

参数:
- files: 文件数组
- password: 密码 (可选)
- expiry: 有效期天数 (可选，默认7天)
```

### 获取文件信息
```
GET /api/file/:code
```

### 验证密码
```
POST /api/verify-password/:code
Content-Type: application/json

{
  "password": "your_password"
}
```

### 下载文件
```
GET /download/:code?password=your_password
```

### 删除文件
```
DELETE /api/file/:code
```

### 获取统计信息
```
GET /api/stats
```

## 🔒 安全特性

- **文件加密**: 所有文件在传输过程中都经过加密
- **密码保护**: 支持为文件设置访问密码
- **自动过期**: 文件会在设定时间后自动删除
- **访问控制**: 防止未授权访问
- **文件验证**: 验证文件类型和大小

## 📱 浏览器支持

- Chrome >= 60
- Firefox >= 55
- Safari >= 12
- Edge >= 79

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🆘 常见问题

### Q: 支持哪些文件类型？
A: 支持所有文件类型，包括图片、视频、文档、压缩包等。

### Q: 文件大小有限制吗？
A: 理论上没有限制，但受服务器存储空间和网络带宽限制。

### Q: 文件会保存多久？
A: 默认保存7天，可以设置为1天、7天、30天或永久保存。

### Q: 如何保证文件安全？
A: 所有文件都经过加密处理，支持密码保护，过期自动删除。

### Q: 支持批量上传吗？
A: 是的，支持同时上传多个文件。

## 📞 联系我们

- 项目地址: https://github.com/wangmiao033/wangpan2025
- 问题反馈: https://github.com/wangmiao033/wangpan2025/issues

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者！

---

⭐ 如果这个项目对你有帮助，请给它一个星标！
