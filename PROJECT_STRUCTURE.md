# Cấu trúc thư mục HelloDoc Admin - Clean Architecture

## 📁 Tổng quan cấu trúc

```
HelloDoc_FE_Web/
├── .nuxt/                    # Auto-generated build files (không commit)
├── node_modules/             # Dependencies (không commit)
├── public/                   # Static assets
│   └── logo_hellodoc.png    # Logo ứng dụng
│
├── domain/                   # 🔵 DOMAIN LAYER - Business Logic
│   ├── entities/            # Business entities (models)
│   │   ├── user.ts
│   │   ├── doctor.ts
│   │   └── specialty.ts
│   └── repositories/        # Repository interfaces (contracts)
│       ├── auth_repository.ts
│       ├── user_repository.ts
│       ├── doctor_repository.ts
│       └── specialty_repository.ts
│
├── data/                     # 🟢 DATA LAYER - Implementation
│   ├── datasources/         # HTTP clients & data sources
│   │   ├── http_client.ts          # Interface định nghĩa HTTP methods
│   │   └── nuxt_http_client.ts     # Implementation với $fetch
│   └── repositories/        # Repository implementations
│       ├── auth_repository_impl.ts
│       ├── user_repository_impl.ts
│       ├── doctor_repository_impl.ts
│       └── specialty_repository_impl.ts
│
├── composables/              # 🟡 PRESENTATION LAYER - ViewModels
│   ├── useAuthViewModel.ts        # Auth logic + state
│   ├── useUserViewModel.ts        # User management logic
│   ├── useDoctorViewModel.ts      # Doctor management logic
│   ├── useSpecialtyViewModel.ts   # Specialty management logic
│   ├── useAuth.ts                 # Auth utilities (localStorage)
│   └── useApi.ts                  # Legacy API service (đang migrate)
│
├── components/              # Vue components (Presentation)
│   ├── atoms/               # Atomic components
│   │   └── Loading.vue
│   └── organisms/           # Complex components
│       ├── dashboard/
│       ├── doctors/
│       ├── specialties/
│       ├── users/
│       ├── SideMenu.vue
│       └── TopBar.vue
│
├── pages/                   # File-based routing
│   ├── auth/login.vue
│   ├── dashboard/index.vue
│   ├── doctors/index.vue
│   ├── specialties/index.vue
│   ├── users/index.vue
│   └── index.vue
│
├── layouts/                 # Page layouts
│   ├── auth.vue
│   └── default.vue
│
├── middleware/              # Route middleware
│   └── auth.global.ts
│
├── utils/                   # Utility functions
│   └── jwt.ts
│
├── .env                     # Environment variables
├── nuxt.config.ts          # Nuxt configuration
├── package.json            # Dependencies
└── tsconfig.json           # TypeScript config
```

---

## 🏗️ Clean Architecture - 3 Layers

### **Nguyên tắc phân tầng:**
```
┌─────────────────────────────────────┐
│   PRESENTATION LAYER (ViewModels)  │  ← UI Logic, State Management
│   composables/, pages/, components │
└──────────────┬──────────────────────┘
               │ depends on
┌──────────────▼──────────────────────┐
│      DATA LAYER (Implementations)   │  ← API calls, HTTP clients
│   data/datasources, data/repos     │
└──────────────┬──────────────────────┘
               │ implements
┌──────────────▼──────────────────────┐
│     DOMAIN LAYER (Contracts)        │  ← Business rules, Interfaces
│   domain/entities, domain/repos    │
└─────────────────────────────────────┘
```

**Dependency Rule:**
- Presentation → Data → Domain
- Domain layer **KHÔNG** phụ thuộc vào bất kỳ layer nào
- Data layer chỉ phụ thuộc vào Domain
- Presentation layer phụ thuộc vào cả Data và Domain

---

## 📂 Chi tiết từng Layer

### 🔵 **1. DOMAIN LAYER** - Business Logic Core

#### **`domain/entities/`** - Business Entities
Định nghĩa các model thuần túy, không phụ thuộc framework.

```typescript
// domain/entities/user.ts
export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  avatarURL?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}
```

**Cấu trúc:**
```
domain/entities/
├── user.ts          # User entity
├── doctor.ts        # Doctor entity (extends User)
└── specialty.ts     # Specialty entity
```

#### **`domain/repositories/`** - Repository Interfaces
Định nghĩa **contracts** (interface) cho các repository.

```typescript
// domain/repositories/user_repository.ts
import type { User } from '../entities/user';

export interface IUserRepository {
  getAll(): Promise<User[]>;
  getById(id: string): Promise<User>;
  create(user: User): Promise<User>;
  update(id: string, user: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}
```

