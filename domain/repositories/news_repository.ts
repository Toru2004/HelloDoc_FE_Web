import type { News, CreateNewsDto, UpdateNewsDto } from '../entities/news';
import type { PaginatedResponse } from '../entities/pagination';

export interface INewsRepository {
  getAll(): Promise<News[]>;
  getAllFiltered(limit: number, offset: number, searchText: string): Promise<PaginatedResponse<News>>;
  create(newsData: CreateNewsDto): Promise<News>;
  update(id: string, newsData: UpdateNewsDto): Promise<News>;
  delete(id: string): Promise<void>;
}
