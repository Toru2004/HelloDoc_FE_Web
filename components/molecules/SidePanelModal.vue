<script setup lang="ts">
interface Props {
  isOpen: boolean;
  title: string;
  loading?: boolean;
  submitText?: string;
  cancelText?: string;
  formId?: string;
  submitDisabled?: boolean;
}

interface Emits {
  (e: 'close'): void;
  (e: 'submit'): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  submitText: 'Lưu',
  cancelText: 'Hủy',
  formId: 'side-panel-form',
  submitDisabled: false,
});

const emit = defineEmits<Emits>();

const handleClose = () => {
  if (!props.loading) {
    emit('close');
  }
};

const handleSubmit = () => {
  emit('submit');
};

// Close on escape key
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isOpen && !props.loading) {
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
  <Transition name="slide">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-stretch justify-end"
    >
      <!-- Overlay -->
      <div 
        class="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        @click="handleClose"
      ></div>

      <!-- Side Panel -->
      <div class="relative w-full md:w-1/2 bg-white shadow-2xl flex flex-col">
        <!-- Fixed Header -->
        <div class="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
          <!-- Left: Close Button + Title -->
          <div class="flex items-center gap-4">
            <button
              @click="handleClose"
              :disabled="loading"
              class="text-gray-400 hover:text-gray-600 transition disabled:opacity-50 p-2 hover:bg-gray-100 rounded-lg"
              title="Đóng"
            >
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 class="text-2xl font-bold text-gray-900">{{ title }}</h2>
          </div>

          <!-- Right: Action Buttons (slot or default) -->
          <div class="flex items-center gap-3">
            <slot name="actions" :loading="loading">
              <!-- Default action buttons -->
              <button
                type="button"
                @click="handleClose"
                :disabled="loading"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {{ cancelText }}
              </button>
              <button
                type="submit"
                :form="formId"
                :disabled="loading || submitDisabled"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
              >
                <svg v-if="loading" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ loading ? 'Đang xử lý...' : submitText }}</span>
              </button>
            </slot>
          </div>
        </div>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto">
          <div class="p-6">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

.slide-enter-from .relative,
.slide-leave-to .relative {
  transform: translateX(100%);
}

.slide-enter-active .relative,
.slide-leave-active .relative {
  transition: transform 0.3s ease;
}
</style>
