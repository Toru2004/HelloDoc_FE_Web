# Cấu trúc thư mục HelloDoc Admin - NuxtJS

## 📁 Tổng quan cấu trúc

```
HelloDoc_FE_Web/
├── .nuxt/                    # Auto-generated build files (không commit)
├── node_modules/             # Dependencies (không commit)
├── public/                   # Static assets
│   └── logo_hellodoc.png    # Logo ứng dụng
├── components/              # Vue components
│   ├── atoms/               # Atomic components (nhỏ nhất)
│   └── organisms/           # Complex components
│       ├── dashboard/       # Dashboard components
│       ├── doctors/         # Doctor management components
│       ├── reports/         # Report management components
│       ├── specialties/     # Specialty management components
│       ├── users/           # User management components
│       ├── SideMenu.vue     # Sidebar navigation
│       └── TopBar.vue       # Top navigation bar
├── composables/             # Reusable composition functions
│   ├── useApi.ts           # API service (HTTP methods)
│   └── useAuth.ts          # Authentication utilities
├── layouts/                 # Page layouts
│   ├── auth.vue            # Layout cho trang login
│   └── default.vue         # Layout mặc định (có sidebar + topbar)
├── middleware/              # Route middleware
│   └── auth.global.ts      # Global auth middleware (JWT validation)
├── pages/                   # File-based routing
│   ├── auth/
│   │   └── login.vue       # Trang đăng nhập
│   ├── dashboard/
│   │   └── index.vue       # Trang dashboard (fetch data)
│   ├── doctors/
│   │   └── index.vue       # Quản lý bác sĩ
│   ├── reports/
│   │   └── index.vue       # Quản lý báo cáo
│   ├── specialties/
│   │   └── index.vue       # Quản lý chuyên khoa
│   ├── users/
│   │   └── index.vue       # Quản lý người dùng
│   └── index.vue           # Root page (redirect to dashboard)
├── utils/                   # Utility functions
│   └── jwt.ts              # JWT decode, validation utilities
├── .env                     # Environment variables (không commit)
├── .env.example            # Template cho .env
├── nuxt.config.ts          # Nuxt configuration
├── package.json            # Dependencies & scripts
├── tsconfig.json           # TypeScript configuration
└── API_USAGE.md            # Hướng dẫn sử dụng API service
```

---

## 📂 Chi tiết từng thư mục

### 1. **`public/`** - Static Assets
Chứa các file tĩnh được serve trực tiếp.

```
public/
├── logo_hellodoc.png       # Logo chính của ứng dụng
├── favicon.ico             # Icon trình duyệt
└── robots.txt              # SEO configuration
```

**Lưu ý:** File trong `public/` được truy cập bằng `/filename` (ví dụ: `/logo_hellodoc.png`)

---

### 2. **`components/`** - Vue Components

#### **Atomic Design Pattern**
Dự án sử dụng Atomic Design để tổ chức components:

```
components/
├── atoms/                  # Components nhỏ nhất, không thể chia nhỏ hơn
│   └── Loading.vue        # Loading spinner
│
└── organisms/             # Components phức tạp, kết hợp nhiều atoms/molecules
    ├── dashboard/
    │   └── Infomation.vue      # Dashboard UI (nhận props từ page)
    │
    ├── doctors/
    │   └── DoctorList.vue      # Bảng danh sách bác sĩ
    │
    ├── reports/
    │   └── ReportList.vue      # Bảng danh sách báo cáo
    │
    ├── specialties/
    │   └── SpecialtyList.vue   # Bảng danh sách chuyên khoa
    │
    ├── users/
    │   └── UserList.vue        # Bảng danh sách người dùng
    │
    ├── SideMenu.vue           # Sidebar navigation với menu items
    └── TopBar.vue             # Top bar với logout button
```

**Quy tắc:**
- **Atoms**: Button, Input, Icon, Badge...
- **Molecules**: SearchBar, Card, FormField...
- **Organisms**: Header, Sidebar, Table, Form...

---

### 3. **`composables/`** - Composition Functions

Chứa các reusable logic sử dụng Composition API.

