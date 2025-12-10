<script setup lang="ts">
interface Props {
  reports: Report[];
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

// Get status badge color
const getStatusBadgeColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'closed':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Get status text
const getStatusText = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'Chờ xử lý';
    case 'opened':
      return 'Đang chờ xử lý';
    case 'processing':
      return 'Đang xử lý';
    case 'closed':
      return 'Đã đóng';
    case 'rejected':
      return 'Từ chối';
    default:
      return status;
  }
};

// Get type badge color
const getTypeBadgeColor = (type: string) => {
  switch (type) {
    case 'Bài viết':
      return 'bg-purple-100 text-purple-800';
    case 'Bình luận':
      return 'bg-indigo-100 text-indigo-800';
    case 'Người dùng':
      return 'bg-orange-100 text-orange-800';
    case 'Bác sĩ':
      return 'bg-teal-100 text-teal-800';
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

    <!-- Reports Table -->
    <div v-else-if="reports.length > 0">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loại báo cáo
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nội dung
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người báo cáo
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời gian
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="report in reports" :key="report._id" class="hover:bg-gray-50 transition">
              <!-- Type -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getTypeBadgeColor(report.type)"
                >
                  {{ report.type }}
                </span>
              </td>

              <!-- Content -->
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 max-w-md">
                  <div class="line-clamp-2" :title="report.content">
                    {{ report.content }}
                  </div>
                  <div v-if="report.responseContent" class="mt-2 text-xs text-gray-500 italic">
                    <span class="font-semibold">Phản hồi:</span> {{ report.responseContent }}
                  </div>
                </div>
              </td>

              <!-- Reporter -->
              <td class="px-6 py-4">
                <div v-if="report.reporter" class="flex items-center gap-3">
                  <div class="flex-shrink-0">
                    <img
                      v-if="report.reporter?.avatarURL"
                      :src="report.reporter.avatarURL"
                      :alt="report.reporter?.name || 'User'"
                      class="h-10 w-10 rounded-full object-cover"
                    />
                    <div
                      v-else
                      class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold"
                    >
                      {{ (report.reporter?.name || 'U').charAt(0).toUpperCase() }}
                    </div>
                  </div>
                  <div class="min-w-0">
                    <div class="text-sm font-medium text-gray-900 truncate">
                      {{ report.reporter?.name || 'N/A' }}
                    </div>
                    <div class="text-xs text-gray-500 truncate">{{ report.reporter?.email || 'N/A' }}</div>
                    <div class="text-xs text-gray-400">
                      <span class="px-2 py-0.5 rounded bg-gray-100">{{ report.reporter?.role || 'N/A' }}</span>
                    </div>
                  </div>
                </div>
                <div v-else class="text-sm text-gray-400 italic">
                  Người dùng đã bị xóa
                </div>
              </td>

              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStatusBadgeColor(report.status)"
                >
                  {{ getStatusText(report.status) }}
                </span>
              </td>

              <!-- Time -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ formatDate(report.createdAt) }}
                </div>
                <div v-if="report.responseTime" class="text-xs text-gray-500 mt-1">
                  Phản hồi: {{ report.responseTime }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Summary -->
      <div class="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <p class="text-sm text-gray-600">
          Tổng số: <span class="font-semibold">{{ reports.length }}</span> báo cáo
        </p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="p-12 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Không có báo cáo</h3>
      <p class="mt-1 text-sm text-gray-500">Chưa có báo cáo nào trong hệ thống.</p>
    </div>
  </div>
</template>
