import { NuxtHttpClient } from '@/data/datasources/nuxt_http_client';
import { PostRepositoryImpl } from '@/data/repositories/post_repository_impl';
import type { Post } from '@/domain/entities/post';

export const usePostViewModel = () => {
  const client = new NuxtHttpClient();
  const repository = new PostRepositoryImpl(client);

  const posts = ref<Post[]>([]);
  const loading = ref(false);
  const error = ref('');
  const totalPosts = ref(0);
  const limit = ref(10);
  const offset = ref(0);
  const searchText = ref('');

  const fetchPosts = async () => {
    loading.value = true;
    error.value = '';
    try {
      const response = await repository.getAllFiltered(limit.value, offset.value, searchText.value);
      posts.value = response.data || [];
      totalPosts.value = response.total || 0;
      console.log('Fetched filtered posts:', posts.value.length, 'Total:', totalPosts.value);
    } catch (err: any) {
      error.value = err.message || 'Không thể tải bài viết';
      console.error('Error fetching posts:', err);
    } finally {
      loading.value = false;
    }
  };

  const deletePost = async (id: string) => {
    loading.value = true;
    error.value = '';
    try {
      await repository.delete(id);
      console.log('Deleted post:', id);
    } catch (err: any) {
      error.value = err.message || 'Không thể ẩn bài viết';
      console.error('Error deleting post:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Auto-fetch on mount
  onMounted(() => {
    fetchPosts();
  });

  return {
    posts,
    loading,
    error,
    totalPosts,
    limit,
    offset,
    searchText,
    fetchPosts,
    deletePost,
  };
};
