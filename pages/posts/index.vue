<script setup lang="ts">
import PostList from "@/components/organisms/posts/PostList.vue";
import PageOverview from "@/components/molecules/PageOverview.vue";

definePageMeta({
  layout: "default",
});

useHead({
  title: 'Quản lý bài viết - HelloDoc',
});

const { posts, filteredPosts, loading, error, fetchPosts } = usePostViewModel();

const handleReload = () => {
  fetchPosts();
};
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Page Overview -->
    <PageOverview
      title="Quản lý bài viết"
      description="Danh sách bài viết trong hệ thống HelloDoc"
      :loading="loading"
      :show-add-button="false"
      @reload="handleReload"
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

    <!-- Posts List -->
    <PostList 
      :posts="filteredPosts" 
      :loading="loading"
    />
  </div>
</template>
