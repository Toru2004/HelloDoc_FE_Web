<script setup lang="ts">
import UserList from "@/components/organisms/users/UserList.vue";
import PageOverview from "@/components/molecules/PageOverview.vue";
import AddUserModal from "@/components/modal/AddUserModal.vue";
import type { CreateUserDto } from "@/domain/entities/user";

definePageMeta({
  layout: "default",
});

useHead({
  title: 'Quản lý người dùng - HelloDoc',
});

const { users, filteredUsers, loading, error, fetchUsers, createUser } = useUserViewModel();
const { notifySuccess, notifyFailed } = useNotification();

// Modal state
const isAddModalOpen = ref(false);

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

const handleReload = async () => {
  await fetchUsers();
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
    <UserList :users="filteredUsers" :loading="loading" />

    <!-- Add User Modal -->
    <AddUserModal
      :is-open="isAddModalOpen"
      @close="handleAddModalClose"
      @submit="handleAddModalSubmit"
    />
  </div>
</template>
