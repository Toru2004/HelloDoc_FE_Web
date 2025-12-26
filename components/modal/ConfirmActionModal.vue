<script setup lang="ts">
interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  icon?: 'warning' | 'info' | 'success' | 'error';
}

interface Emits {
  (e: 'close'): void;
  (e: 'confirm'): void;
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: 'Xác nhận',
  cancelText: 'Hủy',
  confirmButtonClass: 'bg-blue-600 hover:bg-blue-700',
  icon: 'warning',
});

const emit = defineEmits<Emits>();

const loading = ref(false);

const handleConfirm = () => {
  emit('confirm');
};

const handleClose = () => {
  if (!loading.value) {
    emit('close');
  }
};

// Icon configuration
const iconConfig = computed(() => {
  switch (props.icon) {
    case 'warning':
      return {
        bgClass: 'bg-red-100',
        iconClass: 'text-red-600',
        path: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
      };
    case 'info':
      return {
        bgClass: 'bg-blue-100',
        iconClass: 'text-blue-600',
        path: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      };
    case 'success':
      return {
        bgClass: 'bg-green-100',
        iconClass: 'text-green-600',
        path: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      };
    case 'error':
      return {
        bgClass: 'bg-red-100',
        iconClass: 'text-red-600',
        path: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
      };
    default:
      return {
        bgClass: 'bg-gray-100',
        iconClass: 'text-gray-600',
        path: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      };
  }
});

// Close on escape key
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isOpen && !loading.value) {
    handleClose();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm"
        @click.self="handleClose"
      >
        <div class="bg-white rounded-xl shadow-2xl max-w-md w-full">
          <!-- Header -->
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center gap-3">
              <div 
                class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                :class="iconConfig.bgClass"
              >
                <svg 
                  class="w-6 h-6" 
                  :class="iconConfig.iconClass"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    :d="iconConfig.path" 
                  />
                </svg>
              </div>
              <div class="flex-1">
                <h2 class="text-xl font-bold text-gray-900">{{ title }}</h2>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6">
            <p class="text-gray-700" v-html="message"></p>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              @click="handleClose"
              :disabled="loading"
              class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {{ cancelText }}
            </button>
            <button
              type="button"
              @click="handleConfirm"
              :disabled="loading"
              class="px-6 py-2.5 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
              :class="confirmButtonClass"
            >
              <svg v-if="loading" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ loading ? 'Đang xử lý...' : confirmText }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.9);
}
</style>
