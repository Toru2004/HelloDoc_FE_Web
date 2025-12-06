<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
      <h1 class="text-2xl font-bold text-gray-800">Danh sách yêu cầu</h1>

      <!-- Search -->
      <SearchBar
        class="w-full md:w-80"
        :data="allRequests"
        :fields="['TEN', 'CCCD', 'EMAIL']"
        placeholder="Tìm theo tên, CCCD, email..."
        @filtered="handleFiltered"
      />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-gray-500 italic">Đang tải dữ liệu...</div>

    <!-- Table -->
    <div v-else class="overflow-x-auto rounded-lg shadow-md">
      <table class="w-full border-collapse bg-white">
        <thead class="bg-blue-600 text-white">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold">Tên</th>
            <th class="px-4 py-3 text-left text-sm font-semibold">CCCD</th>
            <th class="px-4 py-3 text-left text-sm font-semibold">Email</th>
            <th class="px-4 py-3 text-left text-sm font-semibold">Thời gian bắt đầu</th>
            <th class="px-4 py-3 text-left text-sm font-semibold">Thời gian kết thúc</th>
            <th class="px-4 py-3 text-left text-sm font-semibold">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-if="!fillteredRequests || fillteredRequests.length === 0"
          >
            <td colspan="6" class="px-4 py-3 italic text-center text-gray-500">
              Không có yêu cầu nào
            </td>
          </tr>

          <tr
            v-else
            v-for="(request, index) in fillteredRequests"
            :key="index"
            class="hover:bg-blue-50 transition-colors even:bg-gray-50"
          >
            <td class="px-4 py-2 border font-medium text-gray-700">{{ request.TEN }}</td>
            <td class="px-4 py-2 border">{{ request.CCCD }}</td>
            <td class="px-4 py-2 border">{{ request.EMAIL }}</td>
            <td class="px-4 py-2 border">{{ request.THOIGIAN_BATDAU }}</td>
            <td class="px-4 py-2 border">{{ request.THOIGIAN_KETTHUC }}</td>
            <td class="px-4 py-2 border">
              <span
                :class="request.approve ? 'text-green-600 font-medium' : 'text-red-600 font-medium'"
              >
                {{ request.approve ? 'Đồng ý' : 'Từ chối' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RequestInfor } from '@/@type/Request'
import SearchBar from '../organisms/SearchBar.vue'

const allRequests = ref<RequestInfor[]>([])
const fillteredRequests = ref<RequestInfor[]>([])

function handleFiltered(filtered: RequestInfor[]) {
  fillteredRequests.value = filtered
}

interface Props {
  requests: Array<RequestInfor>
  loading: boolean
}
const props = defineProps<Props>()

onMounted(() => {
  allRequests.value = props.requests
  fillteredRequests.value = props.requests
})

watch(
  () => props.requests,
  (newRequests) => {
    allRequests.value = newRequests
    fillteredRequests.value = newRequests
  }
)
</script>
