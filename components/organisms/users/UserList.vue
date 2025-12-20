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
  (e: 'reactivate', user: User): void;
  (e: 'view-image', url: string): void;
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

// Role configuration helper (Label, Icon, Styles)
const getRoleConfig = (role: string) => {
  const r = role.toLowerCase();
  
  const configs: Record<string, { label: string; icon: string; classes: string }> = {
    admin: {
      label: 'Quản trị viên',
      classes: 'bg-red-50 text-red-700 border-red-200',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
    },
    doctor: {
      label: 'Bác sĩ',
      classes: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z' // Simplified lightning/energy or stethoscope-ish placeholder
    },
    user: {
      label: 'Người bình thường',
      classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    },
    blind: {
      label: 'Người khiếm thị',
      classes: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L5.465 5.464m9.95 9.95l4.586 4.586m-5.06-10.74a10.003 10.003 0 013.358 2.748M21 12a9.959 9.959 0 01-1.563 3.029'
    },
    deaf: {
      label: 'Người khiếm thính',
      classes: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: 'M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z'
    },
    mute: {
      label: 'Người khiếm khẩu',
      classes: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z'
    }
  };
  
  return configs[r] || {
    label: role,
    classes: 'bg-gray-50 text-gray-700 border-gray-200',
    icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  };
};

// Render functions for custom cells
const renderUserCell = (row: User) => {
  return h('div', { class: 'flex items-center' }, [
    h('div', { class: 'flex-shrink-0 h-10 w-10' }, [
      row.avatarURL
        ? h('img', {
            src: row.avatarURL,
            alt: row.name,
            class: 'h-10 w-10 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity',
            onClick: () => emit('view-image', row.avatarURL!)
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
  const config = getRoleConfig(row.role);
  
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
    h('span', { class: 'truncate' }, config.label)
  ]);
};

const renderDateCell = (row: User) => {
  return h('div', { class: 'text-sm text-gray-500' }, formatDate(row.createdAt));
};

const renderStatusCell = (row: User) => {
  const isActive = !row.isDeleted;
  const statusText = isActive ? 'Đang hoạt động' : 'Đã khóa';
  const statusClass = isActive 
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
    : 'bg-red-50 text-red-700 border-red-200';
  
  // Icon path for status
  const iconPath = isActive
    ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' // Check circle
    : 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'; // X circle
  
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
    // Lock/Unlock button
    isActive 
      ? h('button', {
          class: 'p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors',
          title: 'Khóa tài khoản',
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
              d: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
            })
          ])
        ])
      : h('button', {
          class: 'p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors',
          title: 'Mở khóa tài khoản',
          onClick: () => emit('reactivate', row)
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
              d: 'M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z'
            })
          ])
        ])
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
