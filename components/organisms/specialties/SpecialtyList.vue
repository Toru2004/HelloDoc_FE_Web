<script setup lang="ts">
import DataTable from "@/components/molecules/DataTable.vue";
import { h } from 'vue';

interface Props {
  specialties: Specialty[];
  loading?: boolean;
}

interface Emits {
  (e: 'edit', specialty: Specialty): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<Emits>();

// Render specialty info cell
const renderSpecialtyCell = (row: Specialty) => {
  return h('div', { class: 'flex items-center gap-3' }, [
    h('div', { class: 'flex-shrink-0' }, [
      row.icon
        ? h('img', {
            src: row.icon,
            alt: row.name,
            class: 'h-12 w-12 rounded-lg object-cover border border-gray-200'
          })
        : h('div', {
            class: 'h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-semibold'
          }, row.name.charAt(0))
    ]),
    h('div', [
      h('div', { class: 'text-sm font-semibold text-gray-900' }, row.name),
      h('div', { class: 'text-xs text-gray-500' }, `${row.doctors?.length || 0} bác sĩ`)
    ])
  ]);
};

// Render description cell
const renderDescriptionCell = (row: Specialty) => {
  return h('div', { class: 'text-sm text-gray-700 max-w-2xl' }, [
    h('div', {
      class: 'line-clamp-4 whitespace-pre-line',
      title: row.description
    }, row.description)
  ]);
};

// Render actions cell
const renderActionsCell = (row: Specialty) => {
  return h('div', { class: 'flex items-center gap-2' }, [
    h('button', {
      onClick: () => emit('edit', row),
      class: 'p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition',
      title: 'Chỉnh sửa'
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
    ])
  ]);
};

// Define table columns
const columns: TableColumn<Specialty>[] = [
  {
    key: 'specialty',
    label: 'Chuyên khoa',
    align: 'left',
    render: renderSpecialtyCell as any,
  },
  {
    key: 'description',
    label: 'Mô tả',
    align: 'left',
    render: renderDescriptionCell as any,
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
    :data="specialties"
    :loading="loading"
    empty-message="Không có chuyên khoa"
    empty-icon="inbox"
    summary-label="Tổng số chuyên khoa"
  />
</template>
