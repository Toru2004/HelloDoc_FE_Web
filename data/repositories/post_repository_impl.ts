import type { IPostRepository } from '@/domain/repositories/post_repository';
import type { Post } from '@/domain/entities/post';
import type { IHttpClient } from '@/data/datasources/http_client';
import type { PaginatedResponse } from '@/domain/entities/pagination';

export class PostRepositoryImpl implements IPostRepository {
  constructor(private client: IHttpClient) {}

  async getAll(): Promise<Post[]> {
    const response = await this.client.get<{ posts: Post[] }>('/post');
    return response.posts;
  }

  async getAllFiltered(limit: number, offset: number, searchText: string): Promise<PaginatedResponse<Post>> {
    return await this.client.get<PaginatedResponse<Post>>(`/post/get-all-filtered?limit=${limit}&offset=${offset}&searchText=${searchText}`);
  }

  async delete(id: string): Promise<void> {
    return await this.client.delete<void>(`/post/${id}`);
  }
}
