import { NuxtHttpClient } from '@/data/datasources/nuxt_http_client';
import { UserRepositoryImpl } from '@/data/repositories/user_repository_impl';
import type { User, CreateUserDto, UpdateUserDto } from '@/domain/entities/user';

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

  const createUser = async (userData: CreateUserDto) => {
    loading.value = true;
    error.value = '';
    try {
      const newUser = await repository.create(userData);
      console.log('Created user:', newUser);
      return newUser;
    } catch (err: any) {
      error.value = err.message || 'Không thể tạo người dùng';
      console.error('Error creating user:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateUser = async (id: string, userData: UpdateUserDto) => {
    loading.value = true;
    error.value = '';
    try {
      const updatedUser = await repository.update(id, userData);
      console.log('Updated user:', updatedUser);
      return updatedUser;
    } catch (err: any) {
      error.value = err.message || 'Không thể cập nhật người dùng';
      console.error('Error updating user:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteUser = async (id: string) => {
    loading.value = true;
    error.value = '';
    try {
      await repository.delete(id);
      console.log('Deleted user:', id);
    } catch (err: any) {
      error.value = err.message || 'Không thể khóa người dùng';
      console.error('Error deleting user:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const reactivateUser = async (id: string) => {
    loading.value = true;
    error.value = '';
    try {
      await repository.reactivate(id);
      console.log('Reactivated user:', id);
    } catch (err: any) {
      error.value = err.message || 'Không thể mở khóa người dùng';
      console.error('Error reactivating user:', err);
      throw err;
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
    createUser,
    updateUser,
    deleteUser,
    reactivateUser,
  };
};
