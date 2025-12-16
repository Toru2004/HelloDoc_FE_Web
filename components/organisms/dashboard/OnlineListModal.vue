<script setup lang="ts">
import { X, Search } from "lucide-vue-next";

interface OnlineUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface Props {
  isOpen: boolean;
  title: string;
  items: OnlineUser[];
}

const props = defineProps<Props>();
const emit = defineEmits(['close']);

const searchQuery = ref('');

const filteredItems = computed(() => {
  if (!searchQuery.value) return props.items;
  const query = searchQuery.value.toLowerCase();
  return props.items.filter(item => 
    item.name.toLowerCase().includes(query) || 
    item.email.toLowerCase().includes(query)
  );
});

const handleClose = () => {
  emit('close');
  searchQuery.value = '';
};
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" @click.self="handleClose">
      <div 
        class="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col max-h-[80vh] overflow-hidden transform transition-all"
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-y-4 opacity-0 scale-95"
        enter-to-class="translate-y-0 opacity-100 scale-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-y-0 opacity-100 scale-100"
        leave-to-class="translate-y-4 opacity-0 scale-95"
      >
        <!-- Header -->
        <div class="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
          <h3 class="text-lg font-bold text-gray-800">{{ title }}</h3>
          <button @click="handleClose" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X class="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <!-- Search -->
        <div class="p-4 border-b bg-gray-50">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Tìm kiếm..." 
              class="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
          </div>
        </div>

        <!-- List -->
        <div class="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          <template v-if="filteredItems.length > 0">
            <div v-for="item in filteredItems" :key="item.id" class="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors group">
              <div class="relative">
                <img 
                  :src="item.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=random`" 
                  :alt="item.name"
                  class="w-10 h-10 rounded-full object-cover border border-gray-100"
                />
                <span class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-900 truncate">{{ item.name }}</p>
                <p class="text-xs text-gray-500 truncate">{{ item.email }}</p>
              </div>
              <div v-if="item.role" class="px-2 py-1 bg-gray-100 rounded text-[10px] font-medium text-gray-600 uppercase">
                {{ item.role }}
              </div>
            </div>
          </template>
          
          <div v-else class="flex flex-col items-center justify-center py-10 text-gray-400">
            <p class="text-sm">Không tìm thấy kết quả</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-3 border-t bg-gray-50 text-center">
          <p class="text-xs text-gray-500">Đang hiển thị {{ filteredItems.length }} kết quả</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 20px;
}
</style>
