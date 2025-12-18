<script setup lang="ts">
interface Option {
  value: string;
  label: string;
}

interface Props {
  modelValue: string;
  label: string;
  options: Option[];
  required?: boolean;
  error?: string;
  disabled?: boolean;
  id?: string;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  error: '',
  disabled: false,
});

const emit = defineEmits<Emits>();

// Generate unique ID if not provided
const selectId = computed(() => props.id || `select-${Math.random().toString(36).substr(2, 9)}`);

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
};
</script>

<template>
  <div class="form-select-wrapper">
    <label 
      :for="selectId" 
      class="block text-sm font-semibold text-gray-700 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <select
        :id="selectId"
        :value="modelValue"
        :disabled="disabled"
        :class="{ 'border-red-500': error }"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white"
        @change="handleChange"
      >
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<style scoped>
.form-select-wrapper {
  width: 100%;
}
</style>
