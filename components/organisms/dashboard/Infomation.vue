<script setup lang="ts">
import { Users, Stethoscope, Activity, ClipboardList, TrendingUp, TrendingDown } from "lucide-vue-next";

interface Props {
  totalUsers: number;
  totalDoctors: number;
  totalSpecialties: number;
  totalReports: number;
  pendingReports: number;
  totalPatients: number;
  totalRatings: number;
  verifiedDoctors: number;
  loading: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  totalUsers: 0,
  totalDoctors: 0,
  totalSpecialties: 0,
  totalReports: 0,
  pendingReports: 0,
  totalPatients: 0,
  totalRatings: 0,
  verifiedDoctors: 0,
  loading: false,
});

// Stats cards configuration
const statsCards = computed(() => [
  {
    title: 'Tổng người dùng',
    value: props.totalUsers,
    icon: Users,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    link: '/manageUsers'
  },
  {
    title: 'Tổng bác sĩ',
    value: props.totalDoctors,
    icon: Stethoscope,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    link: '/manageDoctors',
    subtitle: `${props.verifiedDoctors} đã xác minh`
  },
  {
    title: 'Chuyên khoa',
    value: props.totalSpecialties,
    icon: Activity,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    link: '/specialties'
  },
  {
    title: 'Báo cáo',
    value: props.totalReports,
    icon: ClipboardList,
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600',
    link: '/reports',
    subtitle: `${props.pendingReports} chờ xử lý`
  },
]);

// Additional stats
const additionalStats = computed(() => [
  {
    label: 'Tổng lượt khám',
    value: props.totalPatients,
    trend: 'up',
    percentage: '12%'
  },
  {
    label: 'Tổng đánh giá',
    value: props.totalRatings,
    trend: 'up',
    percentage: '8%'
  },
  {
    label: 'Bác sĩ đã xác minh',
    value: props.verifiedDoctors,
    trend: 'up',
    percentage: `${props.totalDoctors > 0 ? Math.round((props.verifiedDoctors / props.totalDoctors) * 100) : 0}%`
  },
  {
    label: 'Báo cáo chờ xử lý',
    value: props.pendingReports,
    trend: props.pendingReports > 5 ? 'down' : 'up',
    percentage: `${props.totalReports > 0 ? Math.round((props.pendingReports / props.totalReports) * 100) : 0}%`
  },
]);
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800">Dashboard</h1>
      <p class="text-gray-600 mt-2">Tổng quan hệ thống HelloDoc</p>
    </div>

    <!-- Loading State -->
    <div v-if="props.loading" class="flex items-center justify-center py-20">
      <div class="flex flex-col items-center gap-3">
        <svg
          class="w-12 h-12 text-blue-600 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        <p class="text-gray-600">Đang tải dữ liệu...</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <NuxtLink
          v-for="card in statsCards"
          :key="card.title"
          :to="card.link"
          class="group"
        >
          <div class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:scale-105 cursor-pointer">
            <div class="flex items-center justify-between mb-4">
              <div :class="[card.bgColor, 'p-3 rounded-lg']">
                <component :is="card.icon" :class="[card.textColor, 'w-6 h-6']" />
              </div>
            </div>
            
            <div class="space-y-1">
              <p class="text-gray-500 text-sm font-medium">{{ card.title }}</p>
              <p class="text-3xl font-bold text-gray-800">{{ card.value.toLocaleString() }}</p>
              <p v-if="card.subtitle" class="text-xs text-gray-400">{{ card.subtitle }}</p>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Additional Stats -->
      <!-- <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 class="text-xl font-bold text-gray-800 mb-6">Thống kê chi tiết</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="stat in additionalStats"
            :key="stat.label"
            class="border-l-4 pl-4"
            :class="stat.trend === 'up' ? 'border-green-500' : 'border-red-500'"
          >
            <div class="flex items-center justify-between mb-2">
              <p class="text-sm text-gray-500">{{ stat.label }}</p>
              <div class="flex items-center gap-1">
                <component
                  :is="stat.trend === 'up' ? TrendingUp : TrendingDown"
                  :class="stat.trend === 'up' ? 'text-green-500' : 'text-red-500'"
                  class="w-4 h-4"
                />
                <span
                  :class="stat.trend === 'up' ? 'text-green-600' : 'text-red-600'"
                  class="text-xs font-semibold"
                >
                  {{ stat.percentage }}
                </span>
              </div>
            </div>
            <p class="text-2xl font-bold text-gray-800">{{ stat.value.toLocaleString() }}</p>
          </div>
        </div>
      </div> -->

      <!-- Quick Actions -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-6">Thao tác nhanh</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <NuxtLink
            to="/users"
            class="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all group"
          >
            <Users class="w-5 h-5 text-blue-600" />
            <span class="text-sm font-medium text-gray-700 group-hover:text-blue-600">Quản lý người dùng</span>
          </NuxtLink>
          
          <NuxtLink
            to="/doctors"
            class="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-all group"
          >
            <Stethoscope class="w-5 h-5 text-green-600" />
            <span class="text-sm font-medium text-gray-700 group-hover:text-green-600">Quản lý bác sĩ</span>
          </NuxtLink>
          
          <NuxtLink
            to="/specialties"
            class="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all group"
          >
            <Activity class="w-5 h-5 text-purple-600" />
            <span class="text-sm font-medium text-gray-700 group-hover:text-purple-600">Quản lý chuyên khoa</span>
          </NuxtLink>
          
          <NuxtLink
            to="/reports"
            class="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-all group"
          >
            <ClipboardList class="w-5 h-5 text-orange-600" />
            <span class="text-sm font-medium text-gray-700 group-hover:text-orange-600">Xem báo cáo</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
