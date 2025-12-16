<script setup lang="ts">
import PendingDoctorsList from "@/components/organisms/applications-pending/PendingDoctorsList.vue";

definePageMeta({
  layout: "default",
});

useHead({
  title: 'Duyệt Bác sĩ - HelloDoc Admin',
});
</script>

<template>
  <div class="container mx-auto px-4 max-w-7xl">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 tracking-tight">Duyệt Bác Sĩ</h1>
      <p class="text-gray-500 text-sm mt-1">Danh sách các bác sĩ đang chờ xác thực thông tin.</p>
    </div>
    <PendingDoctorsList />
  </div>
</template>
