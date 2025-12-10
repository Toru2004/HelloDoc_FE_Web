<script setup lang="ts">
import SpecialtyList from "@/components/organisms/specialties/SpecialtyList.vue";
import PageOverview from "@/components/molecules/PageOverview.vue";
import AddSpecialtyModal from "@/components/modal/AddSpecialtyModal.vue";
import EditSpecialtyModal from "@/components/modal/EditSpecialtyModal.vue";

definePageMeta({
  layout: "default",
});

useHead({
  title: 'Quản lý chuyên khoa - HelloDoc',
});

const api = useApi();
const specialties = ref<Specialty[]>([]);
const loading = ref(false);
const error = ref('');
const isModalOpen = ref(false);
const isEditModalOpen = ref(false);
const selectedSpecialty = ref<Specialty | null>(null);
const successMessage = ref('');

// Fetch specialties on component mount
onMounted(async () => {
  await fetchSpecialties();
});

const fetchSpecialties = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const response = await api.get<Specialty[]>('/specialty/get-all');
    specialties.value = response;
    console.log('Fetched specialties:', response.length);
  } catch (err: any) {
    error.value = err.message || 'Không thể tải danh sách chuyên khoa';
    console.error('Error fetching specialties:', err);
  } finally {
    loading.value = false;
  }
};

const handleAdd = () => {
  isModalOpen.value = true;
};

const handleModalClose = () => {
  isModalOpen.value = false;
};

const handleModalSuccess = async () => {
  successMessage.value = 'Chuyên khoa đã được tạo thành công!';
  await fetchSpecialties();
  
  // Clear success message after 5 seconds
  setTimeout(() => {
    successMessage.value = '';
  }, 5000);
};

const handleEdit = (specialty: Specialty) => {
  selectedSpecialty.value = specialty;
  isEditModalOpen.value = true;
};

const handleEditModalClose = () => {
  isEditModalOpen.value = false;
  selectedSpecialty.value = null;
};

const handleEditModalSuccess = async () => {
  successMessage.value = 'Chuyên khoa đã được cập nhật thành công!';
  await fetchSpecialties();
  
  // Clear success message after 5 seconds
  setTimeout(() => {
    successMessage.value = '';
  }, 5000);
};
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Page Overview -->
    <PageOverview
      title="Quản lý chuyên khoa"
      description="Danh sách các chuyên khoa trong hệ thống HelloDoc"
      add-label="Thêm chuyên khoa"
      :loading="loading"
      @reload="fetchSpecialties"
      @add="handleAdd"
    />

    <!-- Success Message -->
    <Transition name="fade">
      <div v-if="successMessage" class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div class="flex items-center gap-3">
          <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 class="font-semibold text-green-800">Thành công</h3>
            <p class="text-green-600">{{ successMessage }}</p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Error State -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div class="flex items-center gap-3">
        <svg class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 class="font-semibold text-red-800">Lỗi tải dữ liệu</h3>
          <p class="text-red-600">{{ error }}</p>
        </div>
      </div>
      <button
        @click="fetchSpecialties"
        class="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
      >
        Thử lại
      </button>
    </div>

    <!-- Specialty List -->
    <SpecialtyList 
      :specialties="specialties" 
      :loading="loading"
      @edit="handleEdit"
    />

    <!-- Add Specialty Modal -->
    <AddSpecialtyModal
      :is-open="isModalOpen"
      @close="handleModalClose"
      @success="handleModalSuccess"
    />

    <!-- Edit Specialty Modal -->
    <EditSpecialtyModal
      :is-open="isEditModalOpen"
      :specialty="selectedSpecialty"
      @close="handleEditModalClose"
      @success="handleEditModalSuccess"
    />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
