@echo off
chcp 65001 >nul
title 文件传输网站部署脚本

echo 🚀 文件传输网站部署脚本
echo ==========================

:: 检查 Node.js 是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装，请先安装 Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

:: 检查 npm 是否安装
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm 未安装，请先安装 npm
    pause
    exit /b 1
)

echo ✅ Node.js 和 npm 已安装

:: 安装依赖
echo 📦 安装项目依赖...
npm install

if %errorlevel% neq 0 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)

echo ✅ 依赖安装成功

:: 选择部署方式
echo.
echo 请选择部署方式：
echo 1) Heroku
echo 2) Vercel
echo 3) Netlify
echo 4) Railway
echo 5) 本地测试
echo 6) 退出

set /p choice="请输入选项 (1-6): "

if "%choice%"=="1" goto heroku
if "%choice%"=="2" goto vercel
if "%choice%"=="3" goto netlify
if "%choice%"=="4" goto railway
if "%choice%"=="5" goto local
if "%choice%"=="6" goto exit
goto invalid

:heroku
echo 🌐 部署到 Heroku...

:: 检查 Heroku CLI 是否安装
heroku --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Heroku CLI 未安装
    echo 请访问 https://devcenter.heroku.com/articles/heroku-cli 安装
    pause
    exit /b 1
)

:: 检查是否已登录
heroku auth:whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo 请先登录 Heroku:
    heroku login
)

:: 创建应用
set /p app_name="请输入应用名称 (或按回车使用默认名称): "
if "%app_name%"=="" (
    set app_name=file-transfer-%random%
)

echo 创建 Heroku 应用: %app_name%
heroku create %app_name%

:: 部署
echo 部署到 Heroku...
git add .
git commit -m "Deploy to Heroku"
git push heroku main

echo ✅ 部署完成！
echo 访问地址: https://%app_name%.herokuapp.com
goto end

:vercel
echo 🌐 部署到 Vercel...

:: 检查 Vercel CLI 是否安装
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 安装 Vercel CLI...
    npm install -g vercel
)

:: 部署
vercel --prod

echo ✅ 部署完成！
goto end

:netlify
echo 🌐 部署到 Netlify...
echo 请按照以下步骤操作：
echo 1. 访问 https://netlify.com
echo 2. 注册/登录账号
echo 3. 点击 'New site from Git'
echo 4. 连接 GitHub 仓库
echo 5. 设置构建设置：
echo    - Build command: npm run build (如果需要)
echo    - Publish directory: .
echo 6. 点击 'Deploy site'
goto end

:railway
echo 🌐 部署到 Railway...
echo 请按照以下步骤操作：
echo 1. 访问 https://railway.app
echo 2. 注册/登录账号
echo 3. 点击 'New Project'
echo 4. 选择 'Deploy from GitHub repo'
echo 5. 选择您的仓库
echo 6. Railway 会自动检测并部署
goto end

:local
echo 🧪 启动本地测试服务器...
echo 服务器将在 http://localhost:3000 启动
echo 按 Ctrl+C 停止服务器
npm start
goto end

:invalid
echo ❌ 无效选项
pause
exit /b 1

:exit
echo 👋 退出部署脚本
exit /b 0

:end
echo.
echo 🎉 部署完成！
echo.
echo 📖 更多部署信息请查看 deploy.md 文件
echo 📚 项目文档请查看 README.md 文件
pause
