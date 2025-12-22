<script setup lang="ts">
interface Props {
  title: string;
  description?: string;
  showReload?: boolean;
  showAdd?: boolean;
  addLabel?: string;
  loading?: boolean;
  showSearch?: boolean;
  searchText?: string;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  showReload: true,
  showAdd: true,
  addLabel: 'Thêm mới',
  loading: false,
  showSearch: false,
  searchText: '',
  placeholder: 'Tìm kiếm...',
});

const emit = defineEmits<{
  reload: [];
  add: [];
  'update:searchText': [value: string];
  search: [value: string];
}>();

const handleReload = () => {
  emit('reload');
};

const handleAdd = () => {
  emit('add');
};

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:searchText', target.value);
};

const handleEnter = () => {
  emit('search', props.searchText);
};
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <!-- Left: Title & Description -->
      <div class="flex-1 min-w-0">
        <h1 class="text-3xl font-bold text-gray-800 truncate">{{ title }}</h1>
        <p v-if="description" class="text-gray-600 mt-2 line-clamp-2">{{ description }}</p>
      </div>

      <!-- Center: Search Bar (If enabled) -->
      <div v-if="showSearch" class="flex-1 max-w-md w-full">
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            :value="searchText"
            @input="handleInput"
            @keyup.enter="handleEnter"
            class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all shadow-sm group-hover:border-gray-400"
            :placeholder="placeholder"
          />
          <div v-if="searchText" class="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button @click="$emit('update:searchText', ''); $emit('search', '')" class="text-gray-400 hover:text-gray-600">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Right: Actions -->
      <div class="flex items-center gap-3 shrink-0">
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
