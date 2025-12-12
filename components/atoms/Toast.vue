<script setup lang="ts">
interface Props {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}

interface Emits {
  (e: 'remove', id: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  duration: 5000,
});

const emit = defineEmits<Emits>();

// Auto-dismiss after duration
onMounted(() => {
  if (props.duration > 0) {
    setTimeout(() => {
      emit('remove', props.id);
    }, props.duration);
  }
});

// Icon based on type
const icon = computed(() => {
  switch (props.type) {
    case 'success':
      return {
        path: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        color: 'text-green-500',
        bg: 'bg-green-50',
        border: 'border-green-200',
      };
    case 'error':
      return {
        path: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
        color: 'text-red-500',
        bg: 'bg-red-50',
        border: 'border-red-200',
      };
    case 'info':
      return {
        path: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        color: 'text-blue-500',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
      };
    default:
      return {
        path: '',
        color: 'text-gray-500',
        bg: 'bg-gray-50',
        border: 'border-gray-200',
      };
  }
});

// Manual close
const handleClose = () => {
  emit('remove', props.id);
};
</script>

<template>
  <div
    class="toast-item flex items-start gap-3 p-4 rounded-lg shadow-lg border backdrop-blur-sm bg-white/95 min-w-[320px] max-w-md"
    :class="[icon.border]"
  >
    <!-- Icon -->
    <div class="flex-shrink-0" :class="[icon.bg, 'rounded-full p-1']">
      <svg
        class="w-5 h-5"
        :class="icon.color"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          :d="icon.path"
        />
      </svg>
    </div>

    <!-- Message -->
    <p class="flex-1 text-sm font-medium text-gray-800 leading-relaxed">
      {{ message }}
    </p>

    <!-- Close Button -->
    <button
      @click="handleClose"
      class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition"
    >
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.toast-item {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
