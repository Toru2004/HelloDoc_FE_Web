<script setup lang="ts">
interface Props {
  isOpen: boolean;
  specialty: Specialty | null;
}

interface Emits {
  (e: 'close'): void;
  (e: 'success'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const api = useApi();

// Form state
const formData = ref({
  name: '',
  description: '',
  icon: null as File | null,
});

const iconPreview = ref<string | null>(null);
const currentIcon = ref<string | null>(null);
const loading = ref(false);
const error = ref('');
const errors = ref({
  name: '',
  description: '',
  icon: '',
});

// Watch for specialty changes to populate form
watch(() => props.specialty, (newSpecialty) => {
  if (newSpecialty) {
    formData.value.name = newSpecialty.name;
    formData.value.description = newSpecialty.description || '';
    formData.value.icon = null;
    currentIcon.value = newSpecialty.icon || null;
    iconPreview.value = null;
  }
}, { immediate: true });

// Handle file selection
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      errors.value.icon = 'Vui lòng chọn file ảnh';
      formData.value.icon = null;
      iconPreview.value = null;
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      errors.value.icon = 'Kích thước file không được vượt quá 5MB';
      formData.value.icon = null;
      iconPreview.value = null;
      return;
    }
    
    errors.value.icon = '';
    formData.value.icon = file;
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      iconPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

// Remove selected icon
const removeIcon = () => {
  formData.value.icon = null;
  iconPreview.value = null;
  errors.value.icon = '';
  // Reset file input
  const fileInput = document.getElementById('icon-upload-edit') as HTMLInputElement;
  if (fileInput) fileInput.value = '';
};

// Validate form
const validateForm = (): boolean => {
  let isValid = true;
  errors.value = { name: '', description: '', icon: '' };
  
  if (!formData.value.name.trim()) {
    errors.value.name = 'Vui lòng nhập tên chuyên khoa';
    isValid = false;
  }
  
  if (!formData.value.description.trim()) {
    errors.value.description = 'Vui lòng nhập mô tả';
    isValid = false;
  }
  
  return isValid;
};

// Submit form
const handleSubmit = async () => {
  if (!validateForm() || !props.specialty) return;
  
  loading.value = true;
  error.value = '';
  
  try {
    const data = new FormData();
    data.append('name', formData.value.name);
    data.append('description', formData.value.description);
    
    // Only append icon if a new one was selected
    if (formData.value.icon) {
      data.append('icon', formData.value.icon);
    }
    
    await api.putFormData(`/specialty/${props.specialty._id}`, data);
    
    emit('success');
    emit('close');
  } catch (err: any) {
    error.value = err.message || 'Không thể cập nhật chuyên khoa';
    console.error('Error updating specialty:', err);
  } finally {
    loading.value = false;
  }
};

// Bump animation state
const isBumping = ref(false);

const handleOverlayClick = () => {
  isBumping.value = true;
  setTimeout(() => {
    isBumping.value = false;
  }, 300);
};

// Close modal
const handleClose = () => {
  if (!loading.value) {
    // Reset form
    formData.value = { name: '', description: '', icon: null };
    iconPreview.value = null;
    currentIcon.value = null;
    error.value = '';
    errors.value = { name: '', description: '', icon: '' };
    emit('close');
  }
};

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
  <Transition name="modal">
    <div
      v-if="isOpen && specialty"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      @click.self="handleOverlayClick"
    >
      <div 
        class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-transform duration-300"
        :class="{ 'scale-105': isBumping }"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-2xl font-bold text-gray-900">Chỉnh sửa chuyên khoa</h2>
          <button
            @click="handleClose"
            :disabled="loading"
            class="text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
          <!-- Error Alert -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex items-center gap-3">
              <svg class="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-red-800 text-sm font-medium">{{ error }}</p>
            </div>
          </div>

          <!-- Name Field -->
          <div>
            <label for="name-edit" class="block text-sm font-semibold text-gray-700 mb-2">
              Tên chuyên khoa <span class="text-red-500">*</span>
            </label>
            <input
              id="name-edit"
              v-model="formData.name"
              type="text"
              :disabled="loading"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              :class="{ 'border-red-500': errors.name }"
              placeholder="Ví dụ: Nội khoa"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
          </div>

          <!-- Description Field -->
          <div>
            <label for="description-edit" class="block text-sm font-semibold text-gray-700 mb-2">
              Mô tả <span class="text-red-500">*</span>
            </label>
            <textarea
              id="description-edit"
              v-model="formData.description"
              rows="4"
              :disabled="loading"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
              :class="{ 'border-red-500': errors.description }"
              placeholder="Nhập mô tả về chuyên khoa..."
            ></textarea>
            <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
          </div>

          <!-- Icon Upload -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Icon chuyên khoa
            </label>
            
            <!-- Current or New Preview -->
            <div v-if="iconPreview || currentIcon" class="mb-4">
              <div class="relative inline-block">
                <img
                  :src="iconPreview || currentIcon || ''"
                  alt="Preview"
                  class="h-32 w-32 rounded-lg object-cover border-2 border-gray-200"
                />
                <button
                  v-if="iconPreview"
                  type="button"
                  @click="removeIcon"
                  :disabled="loading"
                  class="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition disabled:opacity-50"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p v-if="!iconPreview" class="mt-2 text-xs text-gray-500">Icon hiện tại (tải lên ảnh mới để thay đổi)</p>
            </div>

            <!-- Upload Button -->
            <div>
              <label
                for="icon-upload-edit"
                class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
                :class="{ 'border-red-500': errors.icon, 'cursor-not-allowed opacity-50': loading }"
              >
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg class="w-8 h-8 mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p class="text-sm text-gray-500">
                    <span class="font-semibold">Tải lên icon mới</span>
                  </p>
                  <p class="text-xs text-gray-500">PNG, JPG, GIF (MAX. 5MB)</p>
                </div>
                <input
                  id="icon-upload-edit"
                  type="file"
                  accept="image/*"
                  :disabled="loading"
                  @change="handleFileChange"
                  class="hidden"
                />
              </label>
            </div>
            <p v-if="errors.icon" class="mt-1 text-sm text-red-600">{{ errors.icon }}</p>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              @click="handleClose"
              :disabled="loading"
              class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
            >
              <svg v-if="loading" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ loading ? 'Đang cập nhật...' : 'Cập nhật' }}</span>
            </button>
          </div>
        </form>
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
  transform: scale(0.9);
}

.scale-105 {
  transform: scale(1.05) !important;
}
</style>
