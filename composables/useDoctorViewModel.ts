import { NuxtHttpClient } from '@/data/datasources/nuxt_http_client';
import { DoctorRepositoryImpl } from '@/data/repositories/doctor_repository_impl';
import type { Doctor } from '@/domain/entities/doctor';

export const useDoctorViewModel = () => {
    const client = new NuxtHttpClient();
    const repository = new DoctorRepositoryImpl(client);

    const doctors = ref<Doctor[]>([]);
    const loading = ref(false);
    const error = ref('');
    const totalDoctors = ref(0);
    const limit = ref(10);
    const offset = ref(0);
    const searchText = ref('');

    const fetchDoctors = async () => {
        loading.value = true;
        error.value = '';
        try {
            const response = await repository.getAllFiltered(limit.value, offset.value, searchText.value);
            doctors.value = response.data || [];
            totalDoctors.value = response.total || 0;
            console.log('Fetched filtered doctors:', doctors.value.length, 'Total:', totalDoctors.value);
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
        totalDoctors,
        limit,
        offset,
        searchText,
        fetchDoctors
    };
};
