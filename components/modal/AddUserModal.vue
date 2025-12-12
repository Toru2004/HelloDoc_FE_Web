<script setup lang="ts">
import SidePanelModal from '@/components/molecules/SidePanelModal.vue';
import FormInput from '@/components/atoms/FormInput.vue';
import type { CreateUserDto } from '@/domain/entities/user';

interface Props {
  isOpen: boolean;
}

interface Emits {
  (e: 'close'): void;
  (e: 'submit', userData: CreateUserDto): Promise<void>;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Form state
const formData = ref<CreateUserDto>({
  name: '',
  email: '',
  phone: '',
  password: '',
});

const loading = ref(false);
const error = ref('');
const errors = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
});

// Validate form
const validateForm = (): boolean => {
  let isValid = true;
  errors.value = { name: '', email: '', phone: '', password: '' };
  
  if (!formData.value.name.trim()) {
    errors.value.name = 'Vui lòng nhập tên người dùng';
    isValid = false;
  }
  
  if (!formData.value.email.trim()) {
    errors.value.email = 'Vui lòng nhập email';
    isValid = false;
  } else {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.value.email)) {
      errors.value.email = 'Email không hợp lệ';
      isValid = false;
    }
  }
  
  if (!formData.value.phone.trim()) {
    errors.value.phone = 'Vui lòng nhập số điện thoại';
    isValid = false;
  } else {
    // Phone validation (Vietnamese phone number)
    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
    if (!phoneRegex.test(formData.value.phone)) {
      errors.value.phone = 'Số điện thoại không hợp lệ';
      isValid = false;
    }
  }
  
  if (!formData.value.password.trim()) {
    errors.value.password = 'Vui lòng nhập mật khẩu';
    isValid = false;
  } else if (formData.value.password.length < 6) {
    errors.value.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    isValid = false;
  }
  
  return isValid;
};

// Check if form is valid (for disabling submit button)
const isFormValid = computed(() => {
  return formData.value.name.trim() !== '' &&
         formData.value.email.trim() !== '' &&
         formData.value.phone.trim() !== '' &&
         formData.value.password.trim() !== '';
});

// Submit form
const handleSubmit = async () => {
  if (!validateForm()) return;
  
  loading.value = true;
  error.value = '';
  
  try {
    // Emit submit event for parent to handle
    await emit('submit', { ...formData.value });
    
    // Reset form on success
    formData.value = {
      name: '',
      email: '',
      phone: '',
      password: '',
    };
    errors.value = { name: '', email: '', phone: '', password: '' };
  } catch (err: any) {
    error.value = err.message || 'Không thể tạo người dùng';
  } finally {
    loading.value = false;
  }
};

// Handle close
const handleClose = () => {
  if (!loading.value) {
    // Reset form on close
    formData.value = {
      name: '',
      email: '',
      phone: '',
      password: '',
    };
    errors.value = { name: '', email: '', phone: '', password: '' };
    error.value = '';
    emit('close');
  }
};
</script>

<template>
  <SidePanelModal
    :is-open="isOpen"
    title="Thêm người dùng mới"
    :loading="loading"
    :submit-disabled="!isFormValid"
    submit-text="Tạo người dùng"
    form-id="add-user-form"
    @close="handleClose"
    @submit="handleSubmit"
  >
    <form id="add-user-form" @submit.prevent="handleSubmit" class="space-y-6">
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
        label="Tên người dùng"
        placeholder="Ví dụ: Nguyễn Văn A"
        :required="true"
        :error="errors.name"
        :disabled="loading"
      />

      <FormInput
        v-model="formData.email"
        label="Email"
        type="email"
        placeholder="example@gmail.com"
        :required="true"
        :error="errors.email"
        :disabled="loading"
      />

      <FormInput
        v-model="formData.phone"
        label="Số điện thoại"
        type="tel"
        placeholder="0783203982"
        :required="true"
        :error="errors.phone"
        :disabled="loading"
      />

      <FormInput
        v-model="formData.password"
        label="Mật khẩu"
        type="password"
        placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
        :required="true"
        :error="errors.password"
        :disabled="loading"
      />
    </form>
  </SidePanelModal>
</template>
