// 文件传输网站 JavaScript 功能
class FileTransferApp {
    constructor() {
        this.selectedFiles = [];
        this.uploadInProgress = false;
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        // 获取DOM元素
        this.uploadZone = document.getElementById('uploadZone');
        this.fileInput = document.getElementById('fileInput');
        this.uploadBtn = document.getElementById('uploadBtn');
        this.fileList = document.getElementById('fileList');
        this.files = document.getElementById('files');
        this.uploadOptions = document.getElementById('uploadOptions');
        this.startUploadBtn = document.getElementById('startUploadBtn');
        this.uploadProgress = document.getElementById('uploadProgress');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.uploadComplete = document.getElementById('uploadComplete');
        this.downloadLink = document.getElementById('downloadLink');
        this.copyBtn = document.getElementById('copyBtn');
        this.shareBtn = document.getElementById('shareBtn');
        this.newUploadBtn = document.getElementById('newUploadBtn');
        this.downloadCode = document.getElementById('downloadCode');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.modal = document.getElementById('modal');
        this.modalBody = document.getElementById('modalBody');
        this.closeModal = document.getElementById('closeModal');
    }

    bindEvents() {
        // 上传区域事件
        this.uploadZone.addEventListener('click', () => this.fileInput.click());
        this.uploadZone.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadZone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.uploadZone.addEventListener('drop', (e) => this.handleDrop(e));
        
        // 文件选择事件
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // 按钮事件
        this.startUploadBtn.addEventListener('click', () => this.startUpload());
        this.cancelBtn.addEventListener('click', () => this.cancelUpload());
        this.copyBtn.addEventListener('click', () => this.copyLink());
        this.shareBtn.addEventListener('click', () => this.shareLink());
        this.newUploadBtn.addEventListener('click', () => this.resetUpload());
        this.downloadBtn.addEventListener('click', () => this.handleDownload());
        
        // 模态框事件
        this.closeModal.addEventListener('click', () => this.closeModalWindow());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModalWindow();
        });
        
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModalWindow();
        });
    }

    // 拖拽处理
    handleDragOver(e) {
        e.preventDefault();
        this.uploadZone.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.uploadZone.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        this.uploadZone.classList.remove('dragover');
        const files = Array.from(e.dataTransfer.files);
        this.addFiles(files);
    }

    // 文件选择处理
    handleFileSelect(e) {
        const files = Array.from(e.target.files);
        this.addFiles(files);
    }

    addFiles(files) {
        files.forEach(file => {
            if (!this.selectedFiles.find(f => f.name === file.name && f.size === file.size)) {
                this.selectedFiles.push(file);
            }
        });
        this.updateFileList();
        this.showUploadOptions();
    }

    updateFileList() {
        if (this.selectedFiles.length === 0) {
            this.fileList.style.display = 'none';
            return;
        }

        this.fileList.style.display = 'block';
        this.files.innerHTML = '';

        this.selectedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-info">
                    <div class="file-icon">${this.getFileIcon(file.type)}</div>
                    <div class="file-details">
                        <h4>${file.name}</h4>
                        <p>${this.formatFileSize(file.size)}</p>
                    </div>
                </div>
                <button class="remove-file" onclick="app.removeFile(${index})">删除</button>
            `;
            this.files.appendChild(fileItem);
        });
    }

    removeFile(index) {
        this.selectedFiles.splice(index, 1);
        this.updateFileList();
        if (this.selectedFiles.length === 0) {
            this.uploadOptions.style.display = 'none';
        }
    }

    getFileIcon(type) {
        if (type.startsWith('image/')) return '🖼️';
        if (type.startsWith('video/')) return '🎥';
        if (type.startsWith('audio/')) return '🎵';
        if (type.includes('pdf')) return '📄';
        if (type.includes('word')) return '📝';
        if (type.includes('excel') || type.includes('spreadsheet')) return '📊';
        if (type.includes('powerpoint') || type.includes('presentation')) return '📈';
        if (type.includes('zip') || type.includes('rar')) return '📦';
        return '📁';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showUploadOptions() {
        if (this.selectedFiles.length > 0) {
            this.uploadOptions.style.display = 'block';
        }
    }

    // 上传处理
    async startUpload() {
        if (this.selectedFiles.length === 0) {
            this.showMessage('请先选择要上传的文件', 'error');
            return;
        }

        this.uploadInProgress = true;
        this.showUploadProgress();
        
        try {
            const formData = new FormData();
            this.selectedFiles.forEach(file => {
                formData.append('files', file);
            });
            
            const password = document.getElementById('password').value;
            const expiry = document.getElementById('expiry').value;
            
            if (password) formData.append('password', password);
            formData.append('expiry', expiry);

            // 使用 Vercel API 上传
            await this.uploadToVercel(formData);
            
        } catch (error) {
            this.showMessage('上传失败: ' + error.message, 'error');
            this.hideUploadProgress();
        }
    }

    async uploadToVercel(formData) {
        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || '上传失败');
            }

            const result = await response.json();
            
            // 显示上传完成
            this.uploadInProgress = false;
            this.showUploadComplete(result);
            
        } catch (error) {
            throw error;
        }
    }

    async simulateUpload(formData) {
        const totalSize = this.selectedFiles.reduce((sum, file) => sum + file.size, 0);
        let uploadedSize = 0;
        
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                if (!this.uploadInProgress) {
                    clearInterval(interval);
                    reject(new Error('上传已取消'));
                    return;
                }

                // 模拟上传进度
                uploadedSize += totalSize * 0.1;
                const progress = Math.min((uploadedSize / totalSize) * 100, 100);
                
                this.updateProgress(progress);
                
                if (progress >= 100) {
                    clearInterval(interval);
                    this.uploadInProgress = false;
                    this.showUploadComplete();
                    resolve();
                }
            }, 200);
        });
    }

    showUploadProgress() {
        this.uploadOptions.style.display = 'none';
        this.uploadProgress.style.display = 'block';
        this.updateProgress(0);
    }

    hideUploadProgress() {
        this.uploadProgress.style.display = 'none';
        this.uploadInProgress = false;
    }

    updateProgress(progress) {
        this.progressFill.style.width = progress + '%';
        this.progressText.textContent = Math.round(progress) + '%';
    }

    cancelUpload() {
        this.uploadInProgress = false;
        this.hideUploadProgress();
        this.showUploadOptions();
        this.showMessage('上传已取消', 'error');
    }

    showUploadComplete(result = null) {
        this.uploadProgress.style.display = 'none';
        this.uploadComplete.style.display = 'block';
        
        let downloadUrl;
        if (result && result.downloadUrl) {
            // 使用真实的下载链接
            downloadUrl = result.downloadUrl;
        } else {
            // 生成模拟下载链接（兼容旧版本）
            const downloadCode = this.generateDownloadCode();
            downloadUrl = `${window.location.origin}/api/download/${downloadCode}`;
        }
        
        this.downloadLink.value = downloadUrl;
        
        // 自动复制链接
        this.copyLink();
    }

    generateDownloadCode() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    copyLink() {
        this.downloadLink.select();
        this.downloadLink.setSelectionRange(0, 99999);
        document.execCommand('copy');
        
        // 显示复制成功提示
        const linkNote = document.querySelector('.link-note');
        linkNote.style.display = 'block';
        setTimeout(() => {
            linkNote.style.display = 'none';
        }, 3000);
    }

    shareLink() {
        if (navigator.share) {
            navigator.share({
                title: '文件分享',
                text: '我分享了一些文件给你',
                url: this.downloadLink.value
            });
        } else {
            this.copyLink();
            this.showMessage('链接已复制到剪贴板', 'success');
        }
    }

    resetUpload() {
        this.selectedFiles = [];
        this.fileInput.value = '';
        document.getElementById('password').value = '';
        document.getElementById('expiry').value = '7';
        
        this.fileList.style.display = 'none';
        this.uploadOptions.style.display = 'none';
        this.uploadProgress.style.display = 'none';
        this.uploadComplete.style.display = 'none';
        
        this.showMessage('已重置，可以上传新文件', 'success');
    }

    // 下载处理
    async handleDownload() {
        const code = this.downloadCode.value.trim();
        if (!code) {
            this.showMessage('请输入下载码或链接', 'error');
            return;
        }

        try {
            // 提取下载码
            let downloadCode = code;
            if (code.includes('/api/download/')) {
                downloadCode = code.split('/api/download/')[1];
            } else if (code.includes('/download/')) {
                downloadCode = code.split('/download/')[1];
            }

            this.showMessage('正在获取文件信息...', 'success');
            
            // 调用 Vercel API 获取文件信息
            const response = await fetch(`/api/file/${downloadCode}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || '获取文件失败');
            }

            const fileInfo = await response.json();
            
            if (fileInfo.hasPassword) {
                // 需要密码，显示密码输入框
                this.showPasswordModal(downloadCode);
            } else {
                // 直接下载
                this.downloadFile(downloadCode);
            }
            
        } catch (error) {
            this.showMessage('获取文件失败: ' + error.message, 'error');
        }
    }

    showPasswordModal(downloadCode) {
        const password = prompt('请输入文件密码:');
        if (password) {
            this.verifyPasswordAndDownload(downloadCode, password);
        }
    }

    async verifyPasswordAndDownload(downloadCode, password) {
        try {
            const response = await fetch(`/api/verify-password/${downloadCode}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || '密码验证失败');
            }

            this.downloadFile(downloadCode, password);
            
        } catch (error) {
            this.showMessage('密码验证失败: ' + error.message, 'error');
        }
    }

    downloadFile(downloadCode, password = null) {
        let downloadUrl = `/api/download/${downloadCode}`;
        if (password) {
            downloadUrl += `?password=${encodeURIComponent(password)}`;
        }
        
        // 创建隐藏的下载链接
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = '';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showMessage('文件下载已开始！', 'success');
    }

    // 消息显示
    showMessage(message, type = 'success') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message`;
        messageDiv.textContent = message;
        
        // 插入到页面顶部
        const container = document.querySelector('.container');
        container.insertBefore(messageDiv, container.firstChild);
        
        // 3秒后自动移除
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 3000);
    }

    // 模态框处理
    showModal(content) {
        this.modalBody.innerHTML = content;
        this.modal.style.display = 'block';
    }

    closeModalWindow() {
        this.modal.style.display = 'none';
    }

    // 工具方法
    formatDate(date) {
        return new Intl.DateTimeFormat('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }

    // 文件类型验证
    validateFileType(file) {
        const allowedTypes = [
            'image/', 'video/', 'audio/', 'text/',
            'application/pdf', 'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/zip', 'application/x-rar-compressed'
        ];
        
        return allowedTypes.some(type => file.type.startsWith(type));
    }

    // 文件大小验证
    validateFileSize(file) {
        const maxSize = 10 * 1024 * 1024 * 1024; // 10GB
        return file.size <= maxSize;
    }
}

// 初始化应用
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new FileTransferApp();
    
    // 添加一些示例功能
    console.log('文件传输网站已加载');
    
    // 检查浏览器兼容性
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
        app.showMessage('您的浏览器不支持文件上传功能，请升级浏览器', 'error');
    }
});

// 全局错误处理
window.addEventListener('error', (e) => {
    console.error('全局错误:', e.error);
    if (app) {
        app.showMessage('发生了一个错误，请刷新页面重试', 'error');
    }
});

// 页面可见性变化处理
document.addEventListener('visibilitychange', () => {
    if (document.hidden && app && app.uploadInProgress) {
        console.log('页面隐藏，但上传继续进行');
    }
});

// 导出给全局使用
window.app = app;
