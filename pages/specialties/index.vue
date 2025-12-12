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

const { specialties, loading, error, fetchSpecialties, deleteSpecialty } = useSpecialtyViewModel();
const { notifySuccess, notifyFailed } = useNotification();
const confirm = useConfirm();

const isAddModalOpen = ref(false);
const isEditModalOpen = ref(false);
const selectedSpecialty = ref<Specialty | null>(null);

// Fetch specialties on component mount
onMounted(async () => {
  await fetchSpecialties();
});

const handleAdd = () => {
  isAddModalOpen.value = true;
};

const handleModalClose = () => {
  isAddModalOpen.value = false;
};

const handleModalSuccess = async () => {
  await fetchSpecialties();
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
  await fetchSpecialties();
};

const handleDelete = (specialty: Specialty) => {
  selectedSpecialty.value = specialty;
  
  // Use confirm composable
  confirm.confirm({
    title: 'Xác nhận xóa chuyên khoa',
    message: `Bạn có chắc chắn muốn xóa chuyên khoa <strong>${specialty.name}</strong>?`,
    confirmText: 'Xóa',
    cancelText: 'Hủy',
    confirmButtonClass: 'bg-red-600 hover:bg-red-700',
    icon: 'warning',
    onConfirm: async () => {
      try {
        await deleteSpecialty(specialty._id);
        notifySuccess('Xóa chuyên khoa thành công!');
        await fetchSpecialties();
      } catch (err: any) {
        notifyFailed(err.message || 'Không thể xóa chuyên khoa');
      } finally {
        selectedSpecialty.value = null;
      }
    },
    onCancel: () => {
      selectedSpecialty.value = null;
    },
  });
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

    <!-- Confirm Action Modal -->
    <ConfirmActionModal
      :is-open="confirm.isOpen.value"
      :title="confirm.title.value"
      :message="confirm.message.value"
      :confirm-text="confirm.confirmText.value"
      :cancel-text="confirm.cancelText.value"
      :confirm-button-class="confirm.confirmButtonClass.value"
      :icon="confirm.icon.value"
      @close="confirm.handleCancel"
      @confirm="confirm.handleConfirm"
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
