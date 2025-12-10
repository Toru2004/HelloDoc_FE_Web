import type { User } from '../entities/user';

export interface ISpecialtyRepository {
  // Existing methods... (This file is just for context, I won't write this one as it exists)
}

export interface IUserRepository {
  getAll(): Promise<User[]>;
}
