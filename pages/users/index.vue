<script setup lang="ts">
import UserList from "@/components/organisms/users/UserList.vue";
import PageOverview from "@/components/molecules/PageOverview.vue";
import AddUserModal from "@/components/modal/AddUserModal.vue";
import EditUserModal from "@/components/modal/EditUserModal.vue";
import ConfirmActionModal from "@/components/modal/ConfirmActionModal.vue";
import type { CreateUserDto, UpdateUserDto, User } from "@/domain/entities/user";

definePageMeta({
  layout: "default",
});

useHead({
  title: 'Quản lý người dùng - HelloDoc',
});

const { users, filteredUsers, loading, error, fetchUsers, createUser, updateUser } = useUserViewModel();
const { notifySuccess, notifyFailed } = useNotification();

// Modal states
const isAddModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isConfirmModalOpen = ref(false);
const selectedUser = ref<User | null>(null);

// Confirmation modal state
const actionNeedToConfirm = ref<string>('');
const confirmModalTitle = ref('');
const confirmModalMessage = ref('');
const confirmModalConfirmText = ref('Xác nhận');
const confirmModalCancelText = ref('Hủy');
const confirmModalButtonClass = ref('bg-blue-600 hover:bg-blue-700');
const confirmModalIcon = ref<'warning' | 'info' | 'success' | 'error'>('info');

// Fetch users on component mount
onMounted(async () => {
  await fetchUsers();
});

// ===== MODAL HANDLERS =====
const handleAdd = () => {
  isAddModalOpen.value = true;
};

const handleAddModalClose = () => {
  isAddModalOpen.value = false;
};

const handleAddModalSubmit = async (userData: CreateUserDto) => {
  try {
    await createUser(userData);
    notifySuccess('Thêm người dùng thành công!');
    isAddModalOpen.value = false;
    await fetchUsers();
  } catch (err: any) {
    notifyFailed(err.message || 'Không thể tạo người dùng');
    throw err;
  }
};

const handleEdit = (user: User) => {
  selectedUser.value = user;
  isEditModalOpen.value = true;
};

const handleEditModalClose = () => {
  isEditModalOpen.value = false;
  selectedUser.value = null;
};

// Store form data for confirmation
const pendingEditFormData = ref<UpdateUserDto | null>(null);

const handleEditModalSubmit = async (id: string, userData: UpdateUserDto) => {
  // Store form data and show confirmation
  pendingEditFormData.value = userData;
  handleShowConfirmModal('edit', selectedUser.value!);
};

const handleEditConfirmed = async () => {
  if (!selectedUser.value || !pendingEditFormData.value) return;
  
  try {
    await updateUser(selectedUser.value._id, pendingEditFormData.value);
    notifySuccess('Cập nhật người dùng thành công!');
    isEditModalOpen.value = false;
    pendingEditFormData.value = null;
    await fetchUsers();
  } catch (err: any) {
    notifyFailed(err.message || 'Không thể cập nhật người dùng');
  }
};

const handleReload = async () => {
  await fetchUsers();
};

// ===== CONFIRMATION HANDLERS =====
const handleShowConfirmModal = (action: string, user?: User) => {
  actionNeedToConfirm.value = action;
  selectedUser.value = user || null;
  
  switch (action) {
    case 'edit':
      confirmModalTitle.value = 'Xác nhận cập nhật';
      confirmModalMessage.value = `Bạn có chắc chắn muốn cập nhật thông tin người dùng <strong>${user?.name}</strong>?`;
      confirmModalConfirmText.value = 'Cập nhật';
      confirmModalCancelText.value = 'Hủy';
      confirmModalButtonClass.value = 'bg-blue-600 hover:bg-blue-700';
      confirmModalIcon.value = 'info';
      break;
    
    // Add more cases here for other actions (e.g., delete)
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
  selectedUser.value = null;
};

const handleConfirm = async () => {
  switch (actionNeedToConfirm.value) {
    case 'edit':
      await handleEditConfirmed();
      break;
    
    // Add more cases here for other actions
    default:
      console.warn('Unknown action:', actionNeedToConfirm.value);
  }
  
  handleCloseConfirm();
};

</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Page Overview -->
    <PageOverview
      title="Quản lý người dùng"
      description="Danh sách người dùng trong hệ thống HelloDoc"
      add-label="Thêm người dùng"
      :loading="loading"
      @reload="handleReload"
      @add="handleAdd"
    />

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
        @click="fetchUsers"
        class="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
      >
        Thử lại
      </button>
    </div>

    <!-- User List Table -->
    <UserList 
      :users="filteredUsers" 
      :loading="loading"
      @edit="handleEdit"
    />

    <!-- Add User Modal -->
    <AddUserModal
      :is-open="isAddModalOpen"
      @close="handleAddModalClose"
      @submit="handleAddModalSubmit"
    />

    <!-- Edit User Modal -->
    <EditUserModal
      :is-open="isEditModalOpen"
      :user="selectedUser"
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
