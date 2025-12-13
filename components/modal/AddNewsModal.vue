<script setup lang="ts">
import SidePanelModal from '@/components/molecules/SidePanelModal.vue';
import FormInput from '@/components/atoms/FormInput.vue';
import FormTextarea from '@/components/atoms/FormTextarea.vue';
import FormMultipleFileUpload from '@/components/atoms/FormMultipleFileUpload.vue';
import type { CreateNewsDto } from '@/domain/entities/news';

interface Props {
  isOpen: boolean;
}

interface Emits {
  (e: 'close'): void;
  (e: 'submit', newsData: CreateNewsDto): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Form state
const formData = ref({
  title: '',
  content: '',
  images: [] as File[],
});

const loading = ref(false);
const error = ref('');
const errors = ref({
  title: '',
  content: '',
  images: '',
});

// Check if form is valid
const isFormValid = computed(() => {
  return formData.value.title.trim() !== '' &&
         formData.value.content.trim() !== '' &&
         formData.value.images.length > 0;
});

// Disable submit if form is invalid
const isSubmitDisabled = computed(() => {
  return !isFormValid.value;
});

// Validate form
const validateForm = (): boolean => {
  let isValid = true;
  errors.value = { title: '', content: '', images: '' };
  
  if (!formData.value.title.trim()) {
    errors.value.title = 'Vui lòng nhập tiêu đề';
    isValid = false;
  }
  
  if (!formData.value.content.trim()) {
    errors.value.content = 'Vui lòng nhập nội dung';
    isValid = false;
  }
  
  if (formData.value.images.length === 0) {
    errors.value.images = 'Vui lòng chọn ít nhất một hình ảnh';
    isValid = false;
  }
  
  return isValid;
};

// Submit form
const handleSubmit = async () => {
  if (!validateForm()) return;
  
  loading.value = true;
  error.value = '';
  
  try {
    const auth = useAuth();
    // const adminId = auth.user.value?._id;
    const adminId = auth.getUserInfo()?.userId;
    
    if (!adminId) {
      throw new Error('Không tìm thấy thông tin admin');
    }
    
    const newsData: CreateNewsDto = {
      adminId,
      title: formData.value.title,
      content: formData.value.content,
      images: formData.value.images,
    };
    
    emit('submit', newsData);
  } catch (err: any) {
    error.value = err.message || 'Không thể tạo tin tức';
  } finally {
    loading.value = false;
  }
};

// Handle close
const handleClose = () => {
  if (!loading.value) {
    // Reset form
    formData.value = {
      title: '',
      content: '',
      images: [],
    };
    errors.value = { title: '', content: '', images: '' };
    error.value = '';
    emit('close');
  }
};
</script>

<template>
  <SidePanelModal
    :is-open="isOpen"
    title="Tạo tin tức mới"
    :loading="loading"
    :submit-disabled="isSubmitDisabled"
    submit-text="Tạo tin tức"
    form-id="add-news-form"
    @close="handleClose"
    @submit="handleSubmit"
  >
    <form id="add-news-form" @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Error Alert -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-red-800 text-sm font-medium">{{ error }}</p>
        </div>
      </div>

      <!-- Form Fields using Reusable Components -->
      <FormInput
        v-model="formData.title"
        label="Tiêu đề"
        placeholder="Nhập tiêu đề tin tức"
        :required="true"
        :error="errors.title"
        :disabled="loading"
      />

      <FormTextarea
        v-model="formData.content"
        label="Nội dung"
        placeholder="Nhập nội dung tin tức..."
        :rows="6"
        :required="true"
        :error="errors.content"
        :disabled="loading"
      />

      <FormMultipleFileUpload
        v-model="formData.images"
        label="Hình ảnh"
        accept="image/*"
        :max-size="5"
        :required="true"
        :error="errors.images"
        :disabled="loading"
      />
    </form>
  </SidePanelModal>
</template>
