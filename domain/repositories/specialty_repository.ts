import type { Specialty } from '../entities/specialty';
import type { PaginatedResponse } from '../entities/pagination';

export interface ISpecialtyRepository {
  getAll(): Promise<Specialty[]>;
  getAllFiltered(limit: number, offset: number, searchText: string): Promise<PaginatedResponse<Specialty>>;
  create(formData: FormData): Promise<Specialty>;
  update(id: string, formData: FormData): Promise<Specialty>;
  delete(id: string): Promise<void>;
}
