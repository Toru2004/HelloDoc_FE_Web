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
const getStatusBadgeColor = (status: string) => {
  const colorMap: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    closed: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };
  return colorMap[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

// Get status text
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: 'Chờ xử lý',
    opened: 'Đang chờ xử lý',
    processing: 'Đang xử lý',
    closed: 'Đã đóng',
    rejected: 'Từ chối',
  };
  return statusMap[status.toLowerCase()] || status;
};

// Get type badge color
const getTypeBadgeColor = (type: string) => {
  const colorMap: Record<string, string> = {
    'Bài viết': 'bg-purple-100 text-purple-800',
    'Bình luận': 'bg-indigo-100 text-indigo-800',
    'Người dùng': 'bg-orange-100 text-orange-800',
    'Bác sĩ': 'bg-teal-100 text-teal-800',
  };
  return colorMap[type] || 'bg-gray-100 text-gray-800';
};

// Render type cell
const renderTypeCell = (row: Report) => {
  return h('span', {
    class: `px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadgeColor(row.type)}`
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
  return h('span', {
    class: `px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(row.status)}`
  }, getStatusText(row.status));
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
