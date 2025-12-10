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

  // Actions
  const fetchSpecialties = async () => {
    loading.value = true;
    error.value = '';
    try {
      specialties.value = await repository.getAll();
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
      await fetchSpecialties(); // Refresh list
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
      await fetchSpecialties(); // Refresh list
    } catch (err: any) {
      error.value = err.message || 'Không thể cập nhật chuyên khoa';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    specialties,
    loading,
    error,
    fetchSpecialties,
    createSpecialty,
    updateSpecialty,
  };
};
