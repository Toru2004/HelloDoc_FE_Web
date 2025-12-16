<script setup lang="ts">
import DataTable from "@/components/molecules/DataTable.vue";
import ImageViewerModal from "@/components/modal/ImageViewerModal.vue";
import { h, ref } from 'vue';

interface Props {
  doctors: Doctor[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

// Viewer State
const isViewerOpen = ref(false);
const selectedImageUrl = ref('');

const openImageViewer = (url: string) => {
  selectedImageUrl.value = url;
  isViewerOpen.value = true;
};

// Render doctor info cell
const renderDoctorCell = (row: Doctor) => {
  return h('div', { class: 'flex items-start gap-3' }, [
    h('div', { class: 'flex-shrink-0' }, [
      row.avatarURL
        ? h('img', {
            src: row.avatarURL,
            alt: row.name,
            class: 'h-16 w-16 rounded-full object-cover border-2 border-blue-200 cursor-pointer hover:opacity-90 transition-opacity',
            onClick: () => openImageViewer(row.avatarURL)
          })
        : h('div', {
            class: 'h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-xl'
          }, row.name.charAt(0).toUpperCase())
    ]),
    h('div', { class: 'min-w-0 flex-1' }, [
      h('div', { class: 'text-sm font-semibold text-gray-900' }, row.name),
      h('div', { class: 'text-xs text-gray-500 mt-1' }, row.email),
      h('div', { class: 'text-xs text-gray-500' }, row.phone),
      row.description
        ? h('div', {
            class: 'text-xs text-gray-600 mt-2 line-clamp-2',
            title: row.description
          }, row.description)
        : null
    ])
  ]);
};

// Render contact & address cell
const renderContactCell = (row: Doctor) => {
  return h('div', { class: 'text-xs text-gray-900 max-w-xs' }, [
    h('div', { class: 'font-medium mb-1' }, `CCCD: ${row.cccd}`),
    h('div', {
      class: 'text-gray-600 line-clamp-3',
      title: row.address
    }, row.address)
  ]);
};

// Render specialty cell
const renderSpecialtyCell = (row: Doctor) => {
  return h('div', { class: 'flex items-center gap-2' }, [
    row.specialty?.icon
      ? h('img', {
          src: row.specialty.icon,
          alt: row.specialty.name,
          class: 'w-8 h-8 rounded'
        })
      : null,
    h('div', [
      h('div', { class: 'text-sm font-medium text-gray-900' }, row.specialty?.name || 'N/A'),
      row.certificates
        ? h('div', {
            class: 'text-xs text-gray-500 mt-1 line-clamp-2',
            title: row.certificates
          }, row.certificates)
        : null
    ])
  ]);
};

// Render patients count cell
const renderPatientsCell = (row: Doctor) => {
  return h('div', { class: 'text-center' }, [
    h('div', { class: 'text-2xl font-bold text-blue-600' }, row.patientsCount),
    h('div', { class: 'text-xs text-gray-500' }, 'bệnh nhân')
  ]);
};

// Render ratings cell
const renderRatingsCell = (row: Doctor) => {
  return h('div', { class: 'text-center' }, [
    h('div', { class: 'text-2xl font-bold text-yellow-600' }, row.ratingsCount),
    h('div', { class: 'text-xs text-gray-500' }, 'đánh giá')
  ]);
};

// Render services cell
const renderServicesCell = (row: Doctor) => {
  return h('div', { class: 'flex flex-col gap-1' }, [
    h('span', {
      class: `px-2 py-1 text-xs font-semibold rounded-full text-center ${
        row.hasHomeService ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
      }`
    }, row.hasHomeService ? '✓ Khám tại nhà' : '✗ Không khám tại nhà'),
    h('span', {
      class: `px-2 py-1 text-xs font-semibold rounded-full text-center ${
        row.isClinicPaused ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
      }`
    }, row.isClinicPaused ? 'Tạm ngưng' : 'Đang hoạt động')
  ]);
};

// Render documents cell
const renderDocumentsCell = (row: Doctor) => {
  const createDocLink = (url: string, label: string) => {
    return h('div', {
      class: 'text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 cursor-pointer select-none',
      onClick: () => openImageViewer(url)
    }, [
      h('svg', {
        class: 'w-4 h-4',
        fill: 'none',
        viewBox: '0 0 24 24',
        stroke: 'currentColor'
      }, [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
        })
      ]),
      label
    ]);
  };

  const links = [];
  if (row.licenseUrl) links.push(createDocLink(row.licenseUrl, 'Giấy phép'));
  if (row.frontCccdUrl) links.push(createDocLink(row.frontCccdUrl, 'CCCD mặt trước'));
  if (row.backCccdUrl) links.push(createDocLink(row.backCccdUrl, 'CCCD mặt sau'));

  return h('div', { class: 'flex flex-col gap-2' }, links);
};

// Define table columns
const columns: TableColumn<Doctor>[] = [
  {
    key: 'doctor',
    label: 'Bác sĩ',
    align: 'left',
    render: renderDoctorCell as any,
  },
  {
    key: 'contact',
    label: 'Liên hệ',
    align: 'left',
    render: renderContactCell as any,
  },
  {
    key: 'specialty',
    label: 'Chuyên khoa',
    align: 'left',
    render: renderSpecialtyCell as any,
  },
  {
    key: 'patientsCount',
    label: 'Bệnh nhân',
    align: 'center',
    render: renderPatientsCell as any,
  },
  {
    key: 'ratingsCount',
    label: 'Đánh giá',
    align: 'center',
    render: renderRatingsCell as any,
  },
  {
    key: 'services',
    label: 'Dịch vụ',
    align: 'left',
    render: renderServicesCell as any,
  },
  {
    key: 'documents',
    label: 'Giấy tờ',
    align: 'left',
    render: renderDocumentsCell as any,
  },
];
</script>

<template>
  <div>
    <DataTable
      :columns="columns"
      :data="doctors"
      :loading="loading"
      empty-message="Không có bác sĩ"
      empty-icon="users"
      summary-label="Tổng số bác sĩ"
    />
    <ImageViewerModal 
      :is-open="isViewerOpen"
      :image-url="selectedImageUrl"
      @close="isViewerOpen = false"
    />
  </div>
</template>
