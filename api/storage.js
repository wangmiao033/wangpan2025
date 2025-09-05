// Vercel Serverless Function - 共享存储模块
// 注意：在 Vercel 的无状态环境中，这个存储是临时的
// 实际应用中应该使用外部存储服务如 Redis 或数据库

export const fileStorage = new Map();

// 清理过期文件的函数
export function cleanupExpiredFiles() {
  const now = new Date();
  const expiredCodes = [];

  fileStorage.forEach((fileInfo, code) => {
    if (fileInfo.expiryDate && now > fileInfo.expiryDate) {
      expiredCodes.push(code);
    }
  });

  expiredCodes.forEach(code => {
    fileStorage.delete(code);
  });

  if (expiredCodes.length > 0) {
    console.log(`清理了 ${expiredCodes.length} 个过期文件`);
  }
}

// 获取存储统计信息
export function getStorageStats() {
  const stats = {
    totalFiles: fileStorage.size,
    totalSize: 0,
    activeFiles: 0
  };

  fileStorage.forEach(fileInfo => {
    stats.totalSize += fileInfo.files.reduce((sum, file) => sum + file.size, 0);
    if (!fileInfo.expiryDate || new Date() <= fileInfo.expiryDate) {
      stats.activeFiles++;
    }
  });

  return stats;
}
