<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { GetPendingDoctorsUseCase } from '@/domain/usecases/doctor/get_pending_doctors_use_case';
import { GetRejectedDoctorsUseCase } from '@/domain/usecases/doctor/get_rejected_doctors_use_case';
import { VerifyDoctorUseCase } from '@/domain/usecases/doctor/verify_doctor_use_case';
import { RejectDoctorUseCase } from '@/domain/usecases/doctor/reject_doctor_use_case';
import { DoctorRepositoryImpl } from '@/data/repositories/doctor_repository_impl';
import type { PendingDoctor } from '@/domain/entities/pending_doctor';
import PendingDoctorCard from '@/components/molecules/applications-pending/PendingDoctorCard.vue';
import ImageViewerModal from '@/components/modal/ImageViewerModal.vue';
import ConfirmActionModal from '@/components/modal/ConfirmActionModal.vue';
import RejectApplicationModal from '@/components/modal/RejectApplicationModal.vue';
import { Search, RefreshCw, Inbox, Clock, XCircle } from "lucide-vue-next";

const { notifySuccess, notifyFailed } = useNotification();

// Dependency Injection
const api = useApi();
const doctorRepository = new DoctorRepositoryImpl(api);
const getPendingDoctorsUseCase = new GetPendingDoctorsUseCase(doctorRepository);
const getRejectedDoctorsUseCase = new GetRejectedDoctorsUseCase(doctorRepository);
const verifyDoctorUseCase = new VerifyDoctorUseCase(doctorRepository);
const rejectDoctorUseCase = new RejectDoctorUseCase(doctorRepository);

const pendingDoctors = ref<PendingDoctor[]>([]);
const loading = ref(false);
const processingId = ref<string | null>(null);
const searchQuery = ref('');
const activeTab = ref<'pending' | 'rejected'>('pending');

// Viewer State
const isViewerOpen = ref(false);
const selectedImageUrl = ref('');

// Confirm Modal State
const isConfirmModalOpen = ref(false);
const confirmModalTitle = ref('');
const confirmModalMessage = ref('');
const doctorToVerify = ref<PendingDoctor | null>(null);

// Reject Modal State
const isRejectModalOpen = ref(false);
const doctorToReject = ref<PendingDoctor | null>(null);

const fetchDoctors = async () => {
  loading.value = true;
  try {
    if (activeTab.value === 'pending') {
      pendingDoctors.value = await getPendingDoctorsUseCase.execute();
    } else {
      pendingDoctors.value = await getRejectedDoctorsUseCase.execute();
    }
  } catch (error) {
    console.error('Failed to fetch doctors:', error);
  } finally {
    loading.value = false;
  }
};

const handleViewImage = (url: string) => {
  selectedImageUrl.value = url;
  isViewerOpen.value = true;
};

const handleVerify = (userId: string) => {
    const doctor = pendingDoctors.value.find(d => d.userId === userId);
    if (!doctor) return;

    doctorToVerify.value = doctor;
    confirmModalTitle.value = 'Xác nhận duyệt bác sĩ';
    confirmModalMessage.value = `Bạn có chắc chắn muốn duyệt đơn đăng ký của bác sĩ <b>${doctor.name}</b> không? Hành động này sẽ cấp quyền bác sĩ cho tài khoản này.`;
    isConfirmModalOpen.value = true;
};

const onConfirmVerify = async () => {
    if (!doctorToVerify.value) return;
    
    const doctor = doctorToVerify.value;
    const targetId = doctor.userId;
    
    processingId.value = doctor.userId;
    isConfirmModalOpen.value = false;

    try {
        await verifyDoctorUseCase.execute(targetId);
        pendingDoctors.value = pendingDoctors.value.filter(d => d.userId !== targetId);
        notifySuccess('Duyệt đơn đăng ký thành công!');
    } catch (error: any) {
        console.error('Failed to verify doctor:', error);
        notifyFailed(error.message || 'Có lỗi xảy ra khi duyệt đơn');
    } finally {
        processingId.value = null;
        doctorToVerify.value = null;
    }
};

const handleReject = (userId: string) => {
    const doctor = pendingDoctors.value.find(d => d.userId === userId);
    if (!doctor) return;
    doctorToReject.value = doctor;
    isRejectModalOpen.value = true;
};

