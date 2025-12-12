<script setup lang="ts">
import SidePanelModal from '@/components/molecules/SidePanelModal.vue';
import FormInput from '@/components/atoms/FormInput.vue';
import FormTextarea from '@/components/atoms/FormTextarea.vue';
import FormFileUpload from '@/components/atoms/FormFileUpload.vue';

interface Props {
  isOpen: boolean;
  specialty: Specialty | null;
}

interface Emits {
  (e: 'close'): void;
  (e: 'submit', id: string, formData: FormData): Promise<void>;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

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

// Original values for change detection
const originalValues = ref({
  name: '',
  description: '',
});

// Watch for specialty changes to populate form
watch(() => props.specialty, (newSpecialty) => {
  if (newSpecialty) {
    formData.value.name = newSpecialty.name;
    formData.value.description = newSpecialty.description || '';
    formData.value.icon = null;
    currentIcon.value = newSpecialty.icon || null;
    iconPreview.value = null;
    
    // Store original values
    originalValues.value = {
      name: newSpecialty.name,
      description: newSpecialty.description || '',
    };
  }
}, { immediate: true });

// Check if form is valid
const isFormValid = computed(() => {
  return formData.value.name.trim() !== '' &&
         formData.value.description.trim() !== '';
});

// Check if form has changes
const hasChanges = computed(() => {
  const nameChanged = formData.value.name !== originalValues.value.name;
  const descriptionChanged = formData.value.description !== originalValues.value.description;
  const iconChanged = formData.value.icon !== null;
  
  return nameChanged || descriptionChanged || iconChanged;
});

// Disable submit if form is invalid or no changes
const isSubmitDisabled = computed(() => {
  return !isFormValid.value || !hasChanges.value;
});

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
    if (formData.value.icon) {
      data.append('icon', formData.value.icon);
    }
    
    // Emit submit event for parent to handle
    await emit('submit', props.specialty._id, data);
  } catch (err: any) {
    error.value = err.message || 'Không thể cập nhật chuyên khoa';
  } finally {
    loading.value = false;
  }
};

// Handle close
const handleClose = () => {
  if (!loading.value) {
    // Reset form state
    iconPreview.value = null;
    errors.value = { name: '', description: '', icon: '' };
    error.value = '';
    emit('close');
  }
};
</script>

<template>
  <SidePanelModal
    :is-open="isOpen && !!specialty"
    title="Chỉnh sửa chuyên khoa"
    :loading="loading"
    :submit-disabled="isSubmitDisabled"
    submit-text="Cập nhật"
    form-id="edit-specialty-form"
    @close="handleClose"
    @submit="handleSubmit"
  >
    <form id="edit-specialty-form" @submit.prevent="handleSubmit" class="space-y-6">
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
        v-model="formData.name"
        label="Tên chuyên khoa"
        placeholder="Ví dụ: Nội khoa"
        :required="true"
        :error="errors.name"
        :disabled="loading"
      />

      <FormTextarea
        v-model="formData.description"
        label="Mô tả"
        placeholder="Nhập mô tả về chuyên khoa..."
        :rows="4"
        :required="true"
        :error="errors.description"
        :disabled="loading"
      />

      <FormFileUpload
        v-model="formData.icon"
        v-model:preview="iconPreview"
        :current-file="currentIcon"
        label="Icon chuyên khoa"
        accept="image/*"
        :max-size="5"
        :required="false"
        :error="errors.icon"
        :disabled="loading"
      />
    </form>
  </SidePanelModal>
</template>
