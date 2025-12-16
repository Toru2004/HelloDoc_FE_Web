<script setup lang="ts">
import { defineProps, defineEmits, onMounted, onUnmounted } from 'vue';
import { X, ZoomIn, ZoomOut, Download } from "lucide-vue-next";

const props = defineProps<{
  isOpen: boolean;
  imageUrl: string;
  title?: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const close = () => {
  emit('close');
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    close();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

const downloadImage = async () => {
  try {
    const response = await fetch(props.imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = props.title || 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed', error);
    window.open(props.imageUrl, '_blank');
  }
};
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
        @click.self="close"
      >
        <!-- Close Button -->
        <button 
          @click="close" 
          class="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50"
        >
          <X class="w-6 h-6" />
        </button>

        <!-- Content -->
        <div class="relative max-w-7xl max-h-screen p-4 flex flex-col items-center">
             <img 
                :src="imageUrl" 
                :alt="title || 'Preview'" 
                class="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                @click.stop
             />
             
             <!-- Toolbar (Optional) -->
             <div class="mt-4 flex items-center gap-4 bg-black/50 backdrop-blur px-4 py-2 rounded-full border border-white/10">
                 <span v-if="title" class="text-white text-sm font-medium mr-2">{{ title }}</span>
                 <button @click="downloadImage" class="p-1.5 text-white/80 hover:text-white transition-colors" title="Tải xuống">
                      <Download class="w-5 h-5" />
                 </button>
                 <button @click="() => window.open(imageUrl, '_blank')" class="p-1.5 text-white/80 hover:text-white transition-colors" title="Mở tab mới">
                      <ZoomIn class="w-5 h-5" />
                 </button>
             </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
