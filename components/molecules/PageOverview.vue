<script setup lang="ts">
interface Props {
  title: string;
  description?: string;
  showReload?: boolean;
  showAdd?: boolean;
  addLabel?: string;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showReload: true,
  showAdd: true,
  addLabel: 'Thêm mới',
  loading: false,
});

const emit = defineEmits<{
  reload: [];
  add: [];
}>();

const handleReload = () => {
  emit('reload');
};

const handleAdd = () => {
  emit('add');
};
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
    <div class="flex items-center justify-between">
      <!-- Left: Title & Description -->
      <div class="flex-1">
        <h1 class="text-3xl font-bold text-gray-800">{{ title }}</h1>
        <p v-if="description" class="text-gray-600 mt-2">{{ description }}</p>
      </div>

      <!-- Right: Actions -->
      <div class="flex items-center gap-3 ml-6">
        <!-- Reload Button -->
        <button
          v-if="showReload"
          @click="handleReload"
          :disabled="loading"
          class="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <svg
            class="w-5 h-5 transition-transform"
            :class="{ 'animate-spin': loading }"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Tải lại</span>
        </button>

        <!-- Add Button -->
        <button
          v-if="showAdd"
          @click="handleAdd"
          class="inline-flex items-center gap-2 px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>{{ addLabel }}</span>
        </button>

        <!-- Custom Actions Slot -->
        <slot name="actions"></slot>
      </div>
    </div>

    <!-- Extra Content Slot -->
    <div v-if="$slots.extra" class="mt-4 pt-4 border-t border-gray-200">
      <slot name="extra"></slot>
    </div>
  </div>
</template>
