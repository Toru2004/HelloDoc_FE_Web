import type { Post } from '../entities/post';
import type { PaginatedResponse } from '../entities/pagination';

export interface IPostRepository {
  getAll(): Promise<Post[]>;
  getAllFiltered(limit: number, offset: number, searchText: string): Promise<PaginatedResponse<Post>>;
  delete(id: string): Promise<void>;
}
