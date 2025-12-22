import { NuxtHttpClient } from '@/data/datasources/nuxt_http_client';
import { ReportRepositoryImpl } from '@/data/repositories/report_repository_impl';

export const useReportViewModel = () => {
  const client = new NuxtHttpClient();
  const repository = new ReportRepositoryImpl(client);

  const reports = ref<Report[]>([]);
  const loading = ref(false);
  const error = ref('');
  const totalReports = ref(0);
  const limit = ref(10);
  const offset = ref(0);
  const searchText = ref('');

  const fetchReports = async () => {
    loading.value = true;
    error.value = '';
    try {
      const response = await repository.getAllFiltered(limit.value, offset.value, searchText.value);
      reports.value = response.data || [];
      totalReports.value = response.total || 0;
      console.log('Fetched filtered reports:', reports.value.length, 'Total:', totalReports.value);
    } catch (err: any) {
      error.value = err.message || 'Không thể tải báo cáo';
      console.error('Error fetching reports:', err);
    } finally {
      loading.value = false;
    }
  };

  return {
    reports,
    loading,
    error,
    totalReports,
    limit,
    offset,
    searchText,
    fetchReports,
  };
};
