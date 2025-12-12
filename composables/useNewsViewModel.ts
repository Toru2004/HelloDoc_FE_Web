import { NuxtHttpClient } from '@/data/datasources/nuxt_http_client';
import { NewsRepositoryImpl } from '@/data/repositories/news_repository_impl';
import type { News } from '@/domain/entities/news';

export const useNewsViewModel = () => {
  const client = new NuxtHttpClient();
  const repository = new NewsRepositoryImpl(client);

  const news = ref<News[]>([]);
  const filteredNews = computed(() => news.value);
  const loading = ref(false);
  const error = ref('');

  const fetchNews = async () => {
    loading.value = true;
    error.value = '';
    try {
      news.value = await repository.getAll();
      console.log('Fetched news:', news.value.length);
    } catch (err: any) {
      error.value = err.message || 'Không thể tải tin tức';
      console.error('Error fetching news:', err);
    } finally {
      loading.value = false;
    }
  };

  const deleteNews = async (id: string) => {
    loading.value = true;
    error.value = '';
    try {
      await repository.delete(id);
      console.log('Deleted news:', id);
    } catch (err: any) {
      error.value = err.message || 'Không thể ẩn tin tức';
      console.error('Error deleting news:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Auto-fetch on mount
  onMounted(() => {
    fetchNews();
  });

  return {
    news,
    filteredNews,
    loading,
    error,
    fetchNews,
    deleteNews,
  };
};
