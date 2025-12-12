import type { Post } from '../entities/post';

export interface IPostRepository {
  getAll(): Promise<Post[]>;
  delete(id: string): Promise<void>;
}
