import type { News } from '../entities/news';

export interface INewsRepository {
  getAll(): Promise<News[]>;
  delete(id: string): Promise<void>;
}
