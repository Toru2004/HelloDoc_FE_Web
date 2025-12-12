<script setup lang="ts">
const { notifySuccess, notifyFailed, notifyInfo, notifyWarning } = useNotification();

const testSuccess = () => {
  notifySuccess('Thêm chuyên khoa thành công!');
};

const testError = () => {
  notifyFailed('Không thể tạo chuyên khoa!');
};

const testInfo = () => {
  notifyInfo('Đang xử lý dữ liệu...');
};

const testWarning = () => {
  notifyWarning('Cảnh báo: Dữ liệu sẽ bị xóa!');
};

const testMultiple = () => {
  notifySuccess('Notification 1');
  setTimeout(() => notifyInfo('Notification 2'), 500);
  setTimeout(() => notifyWarning('Notification 3'), 1000);
  setTimeout(() => notifyFailed('Notification 4'), 1500);
};
</script>

<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-8">Test Notification System</h1>
    
    <div class="space-y-4 max-w-md">
      <button
        @click="testSuccess"
        class="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
      >
        ✅ Test Success Notification
      </button>

      <button
        @click="testError"
        class="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
      >
        ❌ Test Error Notification
      </button>

      <button
        @click="testInfo"
        class="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
      >
        ℹ️ Test Info Notification
      </button>

      <button
        @click="testWarning"
        class="w-full px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition"
      >
        ⚠️ Test Warning Notification
      </button>

      <button
        @click="testMultiple"
        class="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
      >
        🎉 Test Multiple Notifications
      </button>
    </div>

    <div class="mt-8 p-4 bg-gray-100 rounded-lg">
      <h2 class="font-bold mb-2">Hướng dẫn:</h2>
      <ul class="list-disc list-inside space-y-1 text-sm">
        <li>Click các button để test notification</li>
        <li>Notification sẽ xuất hiện ở góc bottom-right</li>
        <li>Tự động đóng sau 3 giây</li>
        <li>Có thể click X để đóng thủ công</li>
        <li>Hover để pause countdown</li>
      </ul>
    </div>
  </div>
</template>