**Cấu trúc:**
```
domain/repositories/
├── auth_repository.ts       # Authentication contract
├── user_repository.ts       # User CRUD contract
├── doctor_repository.ts     # Doctor CRUD contract
└── specialty_repository.ts  # Specialty CRUD contract
```

**Lợi ích:**
- ✅ Tách biệt business logic khỏi implementation
- ✅ Dễ dàng mock cho testing
- ✅ Có thể swap implementation (REST API → GraphQL)

---

### 🟢 **2. DATA LAYER** - Implementation

#### **`data/datasources/`** - HTTP Clients

**`http_client.ts`** - Interface cho HTTP operations:
```typescript
export interface IHttpClient {
  get<T>(url: string, options?: RequestOptions): Promise<T>;
  post<T>(url: string, data?: any, options?: RequestOptions): Promise<T>;
  put<T>(url: string, data?: any, options?: RequestOptions): Promise<T>;
  patch<T>(url: string, data?: any, options?: RequestOptions): Promise<T>;
  delete<T>(url: string, options?: RequestOptions): Promise<T>;
  postFormData<T>(url: string, formData: FormData): Promise<T>;
}
```

**`nuxt_http_client.ts`** - Implementation với Nuxt `$fetch`:
```typescript
export class NuxtHttpClient implements IHttpClient {
  private baseURL: string;
  
  async get<T>(url: string, options?: RequestOptions): Promise<T> {
    return await $fetch<T>(url, {
      baseURL: this.baseURL,
      method: 'GET',
      headers: this.getHeaders(),
      ...options
    });
  }
  // ... other methods
}
```

**Cấu trúc:**
```
data/datasources/
├── http_client.ts         # Interface
└── nuxt_http_client.ts    # Nuxt implementation
```

#### **`data/repositories/`** - Repository Implementations

Implement các interface từ `domain/repositories/`.

```typescript
// data/repositories/user_repository_impl.ts
import type { IUserRepository } from '@/domain/repositories/user_repository';
import type { User } from '@/domain/entities/user';
import type { IHttpClient } from '@/data/datasources/http_client';

export class UserRepositoryImpl implements IUserRepository {
  constructor(private client: IHttpClient) {}

  async getAll(): Promise<User[]> {
    return await this.client.get<User[]>('/user');
  }

  async getById(id: string): Promise<User> {
    return await this.client.get<User>(`/user/${id}`);
  }
  
  // ... other methods
}
```

**Cấu trúc:**
```
data/repositories/
├── auth_repository_impl.ts       # Auth implementation
├── user_repository_impl.ts       # User CRUD implementation
├── doctor_repository_impl.ts     # Doctor CRUD implementation
└── specialty_repository_impl.ts  # Specialty CRUD implementation
```

**Lợi ích:**
- ✅ Tách biệt HTTP logic khỏi business logic
- ✅ Dễ dàng test với mock HTTP client
- ✅ Có thể thay đổi data source (API → Local Storage)

---

### 🟡 **3. PRESENTATION LAYER** - ViewModels & UI

#### **`composables/`** - ViewModels

ViewModels quản lý state và logic cho UI, sử dụng repositories.

```typescript
// composables/useAuthViewModel.ts
import { NuxtHttpClient } from '@/data/datasources/nuxt_http_client';
import { AuthRepositoryImpl } from '@/data/repositories/auth_repository_impl';

export const useAuthViewModel = () => {
  // 1. Setup dependencies
  const client = new NuxtHttpClient();
  const repository = new AuthRepositoryImpl(client);
  const auth = useAuth(); // localStorage helper
  const router = useRouter();

  // 2. State
  const email = ref("");
  const password = ref("");
  const errorMsg = ref("");
  const isLoading = ref(false);

  // 3. Actions
  const handleLogin = async () => {
    isLoading.value = true;
    try {
      const data = await repository.login(email.value, password.value);
      
      // Validate & save auth
      const userInfo = decodeJWT(data.accessToken);
      if (!isAdmin(data.accessToken)) {
        errorMsg.value = "Tài khoản không phải admin";
        return;
      }
      
      auth.saveAuth(data.accessToken, userInfo);
      router.push("/dashboard");
      
    } catch (error: any) {
      errorMsg.value = error.message || "Đăng nhập thất bại";
    } finally {
      isLoading.value = false;
    }
  };

  // 4. Return state & actions
  return {
    email,
    password,
    errorMsg,
    isLoading,
    handleLogin
  };
};
```

