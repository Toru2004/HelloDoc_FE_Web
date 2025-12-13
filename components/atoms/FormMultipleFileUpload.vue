<script setup lang="ts">
interface Props {
  modelValue: File[];
  label: string;
  accept?: string;
  maxSize?: number; // in MB per file
  currentFiles?: string[];
  required?: boolean;
  error?: string;
  disabled?: boolean;
  id?: string;
}

interface Emits {
  (e: 'update:modelValue', value: File[]): void;
}

const props = withDefaults(defineProps<Props>(), {
  accept: 'image/*',
  maxSize: 5,
  currentFiles: () => [],
  required: false,
  error: '',
  disabled: false,
});

const emit = defineEmits<Emits>();

// Generate unique ID if not provided
const inputId = computed(() => props.id || `multi-file-upload-${Math.random().toString(36).substr(2, 9)}`);

// Preview URLs for new files
const previewUrls = ref<string[]>([]);

// Watch modelValue to create previews
watch(() => props.modelValue, (newFiles) => {
  // Cleanup old preview URLs
  previewUrls.value.forEach(url => {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  });
  
  // Create new preview URLs
  previewUrls.value = newFiles.map(file => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return '';
  }).filter(url => url !== '');
}, { immediate: true });

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files ? Array.from(target.files) : [];
  
  if (files.length > 0) {
    // Validate files
    const validFiles = files.filter(file => {
      // Validate file type
      if (props.accept === 'image/*' && !file.type.startsWith('image/')) {
        return false;
      }
      
      // Validate file size
      if (file.size > props.maxSize * 1024 * 1024) {
        return false;
      }
      
      return true;
    });
    
    emit('update:modelValue', validFiles);
  }
};

const removeFile = (index: number) => {
  const newFiles = [...props.modelValue];
  newFiles.splice(index, 1);
  emit('update:modelValue', newFiles);
  
  // Reset file input if no files left
  if (newFiles.length === 0) {
    const fileInput = document.getElementById(inputId.value) as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }
};

// Cleanup on unmount
onUnmounted(() => {
  previewUrls.value.forEach(url => {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  });
});
</script>

<template>
  <div class="form-file-upload-wrapper">
    <label class="block text-sm font-semibold text-gray-700 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <!-- Current Files Preview -->
    <div v-if="currentFiles.length > 0 && modelValue.length === 0" class="mb-4">
      <p class="text-xs text-gray-500 mb-2">File hiện tại:</p>
      <div class="grid grid-cols-3 gap-4">
        <div
          v-for="(url, index) in currentFiles"
          :key="'current-' + index"
          class="relative"
        >
          <img
            :src="url"
            alt="Current file"
            class="h-32 w-full rounded-lg object-cover border-2 border-gray-200"
          />
        </div>
      </div>
      <p class="mt-2 text-xs text-gray-500">
        Tải lên file mới để thay đổi
      </p>
    </div>

    <!-- New Files Preview -->
    <div v-if="previewUrls.length > 0" class="mb-4">
      <p class="text-xs text-gray-500 mb-2">File mới:</p>
      <div class="grid grid-cols-3 gap-4">
        <div
          v-for="(url, index) in previewUrls"
          :key="'new-' + index"
          class="relative group"
        >
          <img
            :src="url"
            alt="Preview"
            class="h-32 w-full rounded-lg object-cover border-2 border-gray-200"
          />
          <button
            type="button"
            @click="removeFile(index)"
            :disabled="disabled"
            class="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition disabled:opacity-50"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Upload Button -->
    <label
      :for="inputId"
      class="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
      :class="[
        { 'border-red-500': error },
        { 'cursor-not-allowed opacity-50': disabled }
      ]"
    >
      <div class="flex flex-col items-center justify-center pt-5 pb-6">
        <svg class="w-10 h-10 mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p class="mb-2 text-sm text-gray-500">
          <span class="font-semibold">Click để tải lên</span> hoặc kéo thả
        </p>
        <p class="text-xs text-gray-500">{{ accept.toUpperCase() }} (MAX. {{ maxSize }}MB mỗi file)</p>
      </div>
      <input
        :id="inputId"
        type="file"
        :accept="accept"
        multiple
        :disabled="disabled"
        @change="handleFileChange"
        class="hidden"
      />
    </label>
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<style scoped>
.form-file-upload-wrapper {
  width: 100%;
}
</style>
