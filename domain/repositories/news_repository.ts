import type { News, CreateNewsDto, UpdateNewsDto } from '../entities/news';

export interface INewsRepository {
  getAll(): Promise<News[]>;
  create(newsData: CreateNewsDto): Promise<News>;
  update(id: string, newsData: UpdateNewsDto): Promise<News>;
  delete(id: string): Promise<void>;
}
