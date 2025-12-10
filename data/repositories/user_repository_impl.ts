import type { IUserRepository } from '@/domain/repositories/user_repository';
import type { User } from '@/domain/entities/user';
import type { IHttpClient } from '@/data/datasources/http_client';

export class UserRepositoryImpl implements IUserRepository {
  constructor(private client: IHttpClient) {}

  async getAll(): Promise<User[]> {
    return await this.client.get<User[]>('/user');
  }
}
