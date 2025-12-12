import { NuxtHttpClient } from '@/data/datasources/nuxt_http_client';
import { PostRepositoryImpl } from '@/data/repositories/post_repository_impl';
import type { Post } from '@/domain/entities/post';

export const usePostViewModel = () => {
  const client = new NuxtHttpClient();
  const repository = new PostRepositoryImpl(client);

  const posts = ref<Post[]>([]);
  const filteredPosts = computed(() => posts.value);
  const loading = ref(false);
  const error = ref('');

  const fetchPosts = async () => {
    loading.value = true;
    error.value = '';
    try {
      posts.value = await repository.getAll();
      console.log('Fetched posts:', posts.value.length);
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
    filteredPosts,
    loading,
    error,
    fetchPosts,
    deletePost,
  };
};
