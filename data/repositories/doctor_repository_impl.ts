import type { IDoctorRepository } from '@/domain/repositories/doctor_repository';
import type { Doctor } from '@/domain/entities/doctor';
import type { PendingDoctor } from '@/domain/entities/pending_doctor';
import type { IHttpClient } from '@/data/datasources/http_client';

export class DoctorRepositoryImpl implements IDoctorRepository {
  constructor(private client: IHttpClient) {}

  async getAll(): Promise<Doctor[]> {
    return await this.client.get<Doctor[]>('/doctor/get-all');
  }

  async getPendingDoctors(): Promise<PendingDoctor[]> {
    return await this.client.get<PendingDoctor[]>('/doctor/get-pending-doctor');
  }

  async verifyDoctor(id: string): Promise<void> {
    return await this.client.patch(`/doctor/verify-doctor/${id}`);
  }
}
