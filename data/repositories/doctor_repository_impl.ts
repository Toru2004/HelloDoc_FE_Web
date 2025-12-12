import type { IDoctorRepository } from '@/domain/repositories/doctor_repository';
import type { Doctor } from '@/domain/entities/doctor';
import type { IHttpClient } from '@/data/datasources/http_client';

export class DoctorRepositoryImpl implements IDoctorRepository {
  constructor(private client: IHttpClient) {}

  async getAll(): Promise<Doctor[]> {
    return await this.client.get<Doctor[]>('/doctor/get-all');
  }
}
