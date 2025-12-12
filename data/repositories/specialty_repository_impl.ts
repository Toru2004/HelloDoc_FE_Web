import type { ISpecialtyRepository } from '@/domain/repositories/specialty_repository';
import type { Specialty } from '@/domain/entities/specialty';
import type { IHttpClient } from '@/data/datasources/http_client';

export class SpecialtyRepositoryImpl implements ISpecialtyRepository {
  constructor(private client: IHttpClient) {}

  async getAll(): Promise<Specialty[]> {
    return await this.client.get<Specialty[]>('/specialty/get-all');
  }

  async create(formData: FormData): Promise<Specialty> {
    return await this.client.postFormData<Specialty>('/specialty/create', formData);
  }

  async update(id: string, formData: FormData): Promise<Specialty> {
    return await this.client.putFormData<Specialty>(`/specialty/${id}`, formData);
  }

  async delete(id: string): Promise<void> {
    await this.client.delete<void>(`/specialty/${id}`);
  }
}
