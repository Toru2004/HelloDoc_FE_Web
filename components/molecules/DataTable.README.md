# Reusable DataTable Component

## Tổng quan

Tôi đã tạo một component **DataTable** có thể tái sử dụng cho tất cả các màn hình trong ứng dụng HelloDoc.

## Files đã tạo

### 1. Type Definitions
[`@type/table.d.ts`](file:///d:/Personal_Project/HelloDoc/HelloDoc_FE_Web/@type/table.d.ts)
- `TableColumn<T>` - Định nghĩa cột của bảng
- `TablePagination` - Cấu hình phân trang (sẵn sàng cho tương lai)

### 2. DataTable Component
[`components/molecules/DataTable.vue`](file:///d:/Personal_Project/HelloDoc/HelloDoc_FE_Web/components/molecules/DataTable.vue)

Component chính với các tính năng:
- ✅ Generic type support (TypeScript)
- ✅ Loading state với spinner
- ✅ Empty state với icon tùy chỉnh
- ✅ Customizable columns
- ✅ Slot support cho custom cell rendering
- ✅ Summary footer
- ✅ Responsive design
- ✅ Hover effects

### 3. Example Usage
[`components/organisms/users/UserListNew.vue`](file:///d:/Personal_Project/HelloDoc/HelloDoc_FE_Web/components/organisms/users/UserListNew.vue)

Ví dụ sử dụng DataTable cho UserList.

## Cách sử dụng

### Cơ bản

```vue
<script setup lang="ts">
import DataTable from "@/components/molecules/DataTable.vue";

const columns: TableColumn<User>[] = [
  { key: 'name', label: 'Tên', align: 'left' },
  { key: 'email', label: 'Email', align: 'left' },
  { key: 'role', label: 'Vai trò', align: 'center' },
];

const users = ref<User[]>([]);
const loading = ref(false);
</script>

<template>
  <DataTable
    :columns="columns"
    :data="users"
    :loading="loading"
  />
</template>
```

### Với Custom Cell Rendering

```vue
<template>
  <DataTable :columns="columns" :data="users">
    <!-- Custom render cho cột 'name' -->
    <template #cell-name="{ row, value }">
      <div class="flex items-center gap-2">
        <img :src="row.avatarURL" class="w-8 h-8 rounded-full" />
        <span class="font-semibold">{{ value }}</span>
      </div>
    </template>

    <!-- Custom render cho cột 'role' -->
    <template #cell-role="{ row }">
      <span class="px-2 py-1 rounded-full bg-blue-100 text-blue-800">
        {{ row.role }}
      </span>
    </template>
  </DataTable>
</template>
```

### Với Custom Empty State

```vue
<template>
  <DataTable :columns="columns" :data="users">
    <template #empty>
      <div class="text-center py-12">
        <h3 class="text-lg font-semibold">Chưa có dữ liệu</h3>
        <p class="text-gray-500">Hãy thêm người dùng mới</p>
        <button class="mt-4 btn-primary">Thêm người dùng</button>
      </div>
    </template>
  </DataTable>
</template>
```

### Với Custom Summary

```vue
<template>
  <DataTable :columns="columns" :data="users">
    <template #summary="{ total }">
      <div class="flex justify-between">
        <span>Tổng: {{ total }} người dùng</span>
        <span>Đang hoạt động: {{ activeCount }}</span>
      </div>
    </template>
  </DataTable>
</template>
```

## Props

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `columns` | `TableColumn<T>[]` | **required** | Định nghĩa các cột |
| `data` | `T[]` | **required** | Dữ liệu hiển thị |
| `loading` | `boolean` | `false` | Trạng thái loading |
| `emptyMessage` | `string` | `'Không có dữ liệu'` | Message khi không có data |
| `emptyIcon` | `string` | `'inbox'` | Icon cho empty state (`'inbox'` hoặc `'users'`) |
| `showSummary` | `boolean` | `true` | Hiển thị summary footer |
| `summaryLabel` | `string` | `'Tổng số'` | Label cho summary |
| `keyField` | `string` | `'_id'` | Field dùng làm key cho rows |

## Column Definition

```typescript
type TableColumn<T> = {
  key: string;              // Key của field trong data
  label: string;            // Label hiển thị ở header
  sortable?: boolean;       // Có thể sort (chưa implement)
  width?: string;           // Width của cột (vd: '200px', '20%')
  align?: 'left' | 'center' | 'right';  // Căn chỉnh
  render?: (row: T) => string | number; // Custom render function
}
```

## Slots

| Slot | Props | Mô tả |
|------|-------|-------|
| `cell-{key}` | `{ row, column, value }` | Custom render cho từng cell |
| `empty` | - | Custom empty state |
| `summary` | `{ total }` | Custom summary footer |

## Ví dụ áp dụng cho các màn khác

### DoctorList

```vue
<script setup lang="ts">
const columns: TableColumn<Doctor>[] = [
  { key: 'doctor', label: 'Bác sĩ' },
  { key: 'specialty', label: 'Chuyên khoa' },
  { key: 'patientsCount', label: 'Bệnh nhân', align: 'center' },
  { key: 'verified', label: 'Xác thực', align: 'center' },
];
</script>

<template>
  <DataTable :columns="columns" :data="doctors">
    <template #cell-doctor="{ row }">
      <!-- Custom doctor cell -->
    </template>
  </DataTable>
</template>
```

### ReportList

```vue
<script setup lang="ts">
const columns: TableColumn<Report>[] = [
  { key: 'type', label: 'Loại báo cáo' },
  { key: 'content', label: 'Nội dung' },
  { key: 'reporter', label: 'Người báo cáo' },
  { key: 'status', label: 'Trạng thái' },
];
</script>

<template>
  <DataTable :columns="columns" :data="reports">
    <template #cell-status="{ row }">
      <span :class="getStatusClass(row.status)">
        {{ row.status }}
      </span>
    </template>
  </DataTable>
</template>
```

## Lợi ích

✅ **DRY Principle** - Không lặp lại code  
✅ **Type Safety** - Full TypeScript support với generics  
✅ **Flexible** - Dễ dàng customize với slots  
✅ **Consistent UI** - Giao diện nhất quán  
✅ **Maintainable** - Dễ bảo trì và mở rộng  
✅ **Reusable** - Dùng được cho mọi loại data  

## Tương lai mở rộng

- [ ] Sorting functionality
- [ ] Pagination component
- [ ] Row selection (checkbox)
- [ ] Row actions (edit, delete)
- [ ] Column filtering
- [ ] Export to CSV/Excel
- [ ] Responsive mobile view
