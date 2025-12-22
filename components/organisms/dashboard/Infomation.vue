<script setup lang="ts">
import { Users, Stethoscope, Activity, ClipboardList, TrendingUp, TrendingDown, Eye, Zap, ArrowRight } from "lucide-vue-next";
import OnlineListModal from "./OnlineListModal.vue";

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
  onlineUsers?: number;
  onlineDoctors?: number;
  usersList?: any[];
  doctorsList?: any[];
  onlineUserIds?: string[];
  onlineDoctorIds?: string[];
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
  onlineUsers: 0,
  onlineDoctors: 0,
  usersList: () => [],
  doctorsList: () => [],
  onlineUserIds: () => [],
  onlineDoctorIds: () => [],
});

// === Animation Logic ===
const useAnimatedNumber = (target: () => number) => {
  const displayed = ref(target());
  
  watch(target, (newVal) => {
    const start = displayed.value;
    const startTime = performance.now();
    const duration = 800; // ms

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quart
      const ease = 1 - Math.pow(1 - progress, 4);
      
      displayed.value = Math.round(start + (newVal - start) * ease);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  });

  return displayed;
};

const animatedOnlineUsers = useAnimatedNumber(() => props.onlineUsers);
const animatedOnlineDoctors = useAnimatedNumber(() => props.onlineDoctors);

// === Modal Logic ===
const isModalOpen = ref(false);
const modalTitle = ref("");
const modalItems = ref<any[]>([]);

const openOnlineUsersModal = () => {
  const onlineMap = new Set(props.onlineUserIds);
  const users = props.usersList.filter(u => onlineMap.has(u._id));
  
  modalItems.value = users.map(u => ({
    id: u._id,
    name: u.name || 'Unknown User',
    email: u.email,
    avatar: u.avatarURL,
    role: 'User'
  }));
  
  const matchedIds = new Set(users.map(u => u._id));
  props.onlineUserIds.forEach(id => {
    if (!matchedIds.has(id)) {
      modalItems.value.push({
        id: id,
        name: `User ${id.substring(0, 6)}...`,
        email: 'Unknown',
        role: 'Visitor/User'
      });
    }
  });

  modalTitle.value = "Người dùng đang online";
  isModalOpen.value = true;
};

const openOnlineDoctorsModal = () => {
  const onlineMap = new Set(props.onlineDoctorIds);
  const doctors = props.doctorsList.filter(d => onlineMap.has(d._id));

  modalItems.value = doctors.map(d => ({
    id: d._id,
    name: d.name || 'Unknown Doctor',
    email: d.email,
    avatar: d.avatarURL,
    role: 'Doctor'
  }));
  
  props.onlineDoctorIds.forEach(id => {
    if (!doctors.find(d => d._id === id)) {
      modalItems.value.push({
        id: id,
        name: `Doctor ${id.substring(0, 6)}...`,
        email: 'Unknown',
        role: 'Doctor'
      });
    }
  });

  modalTitle.value = "Bác sĩ đang online";
  isModalOpen.value = true;
};

// === Stats Configuration ===
const statsCards = computed(() => [
  {
    title: 'Tổng người dùng',
    value: props.totalUsers,
    icon: Users,
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    link: '/manageUsers',
  },
  {
    title: 'Tổng bác sĩ',
    value: props.totalDoctors,
    icon: Stethoscope,
    color: 'bg-green-500',
    lightColor: 'bg-green-50',
    textColor: 'text-green-600',
    link: '/manageDoctors',
    subtitle: `${props.verifiedDoctors} đã xác minh`
  },
  {
    title: 'Chuyên khoa',
    value: props.totalSpecialties,
    icon: Activity,
    color: 'bg-purple-500',
    lightColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    link: '/specialties'
  },
  {
    title: 'Báo cáo',
    value: props.totalReports,
    icon: ClipboardList,
    color: 'bg-orange-500',
    lightColor: 'bg-orange-50',
    textColor: 'text-orange-600',
    link: '/reports',
    subtitle: `${props.pendingReports} chờ xử lý`
  },
]);

