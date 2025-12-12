import type { News, UpdateNewsDto } from '../entities/news';

export interface INewsRepository {
  getAll(): Promise<News[]>;
  update(id: string, newsData: UpdateNewsDto): Promise<News>;
  delete(id: string): Promise<void>;
}
