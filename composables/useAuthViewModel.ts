import { NuxtHttpClient } from '@/data/datasources/nuxt_http_client';
import { AuthRepositoryImpl } from '@/data/repositories/auth_repository_impl';
import { decodeJWT, isAdmin } from "../utils/jwt";
import type { AuthResponse } from '@/domain/repositories/auth_repository';


// We still need useAuth for local storage management, 
// likely we can inject it or use it inside ViewModel.
// For now, let's stick to using it as a helper inside VM.

export const useAuthViewModel = () => {
    const client = new NuxtHttpClient();
    const repository = new AuthRepositoryImpl(client);
    const auth = useAuth(); // Existing composable for LocalStorage
    const router = useRouter();

    const email = ref("");
    const password = ref("");
    const errorMsg = ref("");
    const showPassword = ref(false);
    const isLoading = ref(false);

    const handleLogin = async () => {
        errorMsg.value = "";
        isLoading.value = true;
        
        try {
            const data = await repository.login(email.value, password.value);
            
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

    return {
        email,
        password,
        errorMsg,
        showPassword,
        isLoading,
        handleLogin
    };
};
