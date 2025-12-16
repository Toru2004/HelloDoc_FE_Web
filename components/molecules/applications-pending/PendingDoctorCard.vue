<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { Check, X, FileText, User as UserIcon, Phone, MapPin, Mail, ShieldAlert, ExternalLink } from "lucide-vue-next";
import type { PendingDoctor } from '@/domain/entities/pending_doctor';

const props = defineProps<{
  doctor: PendingDoctor;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'verify', id: string): void;
  (e: 'view-image', url: string): void;
}>();

const handleVerify = () => {
  emit('verify', props.doctor.userId); 
};

const openImage = (url: string) => {
  if (url) {
    emit('view-image', url);
  }
};
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 md:flex flex-col h-full bg-gradient-to-br from-white to-gray-50/50">
    <!-- Header / Cover -->
    <div class="h-24 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
        <div class="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-xs text-white font-medium border border-white/20 flex items-center gap-1">
             <ShieldAlert class="w-3 h-3" />
             Chờ duyệt
        </div>
    </div>

    <div class="px-6 pb-6 flex-1 flex flex-col">
       <!-- Avatar & Name -->
       <div class="relative -mt-12 mb-4 flex flex-col items-center text-center">
            <div class="relative group cursor-pointer" @click="openImage(doctor.faceUrl || doctor.avatarURL)">
                <img 
                    :src="doctor.avatarURL || 'https://via.placeholder.com/150'" 
                    alt="Avatar" 
                    class="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover bg-white"
                />
                <div class="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                    <ExternalLink class="w-6 h-6 text-white" />
                </div>
            </div>
            
            <h3 class="mt-3 text-lg font-bold text-gray-800">{{ doctor.name }}</h3>
            <div class="flex items-center gap-1.5 text-sm text-gray-500 mt-1 bg-gray-100 px-2 py-0.5 rounded-md">
                 <UserIcon class="w-3 h-3" />
                 <span>ID: {{ doctor.CCCD }}</span>
            </div>
       </div>

       <!-- Details -->
       <div class="space-y-3 flex-1">
            <div class="flex items-start gap-3 text-sm">
                <Mail class="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <span class="text-gray-600 truncate" :title="doctor.email">{{ doctor.email }}</span>
            </div>
            <div class="flex items-start gap-3 text-sm">
                 <Phone class="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                 <span class="text-gray-600">{{ doctor.phone }}</span>
            </div>
            <div class="flex items-start gap-3 text-sm">
                 <MapPin class="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                 <span class="text-gray-600 line-clamp-2">{{ doctor.address }}</span>
            </div>
            
            <div class="pt-3 mt-3 border-t border-gray-100">
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Chứng chỉ & Bằng cấp</p>
                <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200">
                     <button @click="openImage(doctor.licenseUrl)" class="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition py-1 whitespace-nowrap border border-blue-100">
                          <FileText class="w-3 h-3" />
                          Chứng chỉ hành nghề
                     </button>
                      <button @click="openImage(doctor.frontCccdUrl)" class="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-100 transition py-1 whitespace-nowrap border border-gray-200">
                          <FileText class="w-3 h-3" />
                          CCCD (Trước)
                     </button>
                      <button @click="openImage(doctor.backCccdUrl)" class="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-100 transition py-1 whitespace-nowrap border border-gray-200">
                          <FileText class="w-3 h-3" />
                          CCCD (Sau)
                     </button>
                </div>
            </div>
            
            <div v-if="doctor.certificates" class="text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-100 italic">
                "{{ doctor.certificates }}"
            </div>
       </div>

       <!-- Actions -->
       <div class="mt-6 pt-4 border-t border-gray-100 flex gap-3">
           <button 
                @click="handleVerify"
                :disabled="loading"
                class="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2.5 px-4 rounded-xl font-medium shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
                <Check v-if="!loading" class="w-4 h-4" />
                <div v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {{ loading ? 'Đang xử lý...' : 'Duyệt đơn' }}
           </button>
       </div>
    </div>
  </div>
</template>
