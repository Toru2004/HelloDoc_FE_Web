import type { INewsRepository } from '@/domain/repositories/news_repository';
import type { News, CreateNewsDto, UpdateNewsDto } from '@/domain/entities/news';
import type { IHttpClient } from '@/data/datasources/http_client';

export class NewsRepositoryImpl implements INewsRepository {
  constructor(private client: IHttpClient) {}

  async getAll(): Promise<News[]> {
    return await this.client.get<News[]>('/news');
  }

  async create(newsData: CreateNewsDto): Promise<News> {
    const formData = new FormData();
    
    formData.append('adminId', newsData.adminId);
    formData.append('title', newsData.title);
    formData.append('content', newsData.content);
    
    if (newsData.images && newsData.images.length > 0) {
      newsData.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    return await this.client.postFormData<News>('/news/create', formData);
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
