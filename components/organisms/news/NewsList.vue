<script setup lang="ts">
import DataTable from "@/components/molecules/DataTable.vue";
import { h } from 'vue';
import type { News } from '@/domain/entities/news';

interface Props {
  news: News[];
  loading?: boolean;
}

interface Emits {
  (e: 'edit', news: News): void;
  (e: 'delete', news: News): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<Emits>();

// Format date helper
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Render title cell
const renderTitleCell = (row: News) => {
  return h('div', { class: 'text-sm font-semibold text-gray-900' }, row.title);
};

// Render content cell with preview
const renderContentCell = (row: News) => {
  const preview = row.content.length > 80 
    ? row.content.substring(0, 80) + '...' 
    : row.content;
  
  return h('div', {
    class: 'text-sm text-gray-700 max-w-md',
    title: row.content
  }, preview);
};

// Render media cell
const renderMediaCell = (row: News) => {
  const mediaCount = row.media.length;
  
  if (mediaCount === 0) {
    return h('div', { class: 'text-sm text-gray-400' }, 'Không có media');
  }

  return h('div', { class: 'flex items-center gap-2' }, [
    row.media[0] && h('img', {
      src: row.media[0],
      alt: 'Media preview',
      class: 'h-12 w-12 rounded object-cover border border-gray-200',
      onerror: (e: Event) => {
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
      }
    }),
    h('div', { class: 'text-sm text-gray-600' }, 
      `${mediaCount} ${mediaCount === 1 ? 'file' : 'files'}`
    )
  ]);
};

// Render status cell
const renderStatusCell = (row: News) => {
  const isVisible = !row.isHidden;
  const statusText = isVisible ? 'Hiển thị' : 'Đã ẩn';
  const statusClass = isVisible 
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
    : 'bg-gray-50 text-gray-700 border-gray-200';
  
  const iconPath = isVisible
    ? 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
    : 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21';
  
  return h('div', { class: 'flex items-center' }, [
    h('span', {
      class: `inline-flex items-center justify-center gap-1.5 w-36 py-1.5 text-[10px] font-bold rounded-lg border shadow-sm transition-all duration-200 hover:scale-105 ${statusClass}`
    }, [
      h('svg', {
        class: 'w-3.5 h-3.5 flex-shrink-0',
        fill: 'none',
        viewBox: '0 0 24 24',
        stroke: 'currentColor',
        'stroke-width': '2'
      }, [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          d: iconPath
        })
      ]),
      statusText
    ])
  ]);
};

// Render date cell
const renderDateCell = (row: News) => {
  return h('div', { class: 'text-sm text-gray-500' }, formatDate(row.createdAt));
};

// Render actions cell
const renderActionsCell = (row: News) => {
  const isVisible = !row.isHidden;
  
  if (!isVisible) {
    return h('div', { class: 'text-sm text-gray-400' }, '-');
  }

  return h('div', { class: 'flex items-center gap-2' }, [
    // Edit button
    h('button', {
      class: 'p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors',
      title: 'Chỉnh sửa tin tức',
      onClick: () => emit('edit', row)
    }, [
      h('svg', {
        class: 'w-5 h-5',
        fill: 'none',
        viewBox: '0 0 24 24',
        stroke: 'currentColor',
        'stroke-width': '2'
      }, [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          d: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
        })
      ])
    ]),
    // Delete button
    h('button', {
      class: 'p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors',
      title: 'Ẩn tin tức',
      onClick: () => emit('delete', row)
    }, [
      h('svg', {
        class: 'w-5 h-5',
        fill: 'none',
        viewBox: '0 0 24 24',
        stroke: 'currentColor',
        'stroke-width': '2'
      }, [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          d: 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
        })
      ])
    ])
  ]);
};

// Define table columns
const columns: TableColumn<News>[] = [
  {
    key: 'title',
    label: 'Tiêu đề',
    align: 'left',
    render: renderTitleCell as any,
  },
  {
    key: 'content',
    label: 'Nội dung',
    align: 'left',
    render: renderContentCell as any,
  },
  {
    key: 'media',
    label: 'Media',
    align: 'left',
    render: renderMediaCell as any,
  },
  {
    key: 'status',
    label: 'Trạng thái',
    align: 'left',
    render: renderStatusCell as any,
  },
  {
    key: 'createdAt',
    label: 'Ngày tạo',
    align: 'left',
    render: renderDateCell as any,
  },
  {
    key: 'actions',
    label: 'Thao tác',
    align: 'center',
    render: renderActionsCell as any,
  },
];
</script>

<template>
  <DataTable
    :columns="columns"
    :data="news"
    :loading="loading"
    empty-message="Không có tin tức"
    empty-icon="inbox"
    summary-label="Tổng số tin tức"
  />
</template>
