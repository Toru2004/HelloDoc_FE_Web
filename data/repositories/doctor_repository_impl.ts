import type { IDoctorRepository } from '@/domain/repositories/doctor_repository';
import type { Doctor } from '@/domain/entities/doctor';
import type { PendingDoctor } from '@/domain/entities/pending_doctor';
import type { IHttpClient } from '@/data/datasources/http_client';
import type { PaginatedResponse } from '@/domain/entities/pagination';

export class DoctorRepositoryImpl implements IDoctorRepository {
  constructor(private client: IHttpClient) {}

  async getAll(): Promise<Doctor[]> {
    return await this.client.get<Doctor[]>('/doctor/get-all');
  }

  async getAllFiltered(limit: number, offset: number, searchText: string): Promise<PaginatedResponse<Doctor>> {
    return await this.client.get<PaginatedResponse<Doctor>>(`/doctor/get-all-filtered?limit=${limit}&offset=${offset}&searchText=${searchText}`);
  }

  async getPendingDoctors(): Promise<PendingDoctor[]> {
    return await this.client.get<PendingDoctor[]>('/doctor/get-pending-doctor');
  }

  async getRejectedDoctors(): Promise<PendingDoctor[]> {
    return await this.client.get<PendingDoctor[]>('/doctor/get-rejected-doctor');
  }

  async verifyDoctor(id: string): Promise<void> {
    return await this.client.patch(`/doctor/verify-doctor/${id}`);
  }

  async rejectDoctor(id: string, reason: string): Promise<void> {
    return await this.client.patch(`/doctor/reject-doctor/${id}`, { reason });
  }
}
