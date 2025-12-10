<script setup lang="ts">
interface Props {
  specialties: Specialty[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});
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

    <!-- Specialties Table -->
    <div v-else-if="specialties.length > 0">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Chuyên khoa
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mô tả
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="specialty in specialties" :key="specialty._id" class="hover:bg-gray-50 transition">
              <!-- Specialty Info -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="flex-shrink-0">
                    <img
                      v-if="specialty.icon"
                      :src="specialty.icon"
                      :alt="specialty.name"
                      class="h-12 w-12 rounded-lg object-cover border border-gray-200"
                    />
                    <div
                      v-else
                      class="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-semibold"
                    >
                      {{ specialty.name.charAt(0) }}
                    </div>
                  </div>
                  <div>
                    <div class="text-sm font-semibold text-gray-900">{{ specialty.name }}</div>
                    <div class="text-xs text-gray-500">{{ specialty.doctors.length }} bác sĩ</div>
                  </div>
                </div>
              </td>

              <!-- Description -->
              <td class="px-6 py-4">
                <div class="text-sm text-gray-700 max-w-2xl">
                  <div class="line-clamp-4 whitespace-pre-line" :title="specialty.description">
                    {{ specialty.description }}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Summary -->
      <div class="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <p class="text-sm text-gray-600">
          Tổng số: <span class="font-semibold">{{ specialties.length }}</span> chuyên khoa
        </p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="p-12 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Không có chuyên khoa</h3>
      <p class="mt-1 text-sm text-gray-500">Chưa có chuyên khoa nào trong hệ thống.</p>
    </div>
  </div>
</template>