const onConfirmReject = async (reason: string) => {
    if (!doctorToReject.value) return;
    
    const doctor = doctorToReject.value;
    const targetId = doctor.userId;
    
    processingId.value = targetId;
    // The RejectApplicationModal handles its own internal loading state via props or we close it
    // In this case, let's close it and let the list handle loading via processingId if needed,
    // although the modal has its own confirm button loading.
    
    try {
        await rejectDoctorUseCase.execute(targetId, reason);
        pendingDoctors.value = pendingDoctors.value.filter(d => d.userId !== targetId);
        notifySuccess('Từ chối đơn đăng ký thành công!');
        isRejectModalOpen.value = false;
    } catch (error: any) {
        console.error('Failed to reject doctor:', error);
        notifyFailed(error.message || 'Có lỗi xảy ra khi từ chối đơn');
    } finally {
        processingId.value = null;
        doctorToReject.value = null;
        // The modal should reset its loading state if it stayed open, but we closed it.
    }
};

watch(activeTab, () => {
    fetchDoctors();
});

onMounted(() => {
  fetchDoctors();
});

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
    <!-- Tabs & Filters -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="relative flex-1 max-w-md">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    v-model="searchQuery"
                    type="text" 
                    placeholder="Tìm kiếm theo tên, email, sđt..." 
                    class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                />
            </div>
            <div class="flex items-center gap-2">
                <button @click="fetchDoctors" class="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold transition-colors border border-gray-200" title="Làm mới">
                    <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': loading }" />
                    <span>Làm mới</span>
                </button>
            </div>
        </div>

        <div class="flex border-b border-gray-100">
            <button 
                @click="activeTab = 'pending'"
                class="flex-1 py-4 px-6 text-sm font-semibold transition-all relative flex items-center justify-center gap-2"
                :class="activeTab === 'pending' ? 'text-blue-600 bg-blue-50/30' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'"
            >
                <Clock class="w-4 h-4" />
                Đang chờ duyệt
                <div v-if="activeTab === 'pending'" class="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full"></div>
            </button>
            <button 
                @click="activeTab = 'rejected'"
                class="flex-1 py-4 px-6 text-sm font-semibold transition-all relative flex items-center justify-center gap-2"
                :class="activeTab === 'rejected' ? 'text-red-600 bg-red-50/30' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'"
            >
                <XCircle class="w-4 h-4" />
                Đã từ chối
                <div v-if="activeTab === 'rejected'" class="absolute bottom-0 left-0 w-full h-1 bg-red-600 rounded-t-full"></div>
            </button>
        </div>
    </div>

    <!-- Content -->
    <div v-if="loading && pendingDoctors.length === 0" class="flex flex-col items-center justify-center py-20">
        <div class="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <p class="text-gray-400 text-sm mt-4 font-medium">Đang tải danh sách...</p>
    </div>

    <div v-else-if="filteredDoctors.length === 0" class="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
        <div class="bg-gray-50 p-6 rounded-full mb-4">
             <Inbox class="w-12 h-12 text-gray-300" />
        </div>
        <h3 class="text-gray-900 font-bold text-lg">Không có dữ liệu</h3>
        <p class="text-gray-500 text-sm mt-1 max-w-xs text-center">
            Hiện không có đơn đăng ký nào trong danh sách {{ activeTab === 'pending' ? 'chờ duyệt' : 'bị từ chối' }}.
        </p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div v-for="doc in filteredDoctors" :key="doc._id" class="h-full">
            <PendingDoctorCard 
                :doctor="doc" 
                :loading="processingId === doc.userId"
                @verify="handleVerify"
                @reject="handleReject"
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
      confirm-text="Xác nhận duyệt"
      confirm-button-class="bg-green-600 hover:bg-green-700 text-white shadow-green-200 shadow-lg"
      icon="success"
      @close="isConfirmModalOpen = false"
      @confirm="onConfirmVerify"
    />

    <!-- Reject Application Modal -->
    <RejectApplicationModal
        :is-open="isRejectModalOpen"
        :doctor-name="doctorToReject?.name || ''"
        @close="isRejectModalOpen = false"
        @confirm="onConfirmReject"
    />
  </div>
</template>
