# 🚀 文件传输网站部署指南

## 📋 项目概述

这是一个功能完整的文件传输网站，支持：
- ✅ 无文件大小限制上传
- ✅ 密码保护功能
- ✅ 自动过期删除
- ✅ 拖拽上传界面
- ✅ 响应式设计
- ✅ 多文件下载

## 🛠️ 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **后端**: Node.js, Express.js
- **文件处理**: Multer, Archiver
- **部署平台**: Vercel (推荐)

## 📦 本地开发

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
# 使用完整服务器（推荐）
npm run dev

# 或使用测试服务器
npm run test-local
```

### 3. 访问网站
打开浏览器访问: `http://localhost:3000`

## 🌐 Vercel 部署

### 方法一：使用 Vercel CLI（推荐）

1. **安装 Vercel CLI**
```bash
npm i -g vercel
```

2. **登录 Vercel**
```bash
vercel login
```

3. **部署项目**
```bash
vercel --prod
```

4. **访问网站**
部署完成后会显示网站URL

### 方法二：通过 GitHub 部署

1. **推送代码到 GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **连接 Vercel**
- 访问 [vercel.com](https://vercel.com)
- 点击 "New Project"
- 选择你的 GitHub 仓库
- 点击 "Deploy"

## 🔧 配置说明

### 环境变量
项目无需特殊环境变量配置，所有功能开箱即用。

### 文件存储
- **本地开发**: 文件存储在 `uploads/` 目录
- **Vercel部署**: 文件存储在 `/tmp/uploads` 目录（临时存储）

### 文件限制
- 最大文件大小: 10GB
- 最大文件数量: 10个
- 支持所有文件类型

## 📁 项目结构

```
├── api/                    # Vercel API 函数
│   ├── upload.js          # 文件上传API
│   ├── file/[code].js     # 文件信息API
│   ├── verify-password/[code].js  # 密码验证API
│   ├── download/[code].js # 文件下载API
│   └── test.js            # 测试API
├── index.html             # 主页面
├── style.css              # 样式文件
├── script.js              # 前端功能
├── server.js              # 完整服务器（本地开发）
├── test-local.js          # 测试服务器
├── package.json           # 项目配置
├── vercel.json            # Vercel配置
└── README.md              # 项目文档
```

## 🧪 功能测试

### 1. 上传测试
- 选择文件或拖拽文件到上传区域
- 设置密码和过期时间（可选）
- 点击"开始上传"
- 复制生成的下载链接

### 2. 下载测试
- 输入下载码或粘贴下载链接
- 如有密码，输入密码
- 点击"获取文件"下载

### 3. API测试
访问 `/api/test` 检查API是否正常工作

## 🔒 安全特性

- **文件加密**: 所有文件传输都经过加密
- **密码保护**: 支持为文件设置访问密码
- **自动过期**: 文件会在设定时间后自动删除
- **访问控制**: 防止未授权访问
- **文件验证**: 验证文件类型和大小

## 📱 浏览器支持

- Chrome >= 60
- Firefox >= 55
- Safari >= 12
- Edge >= 79

## 🆘 常见问题

### Q: 上传失败怎么办？
A: 检查文件大小是否超过10GB限制，或网络连接是否正常。

### Q: 下载链接无效？
A: 检查下载码是否正确，文件是否已过期。

### Q: 密码验证失败？
A: 确认密码输入正确，区分大小写。

### Q: 多文件下载不工作？
A: 确保已安装archiver包，或使用单文件下载。

## 📞 技术支持

- 📚 查看 `README.md` 获取详细文档
- 🐛 提交 Issue: [GitHub Issues](https://github.com/wangmiao033/wangpan2025/issues)
- 💬 讨论交流: [GitHub Discussions](https://github.com/wangmiao033/wangpan2025/discussions)

## 🎉 部署成功！

恭喜！您的文件传输网站已经成功部署并可以正常使用。

**立即开始分享您的文件吧！** 🚀
