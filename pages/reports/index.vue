<script setup lang="ts">
import ReportList from "@/components/organisms/reports/ReportList.vue";
import PageOverview from "@/components/molecules/PageOverview.vue";
import Pagination from "@/components/molecules/Pagination.vue";

definePageMeta({
  layout: "default",
});

useHead({
  title: 'Quản lý báo cáo - HelloDoc',
});

const { 
  reports, 
  loading, 
  error, 
  totalReports,
  limit,
  offset,
  searchText,
  fetchReports 
} = useReportViewModel();

const currentPage = ref(1);

watch([currentPage, limit], () => {
  offset.value = (currentPage.value - 1) * limit.value;
  fetchReports();
});

const handleSearch = (val: string) => {
  searchText.value = val;
  offset.value = 0;
  currentPage.value = 1;
  fetchReports();
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

// Fetch reports on component mount
onMounted(async () => {
  await fetchReports();
});

const handleAdd = () => {
  // TODO: Implement add report functionality
  console.log('Add report clicked');
};
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Page Overview -->
    <PageOverview
      title="Quản lý báo cáo"
      description="Danh sách báo cáo vi phạm trong hệ thống HelloDoc"
      add-label="Thêm báo cáo"
      :show-add="false"
      :loading="loading"
      show-search
      v-model:search-text="searchText"
      @search="handleSearch"
      @reload="fetchReports"
    />

    <!-- Error State -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div class="flex items-center gap-3">
        <svg class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 class="font-semibold text-red-800">Lỗi tải dữ liệu</h3>
          <p class="text-red-600">{{ error }}</p>
        </div>
      </div>
      <button
        @click="fetchReports"
        class="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
      >
        Thử lại
      </button>
    </div>

    <!-- Report List -->
    <div class="bg-white rounded-t-xl shadow-sm border border-gray-100 overflow-hidden">
      <ReportList :reports="reports" :loading="loading" />
    </div>

    <!-- Pagination -->
    <Pagination
      v-model:current-page="currentPage"
      v-model:items-per-page="limit"
      :total-items="totalReports"
      :loading="loading"
      @page-change="handlePageChange"
    />
  </div>
</template>