**Cấu trúc:**
```
composables/
├── useAuthViewModel.ts        # Auth state + login logic
├── useUserViewModel.ts        # User list + CRUD logic
├── useDoctorViewModel.ts      # Doctor list + CRUD logic
├── useSpecialtyViewModel.ts   # Specialty list + CRUD logic
├── useAuth.ts                 # Auth utilities (localStorage)
└── useApi.ts                  # Legacy (đang migrate sang Clean Arch)
```

**Pattern sử dụng trong Page:**
```vue
<!-- pages/auth/login.vue -->
<script setup lang="ts">
const {
  email,
  password,
  errorMsg,
  isLoading,
  handleLogin
} = useAuthViewModel();
</script>

<template>
  <form @submit.prevent="handleLogin">
    <input v-model="email" type="email" />
    <input v-model="password" type="password" />
    <button :disabled="isLoading">Đăng nhập</button>
    <p v-if="errorMsg">{{ errorMsg }}</p>
  </form>
</template>
```

#### **`pages/`** - File-based Routing

Pages chỉ làm nhiệm vụ:
1. Gọi ViewModel
2. Render UI components
3. Pass data xuống components

```
pages/
├── index.vue                    → /
├── auth/login.vue              → /auth/login
├── dashboard/index.vue         → /dashboard
├── doctors/index.vue           → /doctors
├── specialties/index.vue       → /specialties
└── users/index.vue             → /users
```

#### **`components/`** - Presentation Components

Sử dụng **Atomic Design Pattern**:

```
components/
├── atoms/                  # Nhỏ nhất, không chia nhỏ hơn
│   └── Loading.vue
│
└── organisms/             # Components phức tạp
    ├── dashboard/
    │   └── Infomation.vue
    ├── doctors/
    │   └── DoctorList.vue
    ├── specialties/
    │   └── SpecialtyList.vue
    ├── users/
    │   └── UserList.vue
    ├── SideMenu.vue
    └── TopBar.vue
```

---

## 🔄 Data Flow trong Clean Architecture

### **Luồng dữ liệu hoàn chỉnh:**

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USER ACTION                                              │
│    pages/auth/login.vue                                     │
│    User clicks "Đăng nhập"                                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. VIEWMODEL (Presentation Layer)                           │
│    composables/useAuthViewModel.ts                          │
│    handleLogin() → validate input                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. REPOSITORY IMPLEMENTATION (Data Layer)                   │
│    data/repositories/auth_repository_impl.ts                │
│    login(email, password) → call HTTP client                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. HTTP CLIENT (Data Layer)                                 │
│    data/datasources/nuxt_http_client.ts                     │
│    POST /auth/login → API call                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. BACKEND API                                              │
│    Returns: { accessToken: "..." }                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. RESPONSE FLOWS BACK                                      │
│    HTTP Client → Repository → ViewModel                     │
│    ViewModel processes: decode JWT, validate admin          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. UPDATE UI STATE                                          │
│    ViewModel updates: isLoading, errorMsg                   │
│    Page re-renders automatically (Vue reactivity)           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Ví dụ thực tế: Feature "Quản lý Chuyên khoa"

### **1. Domain Layer**

```typescript
// domain/entities/specialty.ts
export interface Specialty {
  _id: string;
  name: string;
  description: string;
  imageURL?: string;
}

// domain/repositories/specialty_repository.ts
export interface ISpecialtyRepository {
  getAll(): Promise<Specialty[]>;
  create(specialty: Specialty): Promise<Specialty>;
  update(id: string, specialty: Partial<Specialty>): Promise<Specialty>;
  delete(id: string): Promise<void>;
}
```

### **2. Data Layer**

```typescript
// data/repositories/specialty_repository_impl.ts
export class SpecialtyRepositoryImpl implements ISpecialtyRepository {
  constructor(private client: IHttpClient) {}

  async getAll(): Promise<Specialty[]> {
    return await this.client.get<Specialty[]>('/specialty/get-all');
  }

  async create(specialty: Specialty): Promise<Specialty> {
    return await this.client.post<Specialty>('/specialty', specialty);
  }
  
  // ... other methods
}
```

### **3. Presentation Layer**

```typescript
// composables/useSpecialtyViewModel.ts
export const useSpecialtyViewModel = () => {
  const client = new NuxtHttpClient();
  const repository = new SpecialtyRepositoryImpl(client);

  const specialties = ref<Specialty[]>([]);
  const isLoading = ref(false);
  const error = ref("");

  const fetchSpecialties = async () => {
    isLoading.value = true;
    try {
      specialties.value = await repository.getAll();
    } catch (e: any) {
      error.value = e.message;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    specialties,
    isLoading,
    error,
    fetchSpecialties
  };
};
```

