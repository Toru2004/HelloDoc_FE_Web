<script setup lang="ts">
import DataTable from "@/components/molecules/DataTable.vue";
import { h } from 'vue';

interface Props {
  specialties: Specialty[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

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
