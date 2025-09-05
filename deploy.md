# 🚀 部署指南

本指南将帮助您将文件传输网站部署到各种云平台。

## 📋 部署前准备

### 1. 确保项目完整性
确保以下文件都存在：
- `index.html` - 主页面
- `style.css` - 样式文件
- `script.js` - 前端脚本
- `server.js` - 后端服务器
- `package.json` - 项目配置
- `README.md` - 项目说明

### 2. 安装依赖
```bash
npm install
```

### 3. 测试本地运行
```bash
npm start
```
访问 `http://localhost:3000` 确认网站正常运行。

## 🌐 部署选项

### 选项 1: Heroku 部署 (推荐)

Heroku 是最简单的部署方式，支持 Node.js 应用。

#### 步骤：

1. **注册 Heroku 账号**
   - 访问 [Heroku](https://heroku.com)
   - 注册免费账号

2. **安装 Heroku CLI**
   ```bash
   # Windows
   # 下载并安装 https://devcenter.heroku.com/articles/heroku-cli
   
   # macOS
   brew install heroku/brew/heroku
   
   # Linux
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

3. **登录 Heroku**
   ```bash
   heroku login
   ```

4. **创建应用**
   ```bash
   heroku create your-file-transfer-app
   ```

5. **设置环境变量** (可选)
   ```bash
   heroku config:set NODE_ENV=production
   ```

6. **部署应用**
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push heroku main
   ```

7. **打开应用**
   ```bash
   heroku open
   ```

#### Heroku 注意事项：
- 免费版有休眠限制（30分钟无访问会休眠）
- 文件存储是临时的，重启后会丢失
- 建议升级到付费版获得更好的性能

### 选项 2: Vercel 部署

Vercel 提供优秀的静态网站托管服务。

#### 步骤：

1. **安装 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```

3. **部署**
   ```bash
   vercel
   ```

4. **按照提示完成部署**

#### Vercel 注意事项：
- 主要适合静态网站
- 需要配置 serverless functions 来支持后端功能
- 免费版有带宽限制

### 选项 3: Netlify 部署

Netlify 是另一个优秀的静态网站托管平台。

#### 步骤：

1. **访问 Netlify**
   - 访问 [Netlify](https://netlify.com)
   - 注册账号

2. **连接 GitHub**
   - 将代码推送到 GitHub 仓库
   - 在 Netlify 中连接 GitHub 仓库

3. **配置构建设置**
   - 构建命令: `npm run build` (如果需要)
   - 发布目录: `.` (根目录)

4. **部署**
   - 点击 "Deploy site" 按钮

### 选项 4: Railway 部署

Railway 是一个现代的云平台，支持 Node.js 应用。

#### 步骤：

1. **访问 Railway**
   - 访问 [Railway](https://railway.app)
   - 注册账号

2. **连接 GitHub**
   - 连接您的 GitHub 账号
   - 选择项目仓库

3. **自动部署**
   - Railway 会自动检测 Node.js 项目
   - 自动构建和部署

### 选项 5: DigitalOcean App Platform

DigitalOcean 提供简单易用的应用平台。

#### 步骤：

1. **访问 DigitalOcean**
   - 访问 [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
   - 注册账号

2. **创建应用**
   - 点击 "Create App"
   - 连接 GitHub 仓库

3. **配置应用**
   - 选择 Node.js 环境
   - 设置构建和运行命令

4. **部署**
   - 点击 "Create Resources"

## 🔧 部署后配置

### 1. 设置自定义域名 (可选)

大多数平台都支持自定义域名：

```bash
# Heroku
heroku domains:add yourdomain.com

# 在域名提供商处设置 CNAME 记录指向应用地址
```

### 2. 配置 HTTPS

大多数平台都自动提供 HTTPS 证书。

### 3. 设置环境变量

```bash
# Heroku
heroku config:set NODE_ENV=production
heroku config:set PORT=3000

# 其他平台在控制面板中设置
```

### 4. 监控和日志

```bash
# Heroku
heroku logs --tail

# 查看应用状态
heroku ps
```

## 🛠️ 故障排除

### 常见问题：

1. **部署失败**
   - 检查 `package.json` 中的依赖
   - 确保 Node.js 版本兼容
   - 查看部署日志

2. **文件上传失败**
   - 检查文件大小限制
   - 确保上传目录权限正确
   - 查看服务器日志

3. **静态文件无法访问**
   - 检查 `express.static` 配置
   - 确保文件路径正确

4. **CORS 错误**
   - 检查 CORS 配置
   - 确保允许的域名正确

### 调试命令：

```bash
# 查看应用日志
heroku logs --tail

# 重启应用
heroku restart

# 查看应用状态
heroku ps

# 进入应用容器
heroku run bash
```

## 📊 性能优化

### 1. 启用压缩
```javascript
const compression = require('compression');
app.use(compression());
```

### 2. 设置缓存
```javascript
app.use(express.static('.', {
  maxAge: '1d'
}));
```

### 3. 使用 CDN
- 将静态文件上传到 CDN
- 使用 CloudFlare 等 CDN 服务

### 4. 数据库优化
- 使用 Redis 缓存文件信息
- 使用 MongoDB 或 PostgreSQL 存储元数据

## 🔒 安全配置

### 1. 设置安全头
```javascript
const helmet = require('helmet');
app.use(helmet());
```

### 2. 限制文件类型
```javascript
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/', 'video/', 'audio/', 'application/pdf'];
  if (allowedTypes.some(type => file.mimetype.startsWith(type))) {
    cb(null, true);
  } else {
    cb(new Error('不支持的文件类型'), false);
  }
};
```

### 3. 设置上传限制
```javascript
const upload = multer({
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
    files: 5
  }
});
```

## 📈 监控和维护

### 1. 设置监控
- 使用 New Relic 或 DataDog 监控应用性能
- 设置错误报警

### 2. 定期备份
- 定期备份上传的文件
- 备份数据库

### 3. 更新依赖
```bash
npm update
npm audit fix
```

## 🎯 最佳实践

1. **使用环境变量** 存储敏感信息
2. **启用日志记录** 便于调试
3. **设置健康检查** 端点
4. **使用进程管理器** 如 PM2
5. **定期更新依赖** 保持安全性

---

选择适合您需求的部署方式，按照步骤操作即可成功部署您的文件传输网站！
