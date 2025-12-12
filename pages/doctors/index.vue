<script setup lang="ts">
import DoctorList from "@/components/organisms/doctors/DoctorList.vue";
import PageOverview from "@/components/molecules/PageOverview.vue";

definePageMeta({
  layout: "default",
});

useHead({
  title: 'Quản lý bác sĩ - HelloDoc',
});

const { doctors, loading, error, fetchDoctors } = useDoctorViewModel();

// Fetch doctors on component mount
onMounted(async () => {
  await fetchDoctors();
});

const handleAdd = () => {
  // TODO: Implement add doctor functionality
  console.log('Add doctor clicked');
};
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Page Overview -->
    <PageOverview
      title="Quản lý bác sĩ"
      description="Danh sách bác sĩ trong hệ thống HelloDoc"
      add-label="Thêm bác sĩ"
      :loading="loading"
      @reload="fetchDoctors"
      @add="handleAdd"
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
        @click="fetchDoctors"
        class="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
      >
        Thử lại
      </button>
    </div>

    <!-- Doctor List Table -->
    <DoctorList :doctors="doctors" :loading="loading" />
  </div>
</template>