```
composables/
├── useApi.ts              # API service với HTTP methods
│   ├── get<T>(endpoint)
│   ├── post<T>(endpoint, data)
│   ├── put<T>(endpoint, data)
│   ├── patch<T>(endpoint, data)
│   ├── delete<T>(endpoint)
│   ├── login(email, password)
│   └── logout()
│
└── useAuth.ts             # Authentication utilities
    ├── saveAuth(token, userInfo)
    ├── getToken()
    ├── getUserInfo()
    ├── clearAuth()
    ├── isAuthenticated()
    └── isUserAdmin()
```

**Cách sử dụng:**
```typescript
const api = useApi();
const auth = useAuth();

// Fetch data
const users = await api.get('/user');

// Check auth
if (auth.isAuthenticated()) {
  // ...
}
```

---

### 4. **`layouts/`** - Page Layouts

Định nghĩa layout cho các trang.

```
layouts/
├── auth.vue               # Layout cho trang login (không có sidebar)
└── default.vue            # Layout mặc định (có SideMenu + TopBar)
```

**Sử dụng trong page:**
```typescript
definePageMeta({
  layout: "default" // hoặc "auth"
});
```

---

### 5. **`middleware/`** - Route Middleware

Xử lý logic trước khi render page.

```
middleware/
└── auth.global.ts         # Global middleware cho authentication
    ├── Kiểm tra JWT token
    ├── Validate admin role
    ├── Redirect nếu chưa login
    └── Redirect nếu không phải admin
```

**Flow:**
1. User truy cập route
2. Middleware kiểm tra token trong localStorage
3. Decode JWT và validate
4. Kiểm tra role === "admin"
5. Cho phép truy cập hoặc redirect về `/auth/login`

---

### 6. **`pages/`** - File-based Routing

NuxtJS tự động tạo routes dựa trên cấu trúc file.

```
pages/
├── index.vue                    → /
├── auth/
│   └── login.vue               → /auth/login
├── dashboard/
│   └── index.vue               → /dashboard
├── doctors/
│   └── index.vue               → /doctors
├── reports/
│   └── index.vue               → /reports
├── specialties/
│   └── index.vue               → /specialties
└── users/
    └── index.vue               → /users
```

**Vai trò của mỗi page:**
- **`index.vue`**: Redirect về `/dashboard`
- **`auth/login.vue`**: Đăng nhập, gọi API `/auth/login`
- **`dashboard/index.vue`**: Fetch data từ 4 APIs, truyền props xuống component
- **`doctors/index.vue`**: Fetch `/doctor/get-all`, hiển thị bảng
- **`users/index.vue`**: Fetch `/user`, filter role=User
- **`specialties/index.vue`**: Fetch `/specialty/get-all`
- **`reports/index.vue`**: Fetch `/report`

---

### 7. **`utils/`** - Utility Functions

Chứa các helper functions thuần túy.

```
utils/
└── jwt.ts
    ├── decodeJWT(token)           # Decode JWT token
    ├── isTokenExpired(token)      # Kiểm tra token hết hạn
    └── isAdmin(token)             # Kiểm tra role admin
```

**Ví dụ:**
```typescript
import { decodeJWT, isTokenExpired, isAdmin } from '~/utils/jwt';

const token = 'eyJhbGc...';
const payload = decodeJWT(token);

if (!isTokenExpired(token) && isAdmin(token)) {
  // User is valid admin
}
```

---

## 🔧 Configuration Files

### **`nuxt.config.ts`**
Cấu hình chính của Nuxt app.

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

### **`.env`** (không commit)
```env
NUXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

### **`.env.example`** (commit)
Template cho `.env` file.

---

## 🌐 API Endpoints

Tất cả API được gọi qua `useApi()` composable:

| Endpoint | Method | Mục đích |
|----------|--------|----------|
| `/auth/login` | POST | Đăng nhập, nhận JWT token |
| `/user` | GET | Lấy danh sách users |
| `/doctor/get-all` | GET | Lấy danh sách bác sĩ |
| `/specialty/get-all` | GET | Lấy danh sách chuyên khoa |
| `/report` | GET | Lấy danh sách báo cáo |

---

## 🔐 Authentication Flow

```
1. User nhập email/password → pages/auth/login.vue
2. Call API /auth/login → nhận accessToken (JWT)
3. Decode JWT → lấy user info (name, email, role)
4. Validate role === "admin"
5. Save token + userInfo → localStorage (useAuth.saveAuth)
6. Redirect → /dashboard
7. Mọi request sau → auto inject Authorization header (useApi)
8. Middleware kiểm tra token trước mỗi route
```

---

## 📊 Data Flow Pattern

### **Parent-Child Props Pattern**

```
Page (Data Layer)
  ├── Fetch API
  ├── Process data
  └── Pass props to Component

