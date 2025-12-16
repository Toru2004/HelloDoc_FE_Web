<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { GetPendingDoctorsUseCase } from '@/domain/usecases/doctor/get_pending_doctors_use_case';
import { VerifyDoctorUseCase } from '@/domain/usecases/doctor/verify_doctor_use_case';
import { DoctorRepositoryImpl } from '@/data/repositories/doctor_repository_impl';
import type { PendingDoctor } from '@/domain/entities/pending_doctor';
import PendingDoctorCard from '@/components/molecules/applications-pending/PendingDoctorCard.vue';
import ImageViewerModal from '@/components/modal/ImageViewerModal.vue';
import ConfirmActionModal from '@/components/modal/ConfirmActionModal.vue';
import { Search, Filter, RefreshCw, Inbox } from "lucide-vue-next";

const { notifySuccess, notifyFailed, notifyInfo, notifyWarning } = useNotification();

// Dependency Injection (Manually for now or look for DI container if exists)
const api = useApi();
const doctorRepository = new DoctorRepositoryImpl(api);
const getPendingDoctorsUseCase = new GetPendingDoctorsUseCase(doctorRepository);
const verifyDoctorUseCase = new VerifyDoctorUseCase(doctorRepository);

const pendingDoctors = ref<PendingDoctor[]>([]);
const loading = ref(false);
const processingId = ref<string | null>(null);
const searchQuery = ref('');

// Viewer State
const isViewerOpen = ref(false);
const selectedImageUrl = ref('');

// Confirm Modal State
const isConfirmModalOpen = ref(false);
const confirmModalTitle = ref('');
const confirmModalMessage = ref('');
const doctorToVerify = ref<PendingDoctor | null>(null);

const fetchPendingDoctors = async () => {
  loading.value = true;
  try {
    pendingDoctors.value = await getPendingDoctorsUseCase.execute();
  } catch (error) {
    console.error('Failed to fetch pending doctors:', error);
  } finally {
    loading.value = false;
  }
};

const handleViewImage = (url: string) => {
  selectedImageUrl.value = url;
  isViewerOpen.value = true;
};

const handleVerify = (userId: string) => {
    const doctor = pendingDoctors.value.find(d => d._id === userId || d.userId === userId);
    if (!doctor) return;

    doctorToVerify.value = doctor;
    confirmModalTitle.value = 'Xác nhận duyệt bác sĩ';
    confirmModalMessage.value = `Bạn có chắc chắn muốn duyệt đơn đăng ký của bác sĩ <b>${doctor.name}</b> không? Hark hành động này sẽ cấp quyền bác sĩ cho tài khoản này.`;
    isConfirmModalOpen.value = true;
};

const onConfirmVerify = async () => {
    if (!doctorToVerify.value) return;
    
    const doctor = doctorToVerify.value;
    const targetId = doctor.userId;
    // We use the processingId on the card, so we set it to the doc ID (usually _id or userId depending on what the card uses for keys)
    // The card uses :key="doc._id" and :loading="processingId === doc._id". So we used doc._id. 
    // And handleVerify emitted doc._id (based on previous changes).
    
    processingId.value = doctor.userId;
    isConfirmModalOpen.value = false; // Close modal immediately or wait? Usually wait if modal handles loading, but here card handles loading. 
    // The modal also has a loading state but we are using card loading. 
    // Let's close modal and show loading on card.

    try {
        await verifyDoctorUseCase.execute(targetId);
        // Remove from list on success
        pendingDoctors.value = pendingDoctors.value.filter(d => d._id !== doctor._id);
        notifySuccess('Tạo tin tức thành công!');
        // Show success notification (if notify system exists)
    } catch (error: any) {
        console.error('Failed to verify doctor:', error);
        notifyFailed(error.message || 'Có lỗi xảy ra khi duyệt đơn');
    } finally {
        processingId.value = null;
        doctorToVerify.value = null;
    }
};

onMounted(() => {
  fetchPendingDoctors();
});

// Filter/Search Logic if needed
const filteredDoctors = computed(() => {
    if (!searchQuery.value) return pendingDoctors.value;
    const lower = searchQuery.value.toLowerCase();
    return pendingDoctors.value.filter(d => 
        d.name.toLowerCase().includes(lower) || 
        d.email.toLowerCase().includes(lower) ||
        d.phone.includes(lower)
    );
});
</script>

<template>
  <div class="space-y-6">
    <!-- Filters & Actions -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div class="relative flex-1 max-w-md">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Tìm kiếm theo tên, email, sđt..." 
                class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
        </div>
        <div class="flex items-center gap-2">
            <button @click="fetchPendingDoctors" class="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg text-sm font-medium transition-colors border border-gray-200" title="Làm mới">
                <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': loading }" />
                <span class="hidden sm:inline">Làm mới</span>
            </button>
        </div>
    </div>

    <!-- Content -->
    <div v-if="loading && pendingDoctors.length === 0" class="flex flex-col items-center justify-center py-20">
        <div class="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <p class="text-gray-400 text-sm mt-4">Đang tải danh sách chờ...</p>
    </div>

    <div v-else-if="filteredDoctors.length === 0" class="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
        <div class="bg-gray-50 p-4 rounded-full mb-4">
             <Inbox class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-gray-900 font-medium">Không có dữ liệu</h3>
        <p class="text-gray-500 text-sm mt-1">Hiện không có đơn đăng ký nào chờ duyệt.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div v-for="doc in filteredDoctors" :key="doc._id" class="h-full">
            <PendingDoctorCard 
                :doctor="doc" 
                :loading="processingId === doc._id"
                @verify="handleVerify"
                @view-image="handleViewImage"
            />
        </div>
    </div>

    <!-- Image Viewer Modal -->
    <ImageViewerModal 
      :is-open="isViewerOpen"
      :image-url="selectedImageUrl"
      @close="isViewerOpen = false"
    />

    <!-- Confirm Verify Modal -->
    <ConfirmActionModal
      :is-open="isConfirmModalOpen"
      :title="confirmModalTitle"
      :message="confirmModalMessage"
      confirm-text="Duyệt ngay"
      confirm-button-class="bg-green-600 hover:bg-green-700 text-white"
      icon="info"
      @close="isConfirmModalOpen = false"
      @confirm="onConfirmVerify"
    />
  </div>
</template>
