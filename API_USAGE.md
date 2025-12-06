# API Service Usage Examples

This document provides examples of how to use the `useApi()` composable throughout the application.

## Basic Setup

```typescript
const api = useApi();
```

## Authentication

### Login (already implemented in login.vue)
```typescript
const handleLogin = async (email: string, password: string) => {
  try {
    const data = await api.login(email, password);
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

### Logout
```typescript
const handleLogout = () => {
  api.logout(); // Clears auth and redirects to login
};
```

## HTTP Methods

### GET Request
```typescript
// Example: Fetch user profile
const fetchUserProfile = async () => {
  try {
    const profile = await api.get('/user/profile');
    console.log(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
  }
};

// Example: Fetch with query parameters
const fetchDoctors = async (page: number = 1, limit: number = 10) => {
  try {
    const doctors = await api.get(`/doctors?page=${page}&limit=${limit}`);
    return doctors;
  } catch (error) {
    console.error('Error fetching doctors:', error);
  }
};
```

### POST Request
```typescript
// Example: Create a new appointment
const createAppointment = async (appointmentData: any) => {
  try {
    const result = await api.post('/appointments', appointmentData);
    console.log('Appointment created:', result);
  } catch (error) {
    console.error('Error creating appointment:', error);
  }
};

// Example: Upload data
const uploadPatientData = async (data: any) => {
  try {
    const response = await api.post('/patients', {
      name: data.name,
      age: data.age,
      diagnosis: data.diagnosis
    });
    return response;
  } catch (error) {
    console.error('Error uploading patient data:', error);
  }
};
```

### PUT Request
```typescript
// Example: Update user profile
const updateProfile = async (userId: string, profileData: any) => {
  try {
    const updated = await api.put(`/user/${userId}`, profileData);
    console.log('Profile updated:', updated);
  } catch (error) {
    console.error('Error updating profile:', error);
  }
};
```

### PATCH Request
```typescript
// Example: Partially update appointment status
const updateAppointmentStatus = async (appointmentId: string, status: string) => {
  try {
    const result = await api.patch(`/appointments/${appointmentId}`, { status });
    console.log('Status updated:', result);
  } catch (error) {
    console.error('Error updating status:', error);
  }
};
```

### DELETE Request
```typescript
// Example: Delete an appointment
const deleteAppointment = async (appointmentId: string) => {
  try {
    await api.delete(`/appointments/${appointmentId}`);
    console.log('Appointment deleted');
  } catch (error) {
    console.error('Error deleting appointment:', error);
  }
};
```

## Complete Component Example

```vue
<script setup lang="ts">
const api = useApi();
const auth = useAuth();

// Reactive state
const doctors = ref([]);
const loading = ref(false);
const error = ref('');

// Get current user info
const userInfo = auth.getUserInfo();
console.log('Current user:', userInfo);

// Fetch data on mount
onMounted(async () => {
  await fetchDoctors();
});

const fetchDoctors = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const response = await api.get('/doctors');
    doctors.value = response.data;
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch doctors';
  } finally {
    loading.value = false;
  }
};

const addDoctor = async (doctorData: any) => {
  try {
    const newDoctor = await api.post('/doctors', doctorData);
    doctors.value.push(newDoctor);
  } catch (err: any) {
    error.value = err.message || 'Failed to add doctor';
  }
};

const updateDoctor = async (id: string, data: any) => {
  try {
    await api.put(`/doctors/${id}`, data);
    await fetchDoctors(); // Refresh list
  } catch (err: any) {
    error.value = err.message || 'Failed to update doctor';
  }
};

const deleteDoctor = async (id: string) => {
  try {
    await api.delete(`/doctors/${id}`);
    doctors.value = doctors.value.filter(d => d.id !== id);
  } catch (err: any) {
    error.value = err.message || 'Failed to delete doctor';
  }
};
</script>

<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>
    
    <div v-for="doctor in doctors" :key="doctor.id">
      {{ doctor.name }}
    </div>
  </div>
</template>
```

## Error Handling

The API service automatically handles:
- **401 Unauthorized**: Clears auth and redirects to login
- **Network errors**: Throws error with message
- **Invalid responses**: Throws error with status

### Custom Error Handling
```typescript
const fetchData = async () => {
  try {
    const data = await api.get('/endpoint');
    return data;
  } catch (error: any) {
    if (error.message.includes('Unauthorized')) {
      // Already handled by API service
    } else if (error.message.includes('404')) {
      console.log('Resource not found');
    } else {
      console.error('Unexpected error:', error);
    }
  }
};
```

## TypeScript Types

Define interfaces for type safety:

```typescript
interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
}

interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// Usage
const fetchDoctors = async () => {
  const response = await api.get<ApiResponse<Doctor[]>>('/doctors');
  return response.data;
};
```

## Environment Configuration

The API base URL is configured in `.env`:

```env
NUXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

For production:
```env
NUXT_PUBLIC_API_BASE_URL=https://api.hellodoc.com
```

## Access Base URL

```typescript
const api = useApi();
console.log('API Base URL:', api.baseURL);
```

## Notes

- All requests automatically include the `Authorization: Bearer <token>` header if user is logged in
- All requests use `Content-Type: application/json` by default
- Token expiration is handled automatically with redirect to login
- The composable is auto-imported in Nuxt 3, no need to import manually
