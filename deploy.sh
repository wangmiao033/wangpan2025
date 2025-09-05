#!/bin/bash

# 文件传输网站部署脚本
# 支持多种部署平台

echo "🚀 文件传输网站部署脚本"
echo "=========================="

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

# 检查 npm 是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 npm"
    exit 1
fi

echo "✅ Node.js 和 npm 已安装"

# 安装依赖
echo "📦 安装项目依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo "✅ 依赖安装成功"

# 选择部署方式
echo ""
echo "请选择部署方式："
echo "1) Heroku"
echo "2) Vercel"
echo "3) Netlify"
echo "4) Railway"
echo "5) 本地测试"
echo "6) 退出"

read -p "请输入选项 (1-6): " choice

case $choice in
    1)
        echo "🌐 部署到 Heroku..."
        
        # 检查 Heroku CLI 是否安装
        if ! command -v heroku &> /dev/null; then
            echo "❌ Heroku CLI 未安装"
            echo "请访问 https://devcenter.heroku.com/articles/heroku-cli 安装"
            exit 1
        fi
        
        # 检查是否已登录
        if ! heroku auth:whoami &> /dev/null; then
            echo "请先登录 Heroku:"
            heroku login
        fi
        
        # 创建应用
        read -p "请输入应用名称 (或按回车使用默认名称): " app_name
        if [ -z "$app_name" ]; then
            app_name="file-transfer-$(date +%s)"
        fi
        
        echo "创建 Heroku 应用: $app_name"
        heroku create $app_name
        
        # 部署
        echo "部署到 Heroku..."
        git add .
        git commit -m "Deploy to Heroku"
        git push heroku main
        
        echo "✅ 部署完成！"
        echo "访问地址: https://$app_name.herokuapp.com"
        ;;
        
    2)
        echo "🌐 部署到 Vercel..."
        
        # 检查 Vercel CLI 是否安装
        if ! command -v vercel &> /dev/null; then
            echo "安装 Vercel CLI..."
            npm install -g vercel
        fi
        
        # 部署
        vercel --prod
        
        echo "✅ 部署完成！"
        ;;
        
    3)
        echo "🌐 部署到 Netlify..."
        echo "请按照以下步骤操作："
        echo "1. 访问 https://netlify.com"
        echo "2. 注册/登录账号"
        echo "3. 点击 'New site from Git'"
        echo "4. 连接 GitHub 仓库"
        echo "5. 设置构建设置："
        echo "   - Build command: npm run build (如果需要)"
        echo "   - Publish directory: ."
        echo "6. 点击 'Deploy site'"
        ;;
        
    4)
        echo "🌐 部署到 Railway..."
        echo "请按照以下步骤操作："
        echo "1. 访问 https://railway.app"
        echo "2. 注册/登录账号"
        echo "3. 点击 'New Project'"
        echo "4. 选择 'Deploy from GitHub repo'"
        echo "5. 选择您的仓库"
        echo "6. Railway 会自动检测并部署"
        ;;
        
    5)
        echo "🧪 启动本地测试服务器..."
        echo "服务器将在 http://localhost:3000 启动"
        echo "按 Ctrl+C 停止服务器"
        npm start
        ;;
        
    6)
        echo "👋 退出部署脚本"
        exit 0
        ;;
        
    *)
        echo "❌ 无效选项"
        exit 1
        ;;
esac

echo ""
echo "🎉 部署完成！"
echo ""
echo "📖 更多部署信息请查看 deploy.md 文件"
echo "📚 项目文档请查看 README.md 文件"
