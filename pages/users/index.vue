<script setup lang="ts">
import UserList from "@/components/organisms/users/UserList.vue";
import PageOverview from "@/components/molecules/PageOverview.vue";

definePageMeta({
  layout: "default",
});

useHead({
  title: 'Quản lý người dùng - HelloDoc',
});

const api = useApi();
const users = ref<User[]>([]);
const loading = ref(false);
const error = ref('');

// Computed property to filter only users with role 'User'
const filteredUsers = computed(() => {
  return users.value.filter(user => user.role.toLowerCase() === 'user');
});

// Fetch users on component mount
onMounted(async () => {
  await fetchUsers();
});

const fetchUsers = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const response = await api.get<User[]>('/user');
    users.value = response;
    console.log('Fetched all users:', response.length);
    console.log('Filtered users (role=User):', filteredUsers.value.length);
  } catch (err: any) {
    error.value = err.message || 'Không thể tải danh sách người dùng';
    console.error('Error fetching users:', err);
  } finally {
    loading.value = false;
  }
};

const handleAdd = () => {
  // TODO: Implement add user functionality
  console.log('Add user clicked');
};

</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Page Overview -->
    <PageOverview
      title="Quản lý người dùng"
      description="Danh sách người dùng trong hệ thống HelloDoc"
      :loading="loading"
      @reload="fetchUsers"
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
  </div>
</template>
