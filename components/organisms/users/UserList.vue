<script setup lang="ts">
import DataTable from "@/components/molecules/DataTable.vue";
import { h } from 'vue';

interface Props {
  users: User[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

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
