<script setup lang="ts">
import NewsList from "@/components/organisms/news/NewsList.vue";
import PageOverview from "@/components/molecules/PageOverview.vue";
import Pagination from "@/components/molecules/Pagination.vue";
import ConfirmActionModal from "@/components/modal/ConfirmActionModal.vue";
import EditNewsModal from "@/components/modal/EditNewsModal.vue";
import AddNewsModal from "@/components/modal/AddNewsModal.vue";
import type { News, CreateNewsDto, UpdateNewsDto } from "@/domain/entities/news";

definePageMeta({
  layout: "default",
});

useHead({
  title: 'Quản lý tin tức - HelloDoc',
});

const { 
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
  deleteNews 
} = useNewsViewModel();
const { notifySuccess, notifyFailed } = useNotification();

const currentPage = ref(1);

// Watch for pagination changes
watch([currentPage, limit], () => {
  offset.value = (currentPage.value - 1) * limit.value;
  fetchNews();
});

const handleSearch = (val: string) => {
  searchText.value = val;
  offset.value = 0;
  currentPage.value = 1;
  fetchNews();
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

// Modal states
const isConfirmModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isAddModalOpen = ref(false);
const selectedNews = ref<News | null>(null);
const confirmModalTitle = ref('');
const confirmModalMessage = ref('');
const confirmModalConfirmText = ref('Xác nhận');
const confirmModalCancelText = ref('Hủy');
const confirmModalButtonClass = ref('bg-blue-600 hover:bg-blue-700');
const confirmModalIcon = ref<'warning' | 'info' | 'success'>('info');

const handleReload = () => {
  fetchNews();
};

const handleAdd = () => {
  isAddModalOpen.value = true;
};

const handleCloseAdd = () => {
  isAddModalOpen.value = false;
};

const handleSubmitAdd = async (newsData: CreateNewsDto) => {
  try {
    await createNews(newsData);
    notifySuccess('Tạo tin tức thành công!');
    await fetchNews();
    handleCloseAdd();
  } catch (err: any) {
    notifyFailed(err.message || 'Không thể tạo tin tức');
  }
};

const handleEdit = (newsItem: News) => {
  selectedNews.value = newsItem;
  isEditModalOpen.value = true;
};

const handleCloseEdit = () => {
  isEditModalOpen.value = false;
  selectedNews.value = null;
};

const handleSubmitEdit = async (newsData: UpdateNewsDto) => {
  if (!selectedNews.value) return;
  
  try {
    await updateNews(selectedNews.value._id, newsData);
    notifySuccess('Cập nhật tin tức thành công!');
    await fetchNews();
    handleCloseEdit();
  } catch (err: any) {
    notifyFailed(err.message || 'Không thể cập nhật tin tức');
  }
};

const handleDelete = (newsItem: News) => {
  selectedNews.value = newsItem;
  confirmModalTitle.value = 'Xác nhận ẩn tin tức';
  confirmModalMessage.value = `Bạn có chắc chắn muốn ẩn tin tức "<strong>${newsItem.title}</strong>"?<br><span class="text-sm text-gray-600">Tin tức sẽ không hiển thị với người dùng sau khi bị ẩn.</span>`;
  confirmModalConfirmText.value = 'Ẩn tin tức';
  confirmModalCancelText.value = 'Hủy';
  confirmModalButtonClass.value = 'bg-red-600 hover:bg-red-700';
  confirmModalIcon.value = 'warning';
  isConfirmModalOpen.value = true;
};

const handleCloseConfirm = () => {
  isConfirmModalOpen.value = false;
  selectedNews.value = null;
};

const handleConfirm = async () => {
  if (!selectedNews.value) return;
  
  try {
    await deleteNews(selectedNews.value._id);
    notifySuccess('Ẩn tin tức thành công!');
    await fetchNews();
  } catch (err: any) {
    notifyFailed(err.message || 'Không thể ẩn tin tức');
  } finally {
    handleCloseConfirm();
  }
};
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Page Overview -->
    <PageOverview
      title="Quản lý tin tức"
      description="Danh sách tin tức trong hệ thống HelloDoc"
      :loading="loading"
      add-label="Tạo tin tức"
      show-search
      v-model:search-text="searchText"
      @search="handleSearch"
      @add="handleAdd"
      @reload="fetchNews"
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

    <!-- News List -->
    <div class="bg-white rounded-t-xl shadow-sm border border-gray-100 overflow-hidden">
      <NewsList 
        :news="news" 
        :loading="loading"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <!-- Pagination -->
    <Pagination
      v-model:current-page="currentPage"
      v-model:items-per-page="limit"
      :total-items="totalNews"
      :loading="loading"
      @page-change="handlePageChange"
    />

    <!-- Add News Modal -->
    <AddNewsModal
      :is-open="isAddModalOpen"
      @close="handleCloseAdd"
      @submit="handleSubmitAdd"
    />

    <!-- Edit News Modal -->
    <EditNewsModal
      :is-open="isEditModalOpen"
      :news="selectedNews"
      @close="handleCloseEdit"
      @submit="handleSubmitEdit"
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