const quickActions = [
  { label: 'Quản lý người dùng', icon: Users, to: '/users', color: 'text-blue-600', hoverBg: 'hover:bg-blue-50' },
  { label: 'Quản lý bác sĩ', icon: Stethoscope, to: '/doctors', color: 'text-green-600', hoverBg: 'hover:bg-green-50' },
  { label: 'Quản lý chuyên khoa', icon: Activity, to: '/specialties', color: 'text-purple-600', hoverBg: 'hover:bg-purple-50' },
  { label: 'Xem báo cáo', icon: ClipboardList, to: '/reports', color: 'text-orange-600', hoverBg: 'hover:bg-orange-50' },
];
</script>

<template>
  <div class="container mx-auto px-4 py-6 max-w-7xl">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 tracking-tight">Dashboard Overview</h1>
        <p class="text-gray-500 text-sm mt-1">HelloDoc Admin Panel</p>
      </div>
      <div class="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
        <span class="relative flex h-2.5 w-2.5">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
        </span>
        <span class="text-xs font-medium text-gray-600">Hệ thống đang hoạt động</span>
      </div>
    </div>

    <div v-if="props.loading" class="flex flex-col items-center justify-center py-32 space-y-4">
      <div class="relative">
        <div class="w-12 h-12 border-4 border-blue-100 rounded-full animate-spin border-t-blue-600"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-2 h-2 bg-blue-600 rounded-full"></div>
        </div>
      </div>
      <p class="text-gray-400 text-sm animate-pulse">Đang đồng bộ dữ liệu...</p>
    </div>

    <div v-else>
      <div class="grid grid-cols-12 gap-6">
        
        <!-- LEFT COLUMN: Live Data (Span 4) -->
        <div class="col-span-12 lg:col-span-4 space-y-6">
          <div class="bg-gradient-to-br from-indigo-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden ring-1 ring-white/10">
            <!-- Background Decoration -->
            <div class="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
            <div class="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-20"></div>

            <div class="relative z-10">
              <div class="flex items-center gap-2 mb-6">
                <Zap class="w-5 h-5 text-yellow-300 fill-yellow-300" />
                <h2 class="font-semibold text-lg tracking-wide">Hoạt động</h2>
              </div>

              <div class="space-y-4">
                <!-- Online Users Item -->
                <div class="group bg-white/5 hover:bg-white/10 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all duration-300">
                  <div class="flex justify-between items-start mb-2">
                    <span class="text-slate-300 text-sm font-medium">Người dùng</span>
                    <button @click="openOnlineUsersModal" class="p-1.5 hover:bg-white/10 rounded-lg transition-colors" title="Xem danh sách">
                      <Eye class="w-4 h-4 text-slate-400 group-hover:text-blue-300" />
                    </button>
                  </div>
                  <div class="flex items-baseline gap-2">
                    <span class="text-4xl font-bold tracking-tight text-white transition-all duration-300 ease-out" :key="animatedOnlineUsers">
                      {{ animatedOnlineUsers }}
                    </span>
                    <span class="text-xs text-green-400 font-medium bg-green-400/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <div class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div> Đang hoạt động
                    </span>
                  </div>
                </div>

                <!-- Online Doctors Item -->
                <div class="group bg-white/5 hover:bg-white/10 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all duration-300">
                  <div class="flex justify-between items-start mb-2">
                    <span class="text-slate-300 text-sm font-medium">Bác sĩ</span>
                    <button @click="openOnlineDoctorsModal" class="p-1.5 hover:bg-white/10 rounded-lg transition-colors" title="Xem danh sách">
                      <Eye class="w-4 h-4 text-slate-400 group-hover:text-green-300" />
                    </button>
                  </div>
                  <div class="flex items-baseline gap-2">
                    <span class="text-4xl font-bold tracking-tight text-white transition-all duration-300 ease-out" :key="animatedOnlineDoctors">
                      {{ animatedOnlineDoctors }}
                    </span>
                    <span class="text-xs text-green-400 font-medium bg-green-400/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <div class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div> Đang hoạt động
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions Panel (Vertical on Desktops, nice fit below Live Stats) -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hidden lg:block">
            <h3 class="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wider">Lối tắt</h3>
            <div class="space-y-2">
              <NuxtLink 
                v-for="action in quickActions" 
                :key="action.to"
                :to="action.to"
                class="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-100"
              >
                <div class="flex items-center gap-3">
                  <div class="p-2 rounded-lg bg-gray-50 group-hover:bg-white group-hover:shadow-sm transition-all" :class="action.color">
                    <component :is="action.icon" class="w-4 h-4" />
                  </div>
                  <span class="text-sm font-medium text-gray-600 group-hover:text-gray-900">{{ action.label }}</span>
                </div>
                <ArrowRight class="w-4 h-4 text-gray-300 group-hover:text-gray-500 transform group-hover:translate-x-1 transition-all" />
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: Stats & Data (Span 8) -->
        <div class="col-span-12 lg:col-span-8 flex flex-col gap-6">
          
          <!-- Main Stats Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              v-for="card in statsCards"
              :key="card.title"
              class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 relative group overflow-hidden"
            >
              <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-full"></div>
              
              <div class="relative z-10">
                <div class="flex justify-between items-start mb-4">
                  <div :class="[card.lightColor, card.textColor]" class="p-3 rounded-xl">
                    <component :is="card.icon" class="w-6 h-6" />
                  </div>
                  <NuxtLink :to="card.link" class="text-xs font-semibold text-gray-400 hover:text-blue-600 transition-colors">
                    Chi tiết
                  </NuxtLink>
                </div>
                
                <div>
                  <h3 class="text-gray-500 text-sm font-medium mb-1">{{ card.title }}</h3>
                  <div class="flex items-end gap-2">
                    <span class="text-2xl font-bold text-gray-800">{{ card.value.toLocaleString() }}</span>
                    <span v-if="card.subtitle" class="text-xs text-gray-400 mb-1.5 font-medium px-1.5 py-0.5 bg-gray-100 rounded">
                      {{ card.subtitle }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Mobile/Tablet Quick Actions (Visible only on smaller screens) -->
          <div class="lg:hidden grid grid-cols-2 gap-3">
             <NuxtLink 
                v-for="action in quickActions" 
                :key="action.to"
                :to="action.to"
                class="flex flex-col items-center justify-center p-4 rounded-xl bg-white shadow-sm border border-gray-100 active:scale-95 transition-all text-center gap-2"
              >
                <div class="p-2.5 rounded-full bg-gray-50" :class="action.color">
                   <component :is="action.icon" class="w-5 h-5" />
                </div>
                <span class="text-xs font-medium text-gray-700">{{ action.label }}</span>
             </NuxtLink>
          </div>

          <!-- Optional: Chart or Secondary Content Placeholder could go here -->
          <div class="bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-8 flex flex-col items-center justify-center text-center">
             <div class="p-3 bg-white rounded-full shadow-sm mb-3">
               <Activity class="w-6 h-6 text-gray-400" />
             </div>
             <h4 class="text-gray-900 font-medium">Biểu đồ thống kê</h4>
             <p class="text-gray-500 text-sm max-w-xs mx-auto mt-1">Tính năng biểu đồ tăng trưởng và phân tích dữ liệu tham khảo sẽ được cập nhật sớm.</p>
          </div>

        </div>
      </div>
    </div>

    <!-- Modals -->
    <OnlineListModal
      :is-open="isModalOpen"
      :title="modalTitle"
      :items="modalItems"
      @close="isModalOpen = false"
    />
  </div>
</template>

<style scoped>
/* Custom animations if needed beyond tailwind */
.rotate-enter-active,
.rotate-leave-active {
  transition: all 0.5s ease;
}
.rotate-enter-from,
.rotate-leave-to {
  opacity: 0;
  transform: rotateX(90deg);
}
</style>
