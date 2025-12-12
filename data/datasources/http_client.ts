export interface RequestOptions extends RequestInit {
    params?: Record<string, any>;
}

export interface IHttpClient {
    get<T>(url: string, options?: RequestOptions): Promise<T>;
    post<T>(url: string, data?: any, options?: RequestOptions): Promise<T>;
    put<T>(url: string, data?: any, options?: RequestOptions): Promise<T>;
    patch<T>(url: string, data?: any, options?: RequestOptions): Promise<T>;
    delete<T>(url: string, options?: RequestOptions): Promise<T>;
    postFormData<T>(url: string, formData: FormData, options?: RequestOptions): Promise<T>;
    putFormData<T>(url: string, formData: FormData, options?: RequestOptions): Promise<T>;
    patchFormData<T>(url: string, formData: FormData, options?: RequestOptions): Promise<T>;
}
