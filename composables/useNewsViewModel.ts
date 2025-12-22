import { NuxtHttpClient } from '@/data/datasources/nuxt_http_client';
import { NewsRepositoryImpl } from '@/data/repositories/news_repository_impl';
import type { News, CreateNewsDto, UpdateNewsDto } from '@/domain/entities/news';

export const useNewsViewModel = () => {
  const client = new NuxtHttpClient();
  const repository = new NewsRepositoryImpl(client);

  const news = ref<News[]>([]);
  const loading = ref(false);
  const error = ref('');
  const totalNews = ref(0);
  const limit = ref(10);
  if (process.client) {
    const savedLimit = localStorage.getItem('news_page_limit');
    if (savedLimit) limit.value = parseInt(savedLimit);
  }

  watch(limit, (newLimit) => {
    if (process.client) {
      localStorage.setItem('news_page_limit', newLimit.toString());
    }
  });

  const offset = ref(0);
  const searchText = ref('');

  const fetchNews = async () => {
    loading.value = true;
    error.value = '';
    try {
      const response = await repository.getAllFiltered(limit.value, offset.value, searchText.value);
      news.value = response.data || [];
      totalNews.value = response.total || 0;
      console.log('Fetched filtered news:', news.value.length, 'Total:', totalNews.value);
    } catch (err: any) {
      error.value = err.message || 'Không thể tải tin tức';
      console.error('Error fetching news:', err);
    } finally {
      loading.value = false;
    }
  };

  const createNews = async (newsData: CreateNewsDto) => {
    loading.value = true;
    error.value = '';
    try {
      await repository.create(newsData);
      console.log('Created news');
    } catch (err: any) {
      error.value = err.message || 'Không thể tạo tin tức';
      console.error('Error creating news:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateNews = async (id: string, newsData: UpdateNewsDto) => {
    loading.value = true;
    error.value = '';
    try {
      await repository.update(id, newsData);
      console.log('Updated news:', id);
    } catch (err: any) {
      error.value = err.message || 'Không thể cập nhật tin tức';
      console.error('Error updating news:', err);
      throw err;
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
    loading,
    error,
    totalNews,
    limit,
    offset,
    searchText,
    fetchNews,
    createNews,
    updateNews,
    deleteNews,
  };
};
