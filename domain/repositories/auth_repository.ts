export interface AuthResponse {
    accessToken: string;
    message: string;
    error?: string;
}

export interface IAuthRepository {
    login(email: string, password: string): Promise<AuthResponse>;
}