Component (Presentation Layer)
  ├── Receive props
  ├── Display UI
  └── Emit events (optional)
```

**Ví dụ: Dashboard**
```
pages/dashboard/index.vue
  ├── fetchStats() → gọi 4 APIs
  ├── totalUsers, totalDoctors, ...
  └── <Infomation :total-users="totalUsers" ... />

components/organisms/dashboard/Infomation.vue
  ├── defineProps<Props>()
  ├── Hiển thị stats cards
  └── Hiển thị quick actions
```

---

## 🎨 UI/UX Patterns

### **Color Scheme**
- **Primary**: Blue (#3B82F6)
- **Secondary**: Purple (#A855F7)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Danger**: Red (#EF4444)

### **Component States**
Mọi component list đều có 3 states:
1. **Loading**: Spinner animation
2. **Data**: Hiển thị table/cards
3. **Empty**: "Không có dữ liệu"
4. **Error**: Hiển thị lỗi + nút "Thử lại"

---

## 📝 Naming Conventions

### **Files**
- **Components**: PascalCase (`UserList.vue`, `TopBar.vue`)
- **Pages**: kebab-case (`index.vue`, `login.vue`)
- **Composables**: camelCase với prefix `use` (`useApi.ts`, `useAuth.ts`)
- **Utils**: camelCase (`jwt.ts`)

### **Variables**
- **Refs**: camelCase (`totalUsers`, `loading`)
- **Props**: camelCase (`totalUsers`, `verifiedDoctors`)
- **Functions**: camelCase (`fetchStats`, `handleLogin`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)

### **Routes**
- Plural nouns: `/users`, `/doctors`, `/specialties`, `/reports`
- Singular cho actions: `/auth/login`

---

## 🚀 Development Workflow

### **1. Tạo trang mới**
```bash
# 1. Tạo page
pages/new-feature/index.vue

# 2. Tạo component (nếu cần)
components/organisms/new-feature/FeatureList.vue

# 3. Update sidebar menu
components/organisms/SideMenu.vue
```

### **2. Thêm API mới**
```typescript
// Trong page
const data = await api.get('/new-endpoint');

// Hoặc thêm method vào useApi.ts nếu cần custom logic
```

### **3. Thêm route protection**
Middleware `auth.global.ts` tự động bảo vệ tất cả routes trừ `/auth/login`.

---

## 📚 Best Practices

### **1. Component Organization**
- ✅ Tách logic (page) và UI (component)
- ✅ Sử dụng props để truyền data
- ✅ Emit events cho user actions
- ✅ Keep components focused và reusable

### **2. API Calls**
- ✅ Luôn dùng `useApi()` composable
- ✅ Gọi API ở page level, không ở component
- ✅ Handle loading và error states
- ✅ Type-safe với TypeScript generics

### **3. State Management**
- ✅ Dùng `ref()` cho reactive data
- ✅ Dùng `computed()` cho derived state
- ✅ localStorage cho auth data (qua useAuth)
- ✅ Props cho parent-child communication

### **4. Security**
- ✅ JWT token trong localStorage
- ✅ Auto logout khi token expired
- ✅ Middleware kiểm tra admin role
- ✅ Authorization header tự động inject

---

## 🔍 Troubleshooting

### **Lỗi thường gặp:**

1. **"Cannot read properties of undefined"**
   - ✅ Dùng optional chaining: `user?.name`
   - ✅ Provide fallback: `user?.name || 'N/A'`

2. **"401 Unauthorized"**
   - ✅ Kiểm tra token trong localStorage
   - ✅ Login lại để refresh token

3. **Component không nhận props**
   - ✅ Kiểm tra kebab-case trong template: `:total-users="totalUsers"`
   - ✅ Kiểm tra camelCase trong props: `totalUsers: number`

4. **Route không được protect**
   - ✅ Kiểm tra middleware `auth.global.ts`
   - ✅ Thêm route vào whitelist nếu cần

---

## 📖 Tài liệu tham khảo

- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)
- [API_USAGE.md](./API_USAGE.md) - Chi tiết về useApi composable

---

**Cập nhật lần cuối:** 06/12/2025
**Phiên bản:** 1.0.0
