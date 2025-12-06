<script setup lang="ts">
import { toast } from "vue3-toastify";

interface Props {
    isModalOpen: boolean;
    loading: boolean;
}
const props = defineProps<Props>();
const emit = defineEmits<{
    (e: "update:isModalOpen", value: boolean): void;
    (e: "create", user: UserCreate): void;
}>();

const newUser = ref<UserCreate>({
    ten: "",
    biensoxe: "",
    biensophu: {
        bienSo: "",
        createdAt: 0,
        ngayHetHan: 0,
    },
    email: "",
    cccd: "",
    role: "user",
    password: "",
});

const handleClose = () => {
    emit("update:isModalOpen", false);
};

const submitForm = () => {
    console.log("Dữ liệu mới:", newUser.value);
    // Validation
    if (
        !newUser.value.ten.trim() ||
        !newUser.value.biensoxe.trim() ||
        !newUser.value.email.trim() ||
        !newUser.value.cccd.trim()
    ) {
        toast.error("Vui lòng nhập đầy đủ thông tin"); // hoặc alert nếu không dùng toast
        return;
    }

    // Email định dạng cơ bản (tùy chọn)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.value.email)) {
        toast.error("Email không hợp lệ");
        return;
    }
    emit("create", { ...newUser.value });

    newUser.value = {
        ten: "",
        biensoxe: "",
        biensophu: {
            bienSo: "",
            createdAt: 0,
            ngayHetHan: 0,
        },
        email: "",
        cccd: "",
        role: "user",
        password: "",
    };
    emit("update:isModalOpen", false);
};
</script>
<template>
    <div v-if="isModalOpen" class="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
        <!-- Nội dung form -->
        <div class="bg-white rounded shadow-lg w-[400px] p-6 relative z-50">
            <h2 class="mb-4 text-xl font-semibold">Thêm người đăng ký</h2>

            <!-- Form đơn giản -->
            <form @submit.prevent="submitForm">
                <div class="mb-3">
                    <label class="block mb-1 font-medium">Tên</label>
                    <input type="text" class="w-full px-3 py-2 border rounded" v-model="newUser.ten" />
                </div>
                <div class="mb-3">
                    <label class="block mb-1 font-medium">Biển số xe</label>
                    <input type="text" class="w-full px-3 py-2 border rounded" v-model="newUser.biensoxe" />
                </div>
                <div class="mb-3">
                    <label class="block mb-1 font-medium">Email</label>
                    <input type="email" class="w-full px-3 py-2 border rounded" v-model="newUser.email" />
                </div>
                <div class="mb-4">
                    <label class="block mb-1 font-medium">CCCD</label>
                    <input type="text" class="w-full px-3 py-2 border rounded" v-model="newUser.cccd" />
                </div>
                <div class="mb-4">
                    <label class="block mb-1 font-medium">Mật khẩu</label>
                    <input
                        type="password"
                        class="w-full px-3 py-2 border rounded"
                        v-model="newUser.password"
                        placeholder="Nhập mật khẩu"
                    />
                </div>
                <!-- Nút hành động -->
                <div class="flex justify-end space-x-2">
                    <button type="button" class="px-4 py-2 border rounded" @click="handleClose">Hủy</button>
                    <button v-if="loading" type="submit" class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                        Đang tạo...
                    </button>
                    <button v-else type="submit" class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">Tạo</button>
                </div>
            </form>
        </div>
    </div>
</template>
