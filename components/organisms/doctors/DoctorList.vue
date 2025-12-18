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
  return h('div', { class: 'flex flex-col gap-2 min-w-[200px]' }, [
    // CCCD Badge
    h('div', { class: 'flex items-center gap-2 group' }, [
      h('div', { class: 'p-1.5 bg-gray-50 rounded-lg border border-gray-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors' }, [
        h('svg', { class: 'w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
          h('path', { d: 'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2' })
        ])
      ]),
      h('span', { class: 'text-xs font-semibold text-gray-700' }, row.cccd)
    ]),
    // Address with Icon
    h('div', { class: 'flex items-start gap-2 group' }, [
      h('div', { class: 'p-1.5 bg-gray-50 rounded-lg border border-gray-100 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-colors flex-shrink-0' }, [
        h('svg', { class: 'w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-500', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' }),
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M15 11a3 3 0 11-6 0 3 3 0 016 0z' })
        ])
      ]),
      h('span', { 
        class: 'text-xs text-gray-600 leading-relaxed line-clamp-2 italic',
        title: row.address 
      }, row.address)
    ])
  ]);
};

// Render specialty cell
const renderSpecialtyCell = (row: Doctor) => {
  return h('div', { class: 'flex flex-col gap-3 min-w-[220px]' }, [
    // Specialty Badge with Icon
    h('div', { class: 'flex items-center gap-3' }, [
      row.specialty?.icon
        ? h('div', { class: 'p-1 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden' }, [
            h('img', {
              src: row.specialty.icon,
              alt: row.specialty.name,
              class: 'w-10 h-10 object-cover rounded-md'
            })
          ])
        : h('div', { class: 'w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100' }, [
            h('svg', { class: 'w-5 h-5 text-blue-500', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
              h('path', { d: 'M19.423 15.423a2 2 0 00-2.828 0l-1.414 1.414a2 2 0 01-2.828 0l-5.657-5.657a2 2 0 010-2.828L8.11 6.939a2 2 0 000-2.828L6.697 2.697a2 2 0 00-2.828 0L1.22 5.344a2 2 0 000 2.828l14.85 14.85a2 2 0 002.828 0l2.647-2.647a2 2 0 000-2.828l-2.122-2.122z' })
            ])
          ]),
      h('div', [
        h('div', { class: 'text-sm font-bold text-gray-900 tracking-tight' }, row.specialty?.name || 'N/A'),
        h('div', { class: 'text-[10px] text-blue-600 font-medium uppercase tracking-wider' }, 'Chuyên khoa')
      ])
    ]),
    // Certificates with Badge Style
    row.certificates
      ? h('div', { class: 'flex items-start gap-2 p-2 bg-indigo-50/50 rounded-lg border border-indigo-100/50' }, [
          h('svg', { class: 'w-3.5 h-3.5 text-indigo-400 mt-0.5 flex-shrink-0', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
            h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' })
          ]),
          h('div', { 
            class: 'text-[11px] text-indigo-700 font-medium line-clamp-2 leading-relaxed italic',
            title: row.certificates 
          }, row.certificates)
        ])
      : null
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
  return h('div', { class: 'flex flex-col gap-2' }, [
    h('span', {
      class: `inline-flex items-center justify-center gap-1.5 w-40 py-1.5 text-[10px] font-bold rounded-lg border shadow-sm transition-all duration-200 hover:scale-105 ${
        row.hasHomeService 
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
          : 'bg-gray-50 text-gray-600 border-gray-200'
      }`
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
          d: row.hasHomeService ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'
        })
      ]),
      row.hasHomeService ? 'Khám tại nhà' : 'Không khám tại nhà'
    ]),
    h('span', {
      class: `inline-flex items-center justify-center gap-1.5 w-40 py-1.5 text-[10px] font-bold rounded-lg border shadow-sm transition-all duration-200 hover:scale-105 ${
        row.isClinicPaused 
          ? 'bg-red-50 text-red-700 border-red-200' 
          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
      }`
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
          d: row.isClinicPaused ? 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' : 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
        })
      ]),
      row.isClinicPaused ? 'Tạm ngưng' : 'Đang hoạt động'
    ])
  ]);
};

// Render documents cell
const renderDocumentsCell = (row: Doctor) => {
  const createDocLink = (url: string, label: string) => {
    return h('div', {
      class: 'inline-flex items-center justify-center gap-1.5 w-40 py-1.5 text-[10px] font-bold rounded-lg border border-blue-200 bg-blue-50 text-blue-700 shadow-sm transition-all duration-200 hover:scale-105 cursor-pointer select-none',
      onClick: () => openImageViewer(url)
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
