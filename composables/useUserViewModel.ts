import { NuxtHttpClient } from '@/data/datasources/nuxt_http_client';
import { UserRepositoryImpl } from '@/data/repositories/user_repository_impl';
import type { User } from '@/domain/entities/user';

export const useUserViewModel = () => {
  const client = new NuxtHttpClient();
  const repository = new UserRepositoryImpl(client);

  const users = ref<User[]>([]);
  const loading = ref(false);
  const error = ref('');

  const filteredUsers = computed(() => {
    return users.value.filter(user => user.role.toLowerCase() === 'user');
  });

  const fetchUsers = async () => {
    loading.value = true;
    error.value = '';
    try {
      const response = await repository.getAll();
      users.value = response;
      console.log('Fetched all users:', response.length);
    } catch (err: any) {
      error.value = err.message || 'Không thể tải danh sách người dùng';
      console.error('Error fetching users:', err);
    } finally {
      loading.value = false;
    }
  };

  return {
    users,
    filteredUsers,
    loading,
    error,
    fetchUsers,
  };
};
