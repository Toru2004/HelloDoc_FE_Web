<script setup lang="ts">
import { ref } from 'vue';
import { X, AlertCircle } from 'lucide-vue-next';

interface Props {
  isOpen: boolean;
  doctorName: string;
}

interface Emits {
  (e: 'close'): void;
  (e: 'confirm', reason: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const reason = ref('');
const error = ref('');
const loading = ref(false);

const handleConfirm = () => {
  if (!reason.value.trim()) {
    error.value = 'Vui lòng nhập lý do từ chối';
    return;
  }
  loading.value = true;
  emit('confirm', reason.value);
};

const handleClose = () => {
  if (!loading.value) {
    reason.value = '';
    error.value = '';
    emit('close');
  }
};
</script>

<template>
  <Transition name="modal">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm"
      @click.self="handleClose"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100">
        <!-- Header -->
        <div class="p-6 border-b border-gray-100 bg-gray-50/50">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-900">Từ chối đơn đăng ký</h2>
            <button @click="handleClose" class="text-gray-400 hover:text-gray-600 transition">
              <X class="w-6 h-6" />
            </button>
          </div>
          <p class="text-sm text-gray-500 mt-1">
            Bác sĩ: <span class="font-semibold text-gray-700">{{ doctorName }}</span>
          </p>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-4">
          <div class="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
            <AlertCircle class="w-5 h-5 text-amber-600 shrink-0" />
            <p class="text-xs text-amber-700 font-medium">
              Vui lòng cung cấp lý do rõ ràng để bác sĩ có thể nắm bắt và điều chỉnh thông tin nếu cần thiết.
            </p>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">Lý do từ chối <span class="text-red-500">*</span></label>
            <textarea 
              v-model="reason"
              rows="4"
              placeholder="Ví dụ: Hồ sơ thiếu chứng chỉ hành nghề, hình ảnh CMND mờ không rõ nét..."
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm resize-none"
              :class="{ 'border-red-500 bg-red-50/10': error }"
            ></textarea>
            <p v-if="error" class="text-xs text-red-500 font-medium flex items-center gap-1">
              <AlertCircle class="w-3 h-3" />
              {{ error }}
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50/50">
          <button
            type="button"
            @click="handleClose"
            :disabled="loading"
            class="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition disabled:opacity-50 font-medium text-sm"
          >
            Hủy
          </button>
          <button
            type="button"
            @click="handleConfirm"
            :disabled="loading"
            class="px-8 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition disabled:opacity-50 shadow-md hover:shadow-lg active:scale-95 font-medium flex items-center gap-2 text-sm"
          >
            <div v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>{{ loading ? 'Đang xử lý...' : 'Xác nhận từ chối' }}</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
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
  transform: scale(0.95);
}
</style>
