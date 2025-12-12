import type { IPostRepository } from '@/domain/repositories/post_repository';
import type { Post } from '@/domain/entities/post';
import type { IHttpClient } from '@/data/datasources/http_client';

export class PostRepositoryImpl implements IPostRepository {
  constructor(private client: IHttpClient) {}

  async getAll(): Promise<Post[]> {
    const response = await this.client.get<{ posts: Post[] }>('/post');
    return response.posts;
  }
}
