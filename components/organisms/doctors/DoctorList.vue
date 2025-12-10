<script setup lang="ts">
interface Props {
  doctors: Doctor[];
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

    <!-- Doctors Table -->
    <div v-else-if="doctors.length > 0">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bác sĩ
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Liên hệ
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Chuyên khoa
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bệnh nhân
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đánh giá
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dịch vụ
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giấy tờ
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="doctor in doctors" :key="doctor._id" class="hover:bg-gray-50 transition">
              <!-- Doctor Info -->
              <td class="px-6 py-4">
                <div class="flex items-start gap-3">
                  <div class="flex-shrink-0">
                    <img
                      v-if="doctor.avatarURL"
                      :src="doctor.avatarURL"
                      :alt="doctor.name"
                      class="h-16 w-16 rounded-full object-cover border-2 border-blue-200"
                    />
                    <div
                      v-else
                      class="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-xl"
                    >
                      {{ doctor.name.charAt(0).toUpperCase() }}
                    </div>
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="text-sm font-semibold text-gray-900">{{ doctor.name }}</div>
                    <div class="text-xs text-gray-500 mt-1">{{ doctor.email }}</div>
                    <div class="text-xs text-gray-500">{{ doctor.phone }}</div>
                    <div v-if="doctor.description" class="text-xs text-gray-600 mt-2 line-clamp-2" :title="doctor.description">
                      {{ doctor.description }}
                    </div>
                  </div>
                </div>
              </td>

              <!-- Contact & Address -->
              <td class="px-6 py-4">
                <div class="text-xs text-gray-900 max-w-xs">
                  <div class="font-medium mb-1">CCCD: {{ doctor.cccd }}</div>
                  <div class="text-gray-600 line-clamp-3" :title="doctor.address">
                    {{ doctor.address }}
                  </div>
                </div>
              </td>

              <!-- Specialty -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <img
                    v-if="doctor.specialty?.icon"
                    :src="doctor.specialty.icon"
                    :alt="doctor.specialty.name"
                    class="w-8 h-8 rounded"
                  />
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ doctor.specialty?.name || 'N/A' }}
                    </div>
                    <div v-if="doctor.certificates" class="text-xs text-gray-500 mt-1 line-clamp-2" :title="doctor.certificates">
                      {{ doctor.certificates }}
                    </div>
                  </div>
                </div>
              </td>

              <!-- Patients Count -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="text-2xl font-bold text-blue-600">{{ doctor.patientsCount }}</div>
                <div class="text-xs text-gray-500">bệnh nhân</div>
              </td>

              <!-- Ratings -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="text-2xl font-bold text-yellow-600">{{ doctor.ratingsCount }}</div>
                <div class="text-xs text-gray-500">đánh giá</div>
              </td>

              <!-- Services -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-col gap-1">
                  <span
                    class="px-2 py-1 text-xs font-semibold rounded-full text-center"
                    :class="doctor.hasHomeService ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'"
                  >
                    {{ doctor.hasHomeService ? '✓ Khám tại nhà' : '✗ Không khám tại nhà' }}
                  </span>
                  <span
                    class="px-2 py-1 text-xs font-semibold rounded-full text-center"
                    :class="doctor.isClinicPaused ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'"
                  >
                    {{ doctor.isClinicPaused ? 'Tạm ngưng' : 'Đang hoạt động' }}
                  </span>
                </div>
              </td>

              <!-- Documents -->
              <td class="px-6 py-4">
                <div class="flex flex-col gap-2">
                  <a
                    v-if="doctor.licenseUrl"
                    :href="doctor.licenseUrl"
                    target="_blank"
                    class="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Giấy phép
                  </a>
                  <a
                    v-if="doctor.frontCccdUrl"
                    :href="doctor.frontCccdUrl"
                    target="_blank"
                    class="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                    CCCD mặt trước
                  </a>
                  <a
                    v-if="doctor.backCccdUrl"
                    :href="doctor.backCccdUrl"
                    target="_blank"
                    class="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                    CCCD mặt sau
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Summary -->
      <div class="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <p class="text-sm text-gray-600">
          Tổng số: <span class="font-semibold">{{ doctors.length }}</span> bác sĩ
        </p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="p-12 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Không có bác sĩ</h3>
      <p class="mt-1 text-sm text-gray-500">Chưa có bác sĩ nào trong hệ thống.</p>
    </div>
  </div>
</template>
