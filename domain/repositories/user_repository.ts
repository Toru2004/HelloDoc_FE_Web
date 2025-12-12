import type { User, CreateUserDto, UpdateUserDto } from '../entities/user';

export interface ISpecialtyRepository {
  // Existing methods... (This file is just for context, I won't write this one as it exists)
}

export interface IUserRepository {
  getAll(): Promise<User[]>;
  create(userData: CreateUserDto): Promise<User>;
  update(id: string, userData: UpdateUserDto): Promise<User>;
  delete(id: string): Promise<void>;
}
