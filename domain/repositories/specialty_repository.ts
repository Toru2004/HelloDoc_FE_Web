import type { Specialty } from '../entities/specialty';

export interface ISpecialtyRepository {
  getAll(): Promise<Specialty[]>;
  create(formData: FormData): Promise<Specialty>;
  update(id: string, formData: FormData): Promise<Specialty>;
}
