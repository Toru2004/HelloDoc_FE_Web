import { NuxtHttpClient } from '@/data/datasources/nuxt_http_client';
import { DoctorRepositoryImpl } from '@/data/repositories/doctor_repository_impl';
import type { Doctor } from '@/domain/entities/doctor';

export const useDoctorViewModel = () => {
    const client = new NuxtHttpClient();
    const repository = new DoctorRepositoryImpl(client);

    const doctors = ref<Doctor[]>([]);
    const loading = ref(false);
    const error = ref('');

    const fetchDoctors = async () => {
        loading.value = true;
        error.value = '';
        try {
            const response = await repository.getAll();
            doctors.value = response;
            console.log('Fetched doctors:', response.length);
        } catch (err: any) {
            error.value = err.message || 'Không thể tải danh sách bác sĩ';
            console.error('Error fetching doctors:', err);
        } finally {
            loading.value = false;
        }
    };

    return {
        doctors,
        loading,
        error,
        fetchDoctors
    };
};
