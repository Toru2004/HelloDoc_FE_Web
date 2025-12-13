<script setup lang="ts">
import SidePanelModal from '@/components/molecules/SidePanelModal.vue';
import FormInput from '@/components/atoms/FormInput.vue';
import FormTextarea from '@/components/atoms/FormTextarea.vue';
import FormMultipleFileUpload from '@/components/atoms/FormMultipleFileUpload.vue';
import type { News, UpdateNewsDto } from '@/domain/entities/news';

interface Props {
  isOpen: boolean;
  news: News | null;
}

interface Emits {
  (e: 'close'): void;
  (e: 'submit', newsData: UpdateNewsDto): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Form state
const formData = ref({
  title: '',
  content: '',
  images: [] as File[],
});

const currentImages = ref<string[]>([]);
const loading = ref(false);
const error = ref('');
const errors = ref({
  title: '',
  content: '',
  images: '',
});

// Original values for change detection
const originalValues = ref({
  title: '',
  content: '',
});

// Watch for news changes to populate form
watch(() => props.news, (newNews) => {
  if (newNews) {
    formData.value.title = newNews.title;
    formData.value.content = newNews.content;
    formData.value.images = [];
    currentImages.value = [...newNews.media];
    
    // Store original values
    originalValues.value = {
      title: newNews.title,
      content: newNews.content,
    };
  }
}, { immediate: true });

// Check if form is valid
const isFormValid = computed(() => {
  return formData.value.title.trim() !== '' &&
         formData.value.content.trim() !== '';
});

// Check if form has changes
const hasChanges = computed(() => {
  const titleChanged = formData.value.title !== originalValues.value.title;
  const contentChanged = formData.value.content !== originalValues.value.content;
  const imagesChanged = formData.value.images.length > 0;
  
  return titleChanged || contentChanged || imagesChanged;
});

// Disable submit if form is invalid or no changes
const isSubmitDisabled = computed(() => {
  return !isFormValid.value || !hasChanges.value;
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
  
  return isValid;
};

// Submit form
const handleSubmit = async () => {
  if (!validateForm() || !props.news) return;
  
  loading.value = true;
  error.value = '';
  
  try {
    const newsData: UpdateNewsDto = {
      title: formData.value.title,
      content: formData.value.content,
    };
    
    if (formData.value.images.length > 0) {
      newsData.images = formData.value.images;
    }
    
    emit('submit', newsData);
  } catch (err: any) {
    error.value = err.message || 'Không thể cập nhật tin tức';
  } finally {
    loading.value = false;
  }
};

// Handle close
const handleClose = () => {
  if (!loading.value) {
    errors.value = { title: '', content: '', images: '' };
    error.value = '';
    emit('close');
  }
};
</script>

<template>
  <SidePanelModal
    :is-open="isOpen && !!news"
    title="Chỉnh sửa tin tức"
    :loading="loading"
    :submit-disabled="isSubmitDisabled"
    submit-text="Cập nhật"
    form-id="edit-news-form"
    @close="handleClose"
    @submit="handleSubmit"
  >
    <form id="edit-news-form" @submit.prevent="handleSubmit" class="space-y-6">
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
        :current-files="currentImages"
        label="Hình ảnh"
        accept="image/*"
        :max-size="5"
        :required="false"
        :error="errors.images"
        :disabled="loading"
      />
    </form>
  </SidePanelModal>
</template>
