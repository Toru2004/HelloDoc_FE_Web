<script setup lang="ts">
interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  avatarURL?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  fcmToken?: string;
}

interface Props {
  users: User[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Get role badge color
const getRoleBadgeColor = (role: string) => {
  switch (role.toLowerCase()) {
    case 'admin':
      return 'bg-red-100 text-red-800';
    case 'doctor':
      return 'bg-blue-100 text-blue-800';
    case 'user':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
</script>

<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="flex flex-col items-center gap-3">
        <svg
          class="w-12 h-12 text-blue-600 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        <p class="text-gray-600">Đang tải dữ liệu...</p>
      </div>
    </div>

    <!-- Users Table -->
    <div v-else-if="users.length > 0">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người dùng
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Liên hệ
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Địa chỉ
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vai trò
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tạo
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users" :key="user._id" class="hover:bg-gray-50 transition">
              <!-- User Info -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img
                      v-if="user.avatarURL"
                      :src="user.avatarURL"
                      :alt="user.name"
                      class="h-10 w-10 rounded-full object-cover"
                    />
                    <div
                      v-else
                      class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold"
                    >
                      {{ user.name.charAt(0).toUpperCase() }}
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                    <div class="text-sm text-gray-500">{{ user.email }}</div>
                  </div>
                </div>
              </td>

              <!-- Contact -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ user.phone }}</div>
              </td>

              <!-- Address -->
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 max-w-xs truncate" :title="user.address">
                  {{ user.address }}
                </div>
              </td>

              <!-- Role -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getRoleBadgeColor(user.role)"
                >
                  {{ user.role }}
                </span>
              </td>

              <!-- Created Date -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(user.createdAt) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Summary -->
      <div class="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <p class="text-sm text-gray-600">
          Tổng số: <span class="font-semibold">{{ users.length }}</span> người dùng
        </p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="p-12 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Không có người dùng</h3>
      <p class="mt-1 text-sm text-gray-500">Chưa có người dùng nào trong hệ thống.</p>
    </div>
  </div>
</template>
