<script setup lang="ts">
import DataTable from "@/components/molecules/DataTable.vue";
import { h } from 'vue';

interface Props {
  reports: Report[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

// Format date
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

// Get status badge color
const getStatusConfig = (status: string) => {
  const s = status.toLowerCase();
  const configs: Record<string, { label: string; classes: string; icon: string }> = {
    opened: {
      label: 'Chờ xử lý',
      classes: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    processing: {
      label: 'Đang xử lý',
      classes: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
    },
    closed: {
      label: 'Đã đóng',
      classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    rejected: {
      label: 'Từ chối',
      classes: 'bg-red-50 text-red-700 border-red-200',
      icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
    },
  };
  return configs[s] || {
    label: status,
    classes: 'bg-gray-50 text-gray-700 border-gray-200',
    icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  };
};

// Render type cell
const renderTypeCell = (row: Report) => {
  const typeConfigs: Record<string, string> = {
    'Bài viết': 'bg-purple-50 text-purple-700 border-purple-200',
    'Bình luận': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Người dùng': 'bg-orange-50 text-orange-700 border-orange-200',
    'Bác sĩ': 'bg-teal-50 text-teal-700 border-teal-200',
  };
  const classes = typeConfigs[row.type] || 'bg-gray-50 text-gray-700 border-gray-200';

  return h('span', {
    class: `inline-flex items-center justify-center gap-1.5 w-32 py-1 text-[10px] font-bold rounded-lg border shadow-sm ${classes}`
  }, row.type);
};

// Render content cell
const renderContentCell = (row: Report) => {
  const elements = [
    h('div', {
      class: 'line-clamp-2',
      title: row.content
    }, row.content)
  ];

  if (row.responseContent) {
    elements.push(
      h('div', { class: 'mt-2 text-xs text-gray-500 italic' }, [
        h('span', { class: 'font-semibold' }, 'Phản hồi: '),
        row.responseContent
      ])
    );
  }

  return h('div', { class: 'text-sm text-gray-900 max-w-md' }, elements);
};

// Render reporter cell
const renderReporterCell = (row: Report) => {
  if (!row.reporter) {
    return h('div', { class: 'text-sm text-gray-400 italic' }, 'Người dùng đã bị xóa');
  }

  return h('div', { class: 'flex items-center gap-3' }, [
    h('div', { class: 'flex-shrink-0' }, [
      row.reporter.avatarURL
        ? h('img', {
            src: row.reporter.avatarURL,
            alt: row.reporter.name || 'User',
            class: 'h-10 w-10 rounded-full object-cover'
          })
        : h('div', {
            class: 'h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold'
          }, (row.reporter.name || 'U').charAt(0).toUpperCase())
    ]),
    h('div', { class: 'min-w-0' }, [
      h('div', { class: 'text-sm font-medium text-gray-900 truncate' }, row.reporter.name || 'N/A'),
      h('div', { class: 'text-xs text-gray-500 truncate' }, row.reporter.email || 'N/A'),
      h('div', { class: 'text-xs text-gray-400' }, [
        h('span', { class: 'px-2 py-0.5 rounded bg-gray-100' }, row.reporter.role || 'N/A')
      ])
    ])
  ]);
};

// Render status cell
const renderStatusCell = (row: Report) => {
  const config = getStatusConfig(row.status);
  
  return h('span', {
    class: `inline-flex items-center justify-center gap-1.5 w-36 py-1.5 text-[10px] font-bold rounded-lg border shadow-sm transition-all duration-200 hover:scale-105 ${config.classes}`
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
        d: config.icon
      })
    ]),
    config.label
  ]);
};

// Render time cell
const renderTimeCell = (row: Report) => {
  const elements = [
    h('div', { class: 'text-sm text-gray-900' }, formatDate(row.createdAt))
  ];

  if (row.responseTime) {
    elements.push(
      h('div', { class: 'text-xs text-gray-500 mt-1' }, `Phản hồi: ${row.responseTime}`)
    );
  }

  return h('div', elements);
};

// Define table columns
const columns: TableColumn<Report>[] = [
  {
    key: 'type',
    label: 'Loại báo cáo',
    align: 'left',
    render: renderTypeCell as any,
  },
  {
    key: 'content',
    label: 'Nội dung',
    align: 'left',
    render: renderContentCell as any,
  },
  {
    key: 'reporter',
    label: 'Người báo cáo',
    align: 'left',
    render: renderReporterCell as any,
  },
  {
    key: 'status',
    label: 'Trạng thái',
    align: 'left',
    render: renderStatusCell as any,
  },
  {
    key: 'createdAt',
    label: 'Thời gian',
    align: 'left',
    render: renderTimeCell as any,
  },
];
</script>

<template>
  <DataTable
    :columns="columns"
    :data="reports"
    :loading="loading"
    empty-message="Không có báo cáo"
    empty-icon="inbox"
    summary-label="Tổng số báo cáo"
  />
</template>
