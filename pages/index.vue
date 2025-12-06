<script setup lang="ts">
useHead({
  title: 'HelloDoc Admin',
});

// Redirect to dashboard on mount
onMounted(() => {
  navigateTo('/dashboard');
});
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Đang chuyển hướng...</p>
    </div>
  </div>
</template>
