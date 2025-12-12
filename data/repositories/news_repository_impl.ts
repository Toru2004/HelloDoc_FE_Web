import type { INewsRepository } from '@/domain/repositories/news_repository';
import type { News } from '@/domain/entities/news';
import type { IHttpClient } from '@/data/datasources/http_client';

export class NewsRepositoryImpl implements INewsRepository {
  constructor(private client: IHttpClient) {}

  async getAll(): Promise<News[]> {
    return await this.client.get<News[]>('/news');
  }

  async delete(id: string): Promise<void> {
    return await this.client.delete<void>(`/news/${id}`);
  }
}
