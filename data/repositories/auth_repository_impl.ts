import type { IAuthRepository, AuthResponse } from '@/domain/repositories/auth_repository';
import type { IHttpClient } from '@/data/datasources/http_client';

export class AuthRepositoryImpl implements IAuthRepository {
    constructor(private client: IHttpClient) {}

    async login(email: string, password: string): Promise<AuthResponse> {
        return await this.client.post<AuthResponse>('/auth/login', { email, password });
    }
}
