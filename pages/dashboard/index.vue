<script setup lang="ts">
import Infomation from "@/components/organisms/dashboard/Infomation.vue";

definePageMeta({
  layout: "default",
});

useHead({
  title: 'Dashboard - HelloDoc Admin',
});

const api = useApi();

// Stats
const usersList = ref<User[]>([]);
const doctorsList = ref<Doctor[]>([]);

// Stats
const totalUsers = ref(0);
const totalDoctors = ref(0);
const totalSpecialties = ref(0);
const totalReports = ref(0);
const pendingReports = ref(0);
const totalPatients = ref(0);
const totalRatings = ref(0);
const verifiedDoctors = ref(0);
const loading = ref(false);

// Websocket stats
const { onlineUsers, onlineDoctors, connect, onlineUserIds, onlineDoctorIds } = useWebSocket();

// Fetch all stats
onMounted(async () => {
  connect();
  await fetchStats();
});

const fetchStats = async () => {
  loading.value = true;
  
  try {
    // Fetch users
    const users = await api.get<User[]>('/user');
    usersList.value = users;
    totalUsers.value = users.filter(u => u.role?.toLowerCase() === 'user').length;
    
    // Fetch doctors
    const doctors = await api.get<Doctor[]>('/doctor/get-all');
    doctorsList.value = doctors;
    totalDoctors.value = doctors.length;
    verifiedDoctors.value = doctors.filter(d => d.verified).length;
    totalPatients.value = doctors.reduce((sum, d) => sum + (d.patientsCount || 0), 0);
    totalRatings.value = doctors.reduce((sum, d) => sum + (d.ratingsCount || 0), 0);
    
    // Fetch specialties
    const specialties = await api.get<Specialty[]>('/specialty/get-all');
    totalSpecialties.value = specialties.length;
    
    // Fetch reports
    const reports = await api.get<Report[]>('/report');
    totalReports.value = reports.length;
    pendingReports.value = reports.filter(r => r.status?.toLowerCase() === 'pending').length;
    
  } catch (err) {
    console.error('Error fetching stats:', err);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <Infomation 
    :total-users="totalUsers"
    :total-doctors="totalDoctors"
    :total-specialties="totalSpecialties"
    :total-reports="totalReports"
    :pending-reports="pendingReports"
    :total-patients="totalPatients"
    :total-ratings="totalRatings"
    :verified-doctors="verifiedDoctors"
    :online-users="onlineUsers"
    :online-doctors="onlineDoctors"
    :users-list="usersList"
    :doctors-list="doctorsList"
    :online-user-ids="onlineUserIds"
    :online-doctor-ids="onlineDoctorIds"
    :loading="loading"
  />
</template>
