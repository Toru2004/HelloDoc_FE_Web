//hàm format thời gian từ Firebase Timestamp sang định dạng chuỗi
// dành cho tái sử dụng trong các component khác
export function formatFirebaseTimestamp(timestamp: any): string {
  if (!timestamp) return 'Không xác định';

  if (typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toLocaleString('vi-VN');
  }

  if (timestamp instanceof Date) {
    return timestamp.toLocaleString('vi-VN');
  }

  return 'Không xác định';
}