<script setup lang="ts">
import { decodeJWT, isAdmin } from "~/utils/jwt";

definePageMeta({
    layout: "auth",
});

const router = useRouter();
const auth = useAuth();
const api = useApi();
const email = ref("");
const password = ref("");
const errorMsg = ref("");
const showPassword = ref(false);
const isLoading = ref(false);

const handleLogin = async () => {
    errorMsg.value = "";
    isLoading.value = true;
    
    try {
        // Call login API using the API service
        const data = await api.login(email.value, password.value);
        
        if (!data.accessToken) {
            errorMsg.value = "Không nhận được token từ server.";
            return;
        }

        // Decode JWT token
        const userInfo = decodeJWT(data.accessToken);
        
        if (!userInfo) {
            errorMsg.value = "Token không hợp lệ.";
            return;
        }

        // Check if user is admin
        if (!isAdmin(data.accessToken)) {
            errorMsg.value = "Tài khoản không phải admin";
            return;
        }

        // Save authentication data
        auth.saveAuth(data.accessToken, userInfo);

        console.log("Đăng nhập thành công:", {
            name: userInfo.name,
            email: userInfo.email,
            role: userInfo.role,
        });

        // Redirect to dashboard
        router.push("/dashboard");
        
    } catch (error: any) {
        console.error("Login error:", error);
        errorMsg.value = error.message || "Sai email, mật khẩu hoặc mất kết nối mạng";
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="flex items-center justify-center min-h-screen px-4 bg-gray-100">
        <div class="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl">
            <div class="mb-6 text-center">
                <h1 class="text-3xl font-bold text-gray-800">HelloDoc Admin</h1>
                <p class="mt-1 text-sm text-gray-500">Đăng nhập để quản lý bãi đỗ xe</p>
            </div>

            <form @submit.prevent="handleLogin" class="space-y-5">
                <div>
                    <label class="block mb-1 text-sm font-medium text-gray-700">Email</label>
                    <input
                        v-model="email"
                        type="email"
                        class="w-full px-4 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="you@example.com"
                        required
                    />
                </div>

                <div>
                    <label class="block mb-1 text-sm font-medium text-gray-700">Mật khẩu</label>
                    <div class="relative">
                        <input
                            :type="showPassword ? 'text' : 'password'"
                            v-model="password"
                            class="w-full px-4 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            class="absolute inset-y-0 flex items-center text-sm text-gray-500 right-3"
                            @click="showPassword = !showPassword"
                        >
                            <Icon v-if="showPassword" name="EyeOff" :size="16" />
                            <Icon v-else name="Eye" :size="16" />
                        </button>
                    </div>
                </div>

                <div v-if="errorMsg" class="text-sm font-medium text-red-600">
                    {{ errorMsg }}
                </div>

                <button
                    type="submit"
                    class="w-full py-2 font-semibold text-white transition duration-200 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center"
                    :disabled="isLoading"
                >
                    <svg
                        v-if="isLoading"
                        class="w-5 h-5 mr-2 text-white animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                        ></circle>
                        <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                    </svg>
                    <span>{{ isLoading ? "Đang đăng nhập..." : "Đăng nhập" }}</span>
                </button>
            </form>

            <div class="mt-6 text-xs text-center text-gray-400">
                © {{ new Date().getFullYear() }} HelloDoc. All rights reserved.
            </div>
        </div>
    </div>
</template>
