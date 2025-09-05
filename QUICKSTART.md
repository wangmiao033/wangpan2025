# ⚡ 快速启动指南

## 🚀 5分钟快速部署

### 方法一：使用部署脚本 (推荐)

#### Windows 用户：
```bash
# 双击运行
deploy.bat
```

#### Mac/Linux 用户：
```bash
# 给脚本执行权限
chmod +x deploy.sh

# 运行脚本
./deploy.sh
```

### 方法二：手动部署到 Heroku

1. **安装 Heroku CLI**
   - 下载：https://devcenter.heroku.com/articles/heroku-cli

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

### 方法三：本地测试

1. **安装依赖**
   ```bash
   npm install
   ```

2. **启动服务器**
   ```bash
   npm start
   ```

3. **访问网站**
   ```
   http://localhost:3000
   ```

## 📁 项目文件说明

- `index.html` - 主页面
- `style.css` - 样式文件
- `script.js` - 前端功能
- `server.js` - 后端服务器
- `package.json` - 项目配置
- `README.md` - 详细文档
- `deploy.md` - 部署指南
- `deploy.sh` - Linux/Mac 部署脚本
- `deploy.bat` - Windows 部署脚本

## 🎯 功能特点

- ✅ 无文件大小限制
- ✅ 拖拽上传
- ✅ 密码保护
- ✅ 自动过期
- ✅ 响应式设计
- ✅ 现代UI界面

## 🔧 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0

## 📞 需要帮助？

- 查看 `README.md` 获取详细文档
- 查看 `deploy.md` 获取部署指南
- 提交 Issue: https://github.com/wangmiao033/wangpan2025/issues

---

🎉 **恭喜！您的文件传输网站已经准备就绪！**
