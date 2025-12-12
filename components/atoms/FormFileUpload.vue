<script setup lang="ts">
interface Props {
  modelValue: File | null;
  label: string;
  accept?: string;
  maxSize?: number; // in MB
  preview?: string | null;
  currentFile?: string | null;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  id?: string;
}

interface Emits {
  (e: 'update:modelValue', value: File | null): void;
  (e: 'update:preview', value: string | null): void;
}

const props = withDefaults(defineProps<Props>(), {
  accept: 'image/*',
  maxSize: 5,
  preview: null,
  currentFile: null,
  required: false,
  error: '',
  disabled: false,
});

const emit = defineEmits<Emits>();

// Generate unique ID if not provided
const inputId = computed(() => props.id || `file-upload-${Math.random().toString(36).substr(2, 9)}`);

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    // Validate file type
    if (props.accept === 'image/*' && !file.type.startsWith('image/')) {
      emit('update:modelValue', null);
      emit('update:preview', null);
      return;
    }
    
    // Validate file size
    if (file.size > props.maxSize * 1024 * 1024) {
      emit('update:modelValue', null);
      emit('update:preview', null);
      return;
    }
    
    emit('update:modelValue', file);
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        emit('update:preview', e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }
};

const removeFile = () => {
  emit('update:modelValue', null);
  emit('update:preview', null);
  
  // Reset file input
  const fileInput = document.getElementById(inputId.value) as HTMLInputElement;
  if (fileInput) fileInput.value = '';
};
</script>

<template>
  <div class="form-file-upload-wrapper">
    <label class="block text-sm font-semibold text-gray-700 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <!-- Preview -->
    <div v-if="preview || currentFile" class="mb-4">
      <div class="relative inline-block">
        <img
          :src="preview || currentFile || ''"
          alt="Preview"
          class="h-32 w-32 rounded-lg object-cover border-2 border-gray-200"
        />
        <button
          v-if="preview"
          type="button"
          @click="removeFile"
          :disabled="disabled"
          class="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition disabled:opacity-50"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <p v-if="!preview && currentFile" class="mt-2 text-xs text-gray-500">
        File hiện tại (tải lên file mới để thay đổi)
      </p>
    </div>

    <!-- Upload Button -->
    <div v-if="!preview || !currentFile">
      <label
        :for="inputId"
        class="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
        :class="[
          { 'border-red-500': error },
          { 'cursor-not-allowed opacity-50': disabled },
          preview ? 'h-32' : 'h-40'
        ]"
      >
        <div class="flex flex-col items-center justify-center pt-5 pb-6">
          <svg class="w-10 h-10 mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p class="mb-2 text-sm text-gray-500">
            <span class="font-semibold">Click để tải lên</span> hoặc kéo thả
          </p>
          <p class="text-xs text-gray-500">{{ accept.toUpperCase() }} (MAX. {{ maxSize }}MB)</p>
        </div>
        <input
          :id="inputId"
          type="file"
          :accept="accept"
          :disabled="disabled"
          @change="handleFileChange"
          class="hidden"
        />
      </label>
    </div>
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<style scoped>
.form-file-upload-wrapper {
  width: 100%;
}
</style>
