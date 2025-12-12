<script setup lang="ts">
import DataTable from "@/components/molecules/DataTable.vue";
import { h } from 'vue';

interface Props {
  users: User[];
  loading?: boolean;
}

interface Emits {
  (e: 'edit', user: User): void;
  (e: 'delete', user: User): void;
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

// Get role badge color
const getRoleBadgeColor = (role: string) => {
  const colorMap: Record<string, string> = {
    admin: 'bg-red-100 text-red-800',
    doctor: 'bg-blue-100 text-blue-800',
    user: 'bg-green-100 text-green-800',
  };
  return colorMap[role.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

// Render functions for custom cells
const renderUserCell = (row: User) => {
  return h('div', { class: 'flex items-center' }, [
    h('div', { class: 'flex-shrink-0 h-10 w-10' }, [
      row.avatarURL
        ? h('img', {
            src: row.avatarURL,
            alt: row.name,
            class: 'h-10 w-10 rounded-full object-cover'
          })
        : h('div', {
            class: 'h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold'
          }, row.name.charAt(0).toUpperCase())
    ]),
    h('div', { class: 'ml-4' }, [
      h('div', { class: 'text-sm font-medium text-gray-900' }, row.name),
      h('div', { class: 'text-sm text-gray-500' }, row.email)
    ])
  ]);
};

const renderPhoneCell = (row: User) => {
  return h('div', { class: 'text-sm text-gray-900' }, row.phone);
};

const renderAddressCell = (row: User) => {
  return h('div', {
    class: 'text-sm text-gray-900 max-w-xs truncate',
    title: row.address
  }, row.address);
};

const renderRoleCell = (row: User) => {
  return h('span', {
    class: `px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(row.role)}`
  }, row.role);
};

const renderDateCell = (row: User) => {
  return h('div', { class: 'text-sm text-gray-500' }, formatDate(row.createdAt));
};

const renderStatusCell = (row: User) => {
  const isActive = !row.isDeleted;
  const statusText = isActive ? 'Đang hoạt động' : 'Đã khóa';
  const statusClass = isActive 
    ? 'bg-green-50 text-green-700 border border-green-200' 
    : 'bg-red-50 text-red-700 border border-red-200';
  
  // Icon for status
  const iconPath = isActive
    ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' // Check circle icon
    : 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'; // X circle icon
  
  return h('div', { class: 'flex items-center' }, [
    h('span', {
      class: `inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${statusClass}`
    }, [
      h('svg', {
        class: 'w-3.5 h-3.5',
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

const renderActionsCell = (row: User) => {
  const isActive = !row.isDeleted;
  
  return h('div', { class: 'flex items-center gap-2' }, [
    // Edit button
    h('button', {
      class: 'p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors',
      title: 'Chỉnh sửa',
      onClick: () => emit('edit', row)
    }, [
      h('svg', {
        class: 'w-5 h-5',
        fill: 'none',
        viewBox: '0 0 24 24',
        stroke: 'currentColor'
      }, [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
        })
      ])
    ]),
    // Delete button (only for active users)
    isActive ? h('button', {
      class: 'p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors',
      title: 'Khóa tài khoản',
      onClick: () => emit('delete', row)
    }, [
      h('svg', {
        class: 'w-5 h-5',
        fill: 'none',
        viewBox: '0 0 24 24',
        stroke: 'currentColor'
      }, [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
        })
      ])
    ]) : null
  ]);
};

// Define table columns with render functions
const columns: TableColumn<User>[] = [
  {
    key: 'user',
    label: 'Người dùng',
    align: 'left',
    render: renderUserCell as any,
  },
  {
    key: 'phone',
    label: 'Liên hệ',
    align: 'left',
    render: renderPhoneCell as any,
  },
  {
    key: 'address',
    label: 'Địa chỉ',
    align: 'left',
    render: renderAddressCell as any,
  },
  {
    key: 'role',
    label: 'Vai trò',
    align: 'left',
    render: renderRoleCell as any,
  },
  {
    key: 'createdAt',
    label: 'Ngày tạo',
    align: 'left',
    render: renderDateCell as any,
  },
  {
    key: 'status',
    label: 'Trạng thái',
    align: 'left',
    render: renderStatusCell as any,
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
    :data="users"
    :loading="loading"
    empty-message="Không có người dùng"
    empty-icon="users"
    summary-label="Tổng số người dùng"
  />
</template>
