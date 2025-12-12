<script setup lang="ts">
import SpecialtyList from "@/components/organisms/specialties/SpecialtyList.vue";
import PageOverview from "@/components/molecules/PageOverview.vue";
import AddSpecialtyModal from "@/components/modal/AddSpecialtyModal.vue";
import EditSpecialtyModal from "@/components/modal/EditSpecialtyModal.vue";
import ConfirmActionModal from "@/components/modal/ConfirmActionModal.vue";

definePageMeta({
  layout: "default",
});

useHead({
  title: 'Quản lý chuyên khoa - HelloDoc',
});

const { specialties, loading, error, fetchSpecialties, createSpecialty, updateSpecialty, deleteSpecialty } = useSpecialtyViewModel();
const { notifySuccess, notifyFailed } = useNotification();

// Modal states
const isAddModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isConfirmModalOpen = ref(false);
const selectedSpecialty = ref<Specialty | null>(null);

// Confirmation modal state
const actionNeedToConfirm = ref<string>('');
const confirmModalTitle = ref('');
const confirmModalMessage = ref('');
const confirmModalConfirmText = ref('Xác nhận');
const confirmModalCancelText = ref('Hủy');
const confirmModalButtonClass = ref('bg-blue-600 hover:bg-blue-700');
const confirmModalIcon = ref<'warning' | 'info' | 'success' | 'error'>('info');

// Fetch specialties on component mount
onMounted(async () => {
  await fetchSpecialties();
});

// ===== MODAL HANDLERS =====
const handleAdd = () => {
  isAddModalOpen.value = true;
};

const handleAddModalClose = () => {
  isAddModalOpen.value = false;
};

const handleAddModalSubmit = async (formData: FormData) => {
  try {
    await createSpecialty(formData);
    notifySuccess('Thêm chuyên khoa thành công!');
    isAddModalOpen.value = false;
    await fetchSpecialties();
  } catch (err: any) {
    notifyFailed(err.message || 'Không thể tạo chuyên khoa');
    throw err;
  }
};

const handleEdit = (specialty: Specialty) => {
  selectedSpecialty.value = specialty;
  isEditModalOpen.value = true;
};

const handleEditModalClose = () => {
  isEditModalOpen.value = false;
  selectedSpecialty.value = null;
};

// Store form data for confirmation
const pendingEditFormData = ref<FormData | null>(null);

const handleEditModalSubmit = async (id: string, formData: FormData) => {
  // Store form data and show confirmation
  pendingEditFormData.value = formData;
  handleShowConfirmModal('edit', selectedSpecialty.value!);
};

const handleEditConfirmed = async () => {
  if (!selectedSpecialty.value || !pendingEditFormData.value) return;
  
  try {
    await updateSpecialty(selectedSpecialty.value._id, pendingEditFormData.value);
    notifySuccess('Cập nhật chuyên khoa thành công!');
    isEditModalOpen.value = false;
    pendingEditFormData.value = null;
    await fetchSpecialties();
  } catch (err: any) {
    notifyFailed(err.message || 'Không thể cập nhật chuyên khoa');
  }
};

const handleReload = async () => {
  await fetchSpecialties();
};

// ===== CONFIRMATION HANDLERS =====
const handleShowConfirmModal = (action: string, specialty?: Specialty) => {
  actionNeedToConfirm.value = action;
  selectedSpecialty.value = specialty || null;
  
  switch (action) {
    case 'edit':
      confirmModalTitle.value = 'Xác nhận cập nhật';
      confirmModalMessage.value = `Bạn có chắc chắn muốn cập nhật chuyên khoa <strong>${specialty?.name}</strong>?`;
      confirmModalConfirmText.value = 'Cập nhật';
      confirmModalCancelText.value = 'Hủy';
      confirmModalButtonClass.value = 'bg-blue-600 hover:bg-blue-700';
      confirmModalIcon.value = 'info';
      break;
    
    case 'delete':
      confirmModalTitle.value = 'Xác nhận xóa chuyên khoa';
      confirmModalMessage.value = `Bạn có chắc chắn muốn xóa chuyên khoa <strong>${specialty?.name}</strong>?`;
      confirmModalConfirmText.value = 'Xóa';
      confirmModalCancelText.value = 'Hủy';
      confirmModalButtonClass.value = 'bg-red-600 hover:bg-red-700';
      confirmModalIcon.value = 'warning';
      break;
    
    // Add more cases here for other actions
    default:
      confirmModalTitle.value = 'Xác nhận';
      confirmModalMessage.value = 'Bạn có chắc chắn muốn thực hiện hành động này?';
      confirmModalConfirmText.value = 'Xác nhận';
      confirmModalCancelText.value = 'Hủy';
      confirmModalButtonClass.value = 'bg-blue-600 hover:bg-blue-700';
      confirmModalIcon.value = 'info';
  }
  
  isConfirmModalOpen.value = true;
};

const handleCloseConfirm = () => {
  isConfirmModalOpen.value = false;
  actionNeedToConfirm.value = '';
  selectedSpecialty.value = null;
};

const handleConfirm = async () => {
  switch (actionNeedToConfirm.value) {
    case 'edit':
      await handleEditConfirmed();
      break;
    
    case 'delete':
      await handleDeleteConfirmed();
      break;
    
    // Add more cases here for other actions
    default:
      console.warn('Unknown action:', actionNeedToConfirm.value);
  }
  
  handleCloseConfirm();
};

// ===== ACTION HANDLERS =====
const handleDelete = (specialty: Specialty) => {
  handleShowConfirmModal('delete', specialty);
};

const handleDeleteConfirmed = async () => {
  if (!selectedSpecialty.value) return;
  
  try {
    await deleteSpecialty(selectedSpecialty.value._id);
    notifySuccess('Xóa chuyên khoa thành công!');
    await fetchSpecialties();
  } catch (err: any) {
    notifyFailed(err.message || 'Không thể xóa chuyên khoa');
  }
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
      @reload="handleReload"
      @add="handleAdd"
    />

    <!-- Specialty List -->
    <SpecialtyList 
      :specialties="specialties" 
      :loading="loading"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- Add Specialty Modal -->
    <AddSpecialtyModal
      :is-open="isAddModalOpen"
      @close="handleAddModalClose"
      @submit="handleAddModalSubmit"
    />

    <!-- Edit Specialty Modal -->
    <EditSpecialtyModal
      :is-open="isEditModalOpen"
      :specialty="selectedSpecialty"
      @close="handleEditModalClose"
      @submit="handleEditModalSubmit"
    />

    <!-- Confirm Action Modal -->
    <ConfirmActionModal
      :is-open="isConfirmModalOpen"
      :title="confirmModalTitle"
      :message="confirmModalMessage"
      :confirm-text="confirmModalConfirmText"
      :cancel-text="confirmModalCancelText"
      :confirm-button-class="confirmModalButtonClass"
      :icon="confirmModalIcon"
      @close="handleCloseConfirm"
      @confirm="handleConfirm"
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
