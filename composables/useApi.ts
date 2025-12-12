/**
 * API Service Composable
 * Provides reusable HTTP methods with automatic token injection
 */

export const useApi = () => {
    const config = useRuntimeConfig();
    const auth = useAuth();
    const baseURL = config.public.apiBaseUrl as string;

    /**
     * Generic fetch wrapper with automatic token injection
     */
    const apiFetch = async <T = any>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> => {
        const token = auth.getToken();
        
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>),
        };

        // Add authorization header if token exists
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const url = `${baseURL}${endpoint}`;

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            // Handle unauthorized responses
            if (response.status === 401) {
                auth.clearAuth();
                navigateTo('/auth/login');
                throw new Error('Unauthorized - Token expired or invalid');
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    };

    /**
     * GET request
     */
    const get = <T = any>(endpoint: string, options?: RequestInit): Promise<T> => {
        return apiFetch<T>(endpoint, {
            ...options,
            method: 'GET',
        });
    };

    /**
     * POST request
     */
    const post = <T = any>(
        endpoint: string,
        data?: any,
        options?: RequestInit
    ): Promise<T> => {
        return apiFetch<T>(endpoint, {
            ...options,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    };

    /**
     * PUT request
     */
    const put = <T = any>(
        endpoint: string,
        data?: any,
        options?: RequestInit
    ): Promise<T> => {
        return apiFetch<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    };

    /**
     * PATCH request
     */
    const patch = <T = any>(
        endpoint: string,
        data?: any,
        options?: RequestInit
    ): Promise<T> => {
        return apiFetch<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
        });
    };

    /**
     * DELETE request
     */
    const del = <T = any>(endpoint: string, options?: RequestInit): Promise<T> => {
        return apiFetch<T>(endpoint, {
            ...options,
            method: 'DELETE',
        });
    };

    /**
     * POST request with FormData (for file uploads)
     */
    const postFormData = async <T = any>(
        endpoint: string,
        formData: FormData,
        options?: RequestInit
    ): Promise<T> => {
        const token = auth.getToken();
        const url = `${baseURL}${endpoint}`;

        const headers: Record<string, string> = {
            ...(options?.headers as Record<string, string>),
        };

        // Add authorization header if token exists
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Don't set Content-Type - let browser set it with boundary for FormData

        try {
            const response = await fetch(url, {
                ...options,
                method: 'POST',
                headers,
                body: formData,
            });

            // Handle unauthorized responses
            if (response.status === 401) {
                auth.clearAuth();
                navigateTo('/auth/login');
                throw new Error('Unauthorized - Token expired or invalid');
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    };

    /**
     * PUT request with FormData (for file uploads)
     */
    const putFormData = async <T = any>(
        endpoint: string,
        formData: FormData,
        options?: RequestInit
    ): Promise<T> => {
        const token = auth.getToken();
        const url = `${baseURL}${endpoint}`;

        const headers: Record<string, string> = {
            ...(options?.headers as Record<string, string>),
        };

        // Add authorization header if token exists
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Don't set Content-Type - let browser set it with boundary for FormData

        try {
            const response = await fetch(url, {
                ...options,
                method: 'PUT',
                headers,
                body: formData,
            });

            // Handle unauthorized responses
            if (response.status === 401) {
                auth.clearAuth();
                navigateTo('/auth/login');
                throw new Error('Unauthorized - Token expired or invalid');
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    };

    /**
     * Login method
     */
    const login = async (email: string, password: string) => {
        const response = await post<{ accessToken: string; message: string }>(
            '/auth/login',
            { email, password }
        );
        return response;
    };

    /**
     * Logout method
     */
    const logout = () => {
        auth.clearAuth();
        navigateTo('/auth/login');
    };

    return {
        get,
        post,
        put,
        patch,
        delete: del,
        postFormData,
        putFormData,
        login,
        logout,
        baseURL,
    };
};
