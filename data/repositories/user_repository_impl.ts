import type { IUserRepository } from '@/domain/repositories/user_repository';
import type { User, CreateUserDto, UpdateUserDto } from '@/domain/entities/user';
import type { IHttpClient } from '@/data/datasources/http_client';

export class UserRepositoryImpl implements IUserRepository {
  constructor(private client: IHttpClient) {}

  async getAll(): Promise<User[]> {
    return await this.client.get<User[]>('/user');
  }

  async create(userData: CreateUserDto): Promise<User> {
    return await this.client.post<User>('/auth/signup', userData);
  }

  async update(id: string, userData: UpdateUserDto): Promise<User> {
    return await this.client.put<User>(`/user/updateUser/${id}`, userData);
  }
}
