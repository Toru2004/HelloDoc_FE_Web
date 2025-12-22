import type { User, CreateUserDto, UpdateUserDto } from '../entities/user';
import type { PaginatedResponse } from '../entities/pagination';

export interface IUserRepository {
  getAll(): Promise<User[]>;
  getAllFiltered(limit: number, offset: number, searchText: string): Promise<PaginatedResponse<User>>;
  create(userData: CreateUserDto): Promise<User>;
  update(id: string, userData: UpdateUserDto): Promise<User>;
  delete(id: string): Promise<void>;
  reactivate(id: string): Promise<void>;
}
