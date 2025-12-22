<script setup lang="ts">
interface Props {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  loading?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:currentPage', 'update:itemsPerPage', 'page-change', 'limit-change']);

const totalPages = computed(() => {
  if (!props.itemsPerPage || props.itemsPerPage <= 0) return 1;
  const count = Math.ceil(props.totalItems / props.itemsPerPage);
  console.log('Pagination Debug:', {
    totalItems: props.totalItems,
    itemsPerPage: props.itemsPerPage,
    totalPages: count,
    currentPage: props.currentPage
  });
  return count || 1;
});

const limits = [5, 10, 50, 100];

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value || props.loading) return;
  emit('update:currentPage', page);
  emit('page-change', page);
};

const handleLimitChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const newLimit = parseInt(target.value);
  emit('update:itemsPerPage', newLimit);
  emit('limit-change', newLimit);
};

const visiblePages = computed(() => {
  const delta = 2;
  const range = [];
  const rangeWithDots = [];
  let l;

  range.push(1);
  for (let i = props.currentPage - delta; i <= props.currentPage + delta; i++) {
    if (i < totalPages.value && i > 1) {
      range.push(i);
    }
  }
  if (totalPages.value > 1) {
    range.push(totalPages.value);
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
});
</script>

<template>
  <div v-if="totalItems > 0" class="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 bg-white border-t border-gray-100 sm:px-6 rounded-b-xl">
    <!-- Left: Status and Limit Selector -->
    <div class="flex flex-wrap items-center gap-4">
      <div class="flex items-center gap-2">
        <span class="text-xs text-gray-500">Hiển thị</span>
        <select
          :value="itemsPerPage"
          @change="handleLimitChange"
          class="block w-full rounded-md border-gray-200 py-1.5 text-xs focus:ring-blue-500 focus:border-blue-500 sm:text-xs"
        >
          <option v-for="limit in limits" :key="limit" :value="limit">
            {{ limit }}
          </option>
        </select>
        <span class="text-xs text-gray-500">mục</span>
      </div>

      <p class="text-xs text-gray-500 hidden md:block">
        Hiển thị từ <span class="font-semibold text-blue-600">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
        đến <span class="font-semibold text-blue-600">{{ Math.min(currentPage * itemsPerPage, totalItems) }}</span>
        trong tổng số <span class="font-semibold text-blue-600">{{ totalItems }}</span> kết quả
      </p>
    </div>
    
    <!-- Center/Right: Navigation -->
    <div class="flex items-center justify-center flex-1">
      <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
        <!-- Previous Button -->
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1 || loading"
          class="relative inline-flex items-center rounded-l-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-200 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-40 transition-colors"
        >
          <span class="sr-only">Previous</span>
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <!-- Page Numbers -->
        <template v-for="(page, index) in visiblePages" :key="index">
          <span
            v-if="page === '...'"
            class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-200 focus:outline-offset-0"
          >
            ...
          </span>
          <button
            v-else
            @click="goToPage(page as number)"
            :class="[
              currentPage === page
                ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ring-blue-600'
                : 'text-gray-900 ring-1 ring-inset ring-gray-200 hover:bg-gray-50 focus:z-20 focus:outline-offset-0',
              'relative inline-flex items-center px-4 py-2 text-sm font-semibold transition-all'
            ]"
          >
            {{ page }}
          </button>
        </template>
        
        <!-- Next Button -->
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages || loading"
          class="relative inline-flex items-center rounded-r-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-200 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-40 transition-colors"
        >
          <span class="sr-only">Next</span>
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
          </svg>
        </button>
      </nav>
    </div>

    <!-- Right: Spacer for centering on desktop if needed, or just status on mobile -->
    <div class="hidden lg:block w-32"></div>
  </div>
</template>
