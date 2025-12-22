<script setup lang="ts" generic="T extends Record<string, any>">
interface Props {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: string;
  showSummary?: boolean;
  summaryLabel?: string;
  keyField?: string;
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  loading: false,
  emptyMessage: 'Không có dữ liệu',
  emptyIcon: 'inbox',
  showSummary: true,
  summaryLabel: 'Tổng số',
  keyField: '_id',
});

// Get cell value from row
const getCellValue = (row: T, column: TableColumn<T>) => {
  if (column.render) {
    return column.render(row);
  }
  return row[column.key];
};

// Get alignment class
const getAlignClass = (align?: 'left' | 'center' | 'right') => {
  switch (align) {
    case 'center':
      return 'text-center';
    case 'right':
      return 'text-right';
    default:
      return 'text-left';
  }
};
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

    <!-- Data Table -->
    <div v-else-if="data && data.length > 0">
      <div class="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 w-full">
        <table class="w-full table-auto divide-y divide-gray-200">
          <!-- Table Header -->
          <thead class="bg-gray-50">
            <tr>
              <th
                v-for="column in columns"
                :key="column.key"
                :class="[
                  'px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap',
                  getAlignClass(column.align)
                ]"
                :style="column.width ? { width: column.width } : {}"
              >
                {{ column.label }}
              </th>
            </tr>
          </thead>

          <!-- Table Body -->
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="row in data"
              :key="row[keyField]"
              class="hover:bg-gray-50 transition"
            >
              <td
                v-for="column in columns"
                :key="column.key"
                :class="[
                  'px-6 py-4',
                  getAlignClass(column.align)
                ]"
              >
                <slot
                  :name="`cell-${column.key}`"
                  :row="row"
                  :column="column"
                  :value="getCellValue(row, column)"
                >
                  <component
                    v-if="column.render && typeof getCellValue(row, column) === 'object'"
                    :is="getCellValue(row, column)"
                  />
                  <template v-else>
                    {{ getCellValue(row, column) }}
                  </template>
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Summary -->
      <div v-if="showSummary" class="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <slot name="summary" :total="data?.length || 0">
          <p class="text-sm text-gray-600">
            {{ summaryLabel }}: <span class="font-semibold">{{ data?.length || 0 }}</span>
          </p>
        </slot>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="p-12 text-center">
      <slot name="empty">
        <svg
          v-if="emptyIcon === 'inbox'"
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <svg
          v-else-if="emptyIcon === 'users'"
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">{{ emptyMessage }}</h3>
        <p class="mt-1 text-sm text-gray-500">Chưa có dữ liệu nào trong hệ thống.</p>
      </slot>
    </div>
  </div>
</template>
