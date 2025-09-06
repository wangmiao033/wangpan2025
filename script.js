// 文件传输网站前端功能
class FileTransferApp {
    constructor() {
        this.selectedFiles = [];
        this.init();
    }

    init() {
        console.log('FileTransferApp initializing...');
        this.setupEventListeners();
        this.setupDragAndDrop();
        console.log('FileTransferApp initialized successfully');
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // 文件选择
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
            console.log('File input listener added');
        } else {
            console.error('File input element not found');
        }

        // 下载按钮
        const downloadBtn = document.querySelector('.download-input button');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadFile());
            console.log('Download button listener added');
        } else {
            console.error('Download button not found');
        }

        // 回车键下载
        const downloadInput = document.getElementById('downloadCode');
        if (downloadInput) {
            downloadInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.downloadFile();
                }
            });
            console.log('Download input listener added');
        } else {
            console.error('Download input not found');
        }
    }

    setupDragAndDrop() {
        console.log('Setting up drag and drop...');
        const uploadArea = document.getElementById('uploadArea');
        
        if (!uploadArea) {
            console.error('Upload area element not found');
            return;
        }
        
        // 阻止默认拖拽行为
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, this.preventDefaults, false);
            document.body.addEventListener(eventName, this.preventDefaults, false);
        });

        // 高亮拖拽区域
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => this.highlight(uploadArea), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => this.unhighlight(uploadArea), false);
        });

        // 处理文件拖放
        uploadArea.addEventListener('drop', (e) => this.handleDrop(e), false);
        console.log('Drag and drop setup complete');
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    highlight(element) {
        element.classList.add('dragover');
    }

    unhighlight(element) {
        element.classList.remove('dragover');
    }

    handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        this.handleFiles(files);
    }

    handleFileSelect(e) {
        const files = e.target.files;
        this.handleFiles(files);
    }

    handleFiles(files) {
        this.selectedFiles = Array.from(files);
        this.displaySelectedFiles();
        this.showUploadOptions();
    }

    displaySelectedFiles() {
        const fileList = document.getElementById('fileList');
        const selectedFiles = document.getElementById('selectedFiles');
        
        if (this.selectedFiles.length === 0) {
            fileList.style.display = 'none';
            return;
        }

        fileList.style.display = 'block';
        selectedFiles.innerHTML = '';

        this.selectedFiles.forEach((file, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="file-name">${file.name}</span>
                <span class="file-size">${this.formatFileSize(file.size)}</span>
                <button class="remove-btn" onclick="app.removeFile(${index})">×</button>
            `;
            selectedFiles.appendChild(li);
        });
    }

    removeFile(index) {
        this.selectedFiles.splice(index, 1);
        this.displaySelectedFiles();
        
        if (this.selectedFiles.length === 0) {
            this.hideUploadOptions();
        }
    }

    showUploadOptions() {
        const uploadOptions = document.getElementById('uploadOptions');
        uploadOptions.style.display = 'block';
    }

    hideUploadOptions() {
        const uploadOptions = document.getElementById('uploadOptions');
        uploadOptions.style.display = 'none';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    async uploadFiles() {
        if (this.selectedFiles.length === 0) {
            this.showError('请先选择要上传的文件');
            return;
        }

        const uploadBtn = document.getElementById('uploadBtn');
        const btnText = uploadBtn.querySelector('.btn-text');
        const loading = uploadBtn.querySelector('.loading');

        // 显示加载状态
        btnText.style.display = 'none';
        loading.style.display = 'flex';
        uploadBtn.disabled = true;

        try {
            // 模拟上传过程（演示模式）
            await new Promise(resolve => setTimeout(resolve, 2000)); // 模拟2秒上传时间

            // 生成模拟结果
            const password = document.getElementById('password').value;
            const expiry = parseInt(document.getElementById('expiry').value) || 7;
            const downloadCode = Math.random().toString(36).substring(2, 15);
            
            const expiryDate = expiry === 0 ? null : new Date(Date.now() + expiry * 24 * 60 * 60 * 1000);
            
            const result = {
                success: true,
                downloadCode: downloadCode,
                downloadUrl: `${window.location.origin}/download/${downloadCode}`,
                expiryDate: expiryDate,
                fileCount: this.selectedFiles.length,
                totalSize: this.selectedFiles.reduce((sum, file) => sum + file.size, 0),
                message: '文件上传成功（演示模式）'
            };

            this.showUploadResult(result);

        } catch (error) {
            console.error('上传错误:', error);
            this.showError('上传失败: ' + error.message);
        } finally {
            // 恢复按钮状态
            btnText.style.display = 'block';
            loading.style.display = 'none';
            uploadBtn.disabled = false;
        }
    }

    showUploadResult(result) {
        const resultSection = document.getElementById('resultSection');
        const resultCode = document.getElementById('resultCode');
        const resultUrl = document.getElementById('resultUrl');
        const resultExpiry = document.getElementById('resultExpiry');

        resultCode.textContent = result.downloadCode;
        resultUrl.textContent = result.downloadUrl;
        
        if (result.expiryDate) {
            const expiryDate = new Date(result.expiryDate);
            resultExpiry.textContent = expiryDate.toLocaleString('zh-CN');
        } else {
            resultExpiry.textContent = '永久保存';
        }

        resultSection.style.display = 'block';
        resultSection.scrollIntoView({ behavior: 'smooth' });

        // 隐藏上传区域
        document.querySelector('.upload-section').style.display = 'none';
    }

    async downloadFile() {
        const downloadCode = document.getElementById('downloadCode').value.trim();
        
        if (!downloadCode) {
            this.showError('请输入下载码或下载链接');
            return;
        }

        try {
            // 提取下载码
            let code = downloadCode;
            if (downloadCode.includes('/download/')) {
                code = downloadCode.split('/download/')[1];
            }

            // 模拟文件下载（演示模式）
            const fileContent = `这是一个演示文件。

文件信息：
- 下载码：${code}
- 文件名：demo-file.txt
- 大小：1024 字节
- 类型：text/plain
- 下载时间：${new Date().toLocaleString('zh-CN')}

注意：这是演示模式，实际应用中会返回真实的文件内容。

在Vercel的无服务器环境中，真实的文件传输需要：
1. 使用云存储服务（如AWS S3、Google Cloud Storage）
2. 或者使用专门的文件传输服务
3. 或者部署到支持文件存储的服务器

当前版本用于演示界面和功能流程。`;

            // 创建下载链接
            const blob = new Blob([fileContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            // 创建下载链接并触发下载
            const a = document.createElement('a');
            a.href = url;
            a.download = 'demo-file.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            // 清理URL对象
            URL.revokeObjectURL(url);

            this.showError('演示文件已下载！这是演示模式，实际应用中会下载真实文件。');

        } catch (error) {
            console.error('下载错误:', error);
            this.showError('下载失败: ' + error.message);
        }
    }

    showError(message) {
        const errorMessage = document.getElementById('errorMessage');
        const errorText = errorMessage.querySelector('.error-text');
        
        errorText.textContent = message;
        errorMessage.style.display = 'flex';
        
        // 3秒后自动隐藏
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 3000);
    }

    copyToClipboard(elementId) {
        const element = document.getElementById(elementId);
        const text = element.textContent;
        
        navigator.clipboard.writeText(text).then(() => {
            // 显示复制成功提示
            const btn = element.nextElementSibling;
            const originalText = btn.textContent;
            btn.textContent = '已复制!';
            btn.style.background = '#28a745';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '#007bff';
            }, 2000);
        }).catch(err => {
            console.error('复制失败:', err);
            this.showError('复制失败，请手动复制');
        });
    }

    shareResult() {
        const resultUrl = document.getElementById('resultUrl').textContent;
        
        if (navigator.share) {
            navigator.share({
                title: '文件分享',
                text: '我分享了一个文件给您',
                url: resultUrl
            });
        } else {
            this.copyToClipboard('resultUrl');
        }
    }

    resetUpload() {
        // 重置所有状态
        this.selectedFiles = [];
        document.getElementById('fileInput').value = '';
        document.getElementById('password').value = '';
        document.getElementById('expiry').value = '7';
        document.getElementById('downloadCode').value = '';
        
        // 隐藏结果区域
        document.getElementById('resultSection').style.display = 'none';
        
        // 显示上传区域
        document.querySelector('.upload-section').style.display = 'block';
        
        // 隐藏文件列表和选项
        this.hideUploadOptions();
        document.getElementById('fileList').style.display = 'none';
        
        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// 全局函数（为了HTML中的onclick事件）
function uploadFiles() {
    app.uploadFiles();
}

function downloadFile() {
    app.downloadFile();
}

function copyToClipboard(elementId) {
    app.copyToClipboard(elementId);
}

function shareResult() {
    app.shareResult();
}

function resetUpload() {
    app.resetUpload();
}

// 初始化应用
const app = new FileTransferApp();

// 添加全局测试函数
window.testApp = function() {
    console.log('Testing app functionality...');
    console.log('Selected files:', app.selectedFiles);
    console.log('File input element:', document.getElementById('fileInput'));
    console.log('Download button:', document.querySelector('.download-input button'));
    console.log('Download input:', document.getElementById('downloadCode'));
    console.log('Upload area:', document.getElementById('uploadArea'));
};

// 页面加载完成后测试
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, testing app...');
    setTimeout(() => {
        window.testApp();
    }, 1000);
});