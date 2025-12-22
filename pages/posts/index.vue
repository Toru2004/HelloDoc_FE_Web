<script setup lang="ts">
import PostList from "@/components/organisms/posts/PostList.vue";
import PageOverview from "@/components/molecules/PageOverview.vue";
import Pagination from "@/components/molecules/Pagination.vue";
import ConfirmActionModal from "@/components/modal/ConfirmActionModal.vue";
import type { Post } from "@/domain/entities/post";

definePageMeta({
  layout: "default",
});

useHead({
  title: 'Quản lý bài viết - HelloDoc',
});

const { 
  posts, 
  loading, 
  error, 
  totalPosts,
  limit,
  offset,
  searchText,
  fetchPosts, 
  deletePost 
} = usePostViewModel();
const { notifySuccess, notifyFailed } = useNotification();

const currentPage = ref(1);

// Watch for pagination and limit changes
watch([currentPage, limit], () => {
  offset.value = (currentPage.value - 1) * limit.value;
  fetchPosts();
});

const handleSearch = (val: string) => {
  searchText.value = val;
  offset.value = 0;
  currentPage.value = 1;
  fetchPosts();
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

// Modal states
const isConfirmModalOpen = ref(false);
const selectedPost = ref<Post | null>(null);
const confirmModalTitle = ref('');
const confirmModalMessage = ref('');
const confirmModalConfirmText = ref('Xác nhận');
const confirmModalCancelText = ref('Hủy');
const confirmModalButtonClass = ref('bg-blue-600 hover:bg-blue-700');
const confirmModalIcon = ref<'warning' | 'info' | 'success'>('info');

const handleReload = () => {
  fetchPosts();
};

const handleDelete = (post: Post) => {
  selectedPost.value = post;
  confirmModalTitle.value = 'Xác nhận ẩn bài viết';
  confirmModalMessage.value = `Bạn có chắc chắn muốn ẩn bài viết này?<br><span class="text-sm text-gray-600">Bài viết sẽ không hiển thị với người dùng sau khi bị ẩn.</span>`;
  confirmModalConfirmText.value = 'Ẩn bài viết';
  confirmModalCancelText.value = 'Hủy';
  confirmModalButtonClass.value = 'bg-red-600 hover:bg-red-700';
  confirmModalIcon.value = 'warning';
  isConfirmModalOpen.value = true;
};

const handleCloseConfirm = () => {
  isConfirmModalOpen.value = false;
  selectedPost.value = null;
};

const handleConfirm = async () => {
  if (!selectedPost.value) return;
  
  try {
    await deletePost(selectedPost.value._id);
    notifySuccess('Ẩn bài viết thành công!');
    await fetchPosts();
  } catch (err: any) {
    notifyFailed(err.message || 'Không thể ẩn bài viết');
  } finally {
    handleCloseConfirm();
  }
};
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Page Overview -->
    <PageOverview
      title="Quản lý bài viết"
      description="Danh sách bài viết trong hệ thống HelloDoc"
      :loading="loading"
      :show-add="false"
      show-search
      v-model:search-text="searchText"
      @search="handleSearch"
      @reload="fetchPosts"
    />

    <!-- Error State -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div class="flex items-center gap-3">
        <svg class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 class="font-semibold text-red-800">Lỗi tải dữ liệu</h3>
          <p class="text-red-600">{{ error }}</p>
        </div>
      </div>
      <button
        @click="handleReload"
        class="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
      >
        Thử lại
      </button>
    </div>

    <div class="bg-white rounded-t-xl shadow-sm border border-gray-100 overflow-hidden">
      <PostList 
        :posts="posts" 
        :loading="loading"
        @delete="handleDelete"
      />
    </div>

    <!-- Pagination -->
    <Pagination
      v-model:current-page="currentPage"
      v-model:items-per-page="limit"
      :total-items="totalPosts"
      :loading="loading"
      @page-change="handlePageChange"
    />

    <!-- Confirmation Modal -->
    <ConfirmActionModal
      :is-open="isConfirmModalOpen"
      :title="confirmModalTitle"
      :message="confirmModalMessage"
      :confirm-text="confirmModalConfirmText"
      :cancel-text="confirmModalCancelText"
      :button-class="confirmModalButtonClass"
      :icon="confirmModalIcon"
      @close="handleCloseConfirm"
      @confirm="handleConfirm"
    />
  </div>
</template>
