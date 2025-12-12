import type { INewsRepository } from '@/domain/repositories/news_repository';
import type { News, UpdateNewsDto } from '@/domain/entities/news';
import type { IHttpClient } from '@/data/datasources/http_client';

export class NewsRepositoryImpl implements INewsRepository {
  constructor(private client: IHttpClient) {}

  async getAll(): Promise<News[]> {
    return await this.client.get<News[]>('/news');
  }

  async update(id: string, newsData: UpdateNewsDto): Promise<News> {
    const formData = new FormData();
    
    if (newsData.title) {
      formData.append('title', newsData.title);
    }
    
    if (newsData.content) {
      formData.append('content', newsData.content);
    }
    
    if (newsData.images && newsData.images.length > 0) {
      newsData.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    return await this.client.patchFormData<News>(`/news/${id}`, formData);
  }

  async delete(id: string): Promise<void> {
    return await this.client.delete<void>(`/news/${id}`);
  }
}
