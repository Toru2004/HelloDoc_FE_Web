import type { IHttpClient, RequestOptions } from './http_client';

export class NuxtHttpClient implements IHttpClient {
    private baseURL: string;
    private auth: any; // Using any for simplicity as we are migrating incrementally

    constructor() {
        const config = useRuntimeConfig();
        this.baseURL = config.public.apiBaseUrl as string;
        this.auth = useAuth();
    }

    private async fetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const token = this.auth.getToken();
        
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>),
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
            // Add accessToken header for admin endpoints
            headers['accessToken'] = token;
        }

        const url = `${this.baseURL}${endpoint}`;

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            if (response.status === 401) {
                this.auth.clearAuth();
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
    }

    async get<T>(url: string, options?: RequestOptions): Promise<T> {
        return this.fetch<T>(url, { ...options, method: 'GET' });
    }

    async post<T>(url: string, data?: any, options?: RequestOptions): Promise<T> {
        return this.fetch<T>(url, {
            ...options,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async put<T>(url: string, data?: any, options?: RequestOptions): Promise<T> {
        return this.fetch<T>(url, {
            ...options,
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async patch<T>(url: string, data?: any, options?: RequestOptions): Promise<T> {
        return this.fetch<T>(url, {
            ...options,
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async delete<T>(url: string, options?: RequestOptions): Promise<T> {
        return this.fetch<T>(url, { ...options, method: 'DELETE' });
    }

    async postFormData<T>(endpoint: string, formData: FormData, options?: RequestOptions): Promise<T> {
        return this.fetchFormData<T>(endpoint, formData, 'POST', options);
    }

    async putFormData<T>(endpoint: string, formData: FormData, options?: RequestOptions): Promise<T> {
        return this.fetchFormData<T>(endpoint, formData, 'PUT', options);
    }

    private async fetchFormData<T>(endpoint: string, formData: FormData, method: string, options: RequestOptions = {}): Promise<T> {
         const token = this.auth.getToken();
        const url = `${this.baseURL}${endpoint}`;

        const headers: Record<string, string> = {
            ...(options.headers as Record<string, string>),
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
            // Add accessToken header for admin endpoints
            headers['accessToken'] = token;
        }

        try {
            const response = await fetch(url, {
                ...options,
                method,
                headers,
                body: formData,
            });

            if (response.status === 401) {
                this.auth.clearAuth();
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
    }
}
