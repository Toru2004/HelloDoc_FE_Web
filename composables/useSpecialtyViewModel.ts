import { NuxtHttpClient } from '@/data/datasources/nuxt_http_client';
import { SpecialtyRepositoryImpl } from '@/data/repositories/specialty_repository_impl';
import type { Specialty } from '@/domain/entities/specialty';

export const useSpecialtyViewModel = () => {
  // Dependency Injection (Manually for now)
  const client = new NuxtHttpClient();
  const repository = new SpecialtyRepositoryImpl(client);

  // State
  const specialties = ref<Specialty[]>([]);
  const loading = ref(false);
  const error = ref('');
  const totalSpecialties = ref(0);
  const limit = ref(10);
  const offset = ref(0);
  const searchText = ref('');

  // Actions
  const fetchSpecialties = async () => {
    loading.value = true;
    error.value = '';
    try {
      const response = await repository.getAllFiltered(limit.value, offset.value, searchText.value);
      specialties.value = response.data || [];
      totalSpecialties.value = response.total || 0;
    } catch (err: any) {
      error.value = err.message || 'Không thể tải danh sách chuyên khoa';
      console.error('Error fetching specialties:', err);
    } finally {
      loading.value = false;
    }
  };

  const createSpecialty = async (formData: FormData): Promise<void> => {
    loading.value = true;
    error.value = '';
    try {
      await repository.create(formData);
    } catch (err: any) {
      error.value = err.message || 'Không thể tạo chuyên khoa';
      throw err; // Re-throw to let UI handle specific success/fail logic if needed (e.g. closing modal)
    } finally {
      loading.value = false;
    }
  };

  const updateSpecialty = async (id: string, formData: FormData): Promise<void> => {
    loading.value = true;
    error.value = '';
    try {
      await repository.update(id, formData);
    } catch (err: any) {
      error.value = err.message || 'Không thể cập nhật chuyên khoa';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteSpecialty = async (id: string): Promise<void> => {
    loading.value = true;
    error.value = '';
    try {
      await repository.delete(id);
    } catch (err: any) {
      error.value = err.message || 'Không thể xóa chuyên khoa';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    specialties,
    loading,
    error,
    totalSpecialties,
    limit,
    offset,
    searchText,
    fetchSpecialties,
    createSpecialty,
    updateSpecialty,
    deleteSpecialty,
  };
};
