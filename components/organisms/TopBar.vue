<script setup lang="ts">
interface Emits {
  (event: 'toggle'): void;
}

const emit = defineEmits<Emits>();
const api = useApi();

const handleLogout = () => {
  api.logout();
};
</script>

<template>
  <div class="bg-white shadow px-4 py-3 flex items-center justify-between border-b">
    <div class="flex items-center gap-2">
      <button
        @click="$emit('toggle')"
        class="p-2 text-gray-600 hover:text-black focus:outline-none"
      >
        <!-- Icon -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
    <button
      @click="handleLogout"
      class="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded"
    >
      Đăng xuất
    </button>
  </div>
</template>