```vue
<!-- pages/specialties/index.vue -->
<script setup lang="ts">
const { specialties, isLoading, fetchSpecialties } = useSpecialtyViewModel();

onMounted(() => {
  fetchSpecialties();
});
</script>

<template>
  <div>
    <Loading v-if="isLoading" />
    <SpecialtyList v-else :specialties="specialties" />
  </div>
</template>
```

---

## 🔧 Configuration Files

### **`nuxt.config.ts`**
```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'
    }
  },
  // ... other configs
});
```

### **`.env`**
```env
NUXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

---

## 🌐 API Endpoints

| Endpoint | Method | Repository |
|----------|--------|------------|
| `/auth/login` | POST | AuthRepository |
| `/user` | GET | UserRepository |
| `/doctor/get-all` | GET | DoctorRepository |
| `/specialty/get-all` | GET | SpecialtyRepository |
| `/report` | GET | ReportRepository |

---

## 📝 Naming Conventions

### **Files**
- **Entities**: `user.ts`, `doctor.ts` (lowercase)
- **Repository Interfaces**: `user_repository.ts` (snake_case)
- **Repository Implementations**: `user_repository_impl.ts` (snake_case + _impl)
- **ViewModels**: `useUserViewModel.ts` (camelCase + use prefix)
- **Components**: `UserList.vue` (PascalCase)

### **Classes & Interfaces**
- **Interfaces**: `IUserRepository`, `IHttpClient` (I prefix)
- **Classes**: `UserRepositoryImpl`, `NuxtHttpClient` (PascalCase)
- **Entities**: `User`, `Doctor` (PascalCase)

---

## 🚀 Development Workflow

### **Thêm feature mới (ví dụ: Reports)**

#### **Bước 1: Domain Layer**
```bash
# 1. Tạo entity
domain/entities/report.ts

# 2. Tạo repository interface
domain/repositories/report_repository.ts
```

#### **Bước 2: Data Layer**
```bash
# 3. Tạo repository implementation
data/repositories/report_repository_impl.ts
```

#### **Bước 3: Presentation Layer**
```bash
# 4. Tạo ViewModel
composables/useReportViewModel.ts

# 5. Tạo page
pages/reports/index.vue

# 6. Tạo component (nếu cần)
components/organisms/reports/ReportList.vue
```

#### **Bước 4: Update Navigation**
```bash
# 7. Update sidebar menu
components/organisms/SideMenu.vue
```

---

## 📚 Best Practices

### **1. Dependency Injection**
- ✅ ViewModel tạo instance của Repository
- ✅ Repository nhận HttpClient qua constructor
- ✅ Dễ dàng mock cho testing

### **2. Single Responsibility**
- ✅ Entity: chỉ chứa data structure
- ✅ Repository: chỉ handle data operations
- ✅ ViewModel: chỉ handle UI logic + state
- ✅ Component: chỉ render UI

### **3. Type Safety**
- ✅ Sử dụng TypeScript interfaces
- ✅ Generic types cho HTTP methods
- ✅ Strict type checking

### **4. Error Handling**
- ✅ Repository throw errors
- ✅ ViewModel catch và xử lý
- ✅ UI hiển thị error messages

### **5. State Management**
- ✅ ViewModel quản lý local state
- ✅ Pinia/Store cho global state (nếu cần)
- ✅ localStorage cho persistence (auth)

---

## 🔍 Troubleshooting

### **1. "Cannot find module '@/domain/...'"**
- ✅ Kiểm tra `tsconfig.json` có alias `@` chưa
- ✅ Restart TypeScript server

### **2. "Repository is not defined"**
- ✅ Kiểm tra import path
- ✅ Đảm bảo đã export class/interface

### **3. "HTTP Client error"**
- ✅ Kiểm tra `NUXT_PUBLIC_API_BASE_URL` trong `.env`
- ✅ Kiểm tra token trong localStorage
- ✅ Xem network tab trong DevTools

---

## 📖 Tài liệu tham khảo

- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

---

## 🎓 Migration Status

### **✅ Đã migrate sang Clean Architecture:**
- Auth (login)
- Users
- Doctors
- Specialties

### **⏳ Đang sử dụng legacy `useApi()`:**
- Dashboard
- Reports

### **📋 TODO:**
- Migrate Dashboard sang ViewModel
- Migrate Reports sang ViewModel
- Thêm unit tests cho repositories
- Thêm integration tests cho ViewModels

---

**Cập nhật lần cuối:** 12/12/2025
**Phiên bản:** 2.0.0 (Clean Architecture)
