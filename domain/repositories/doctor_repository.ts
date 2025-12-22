import type { Doctor } from '../entities/doctor';
import type { PendingDoctor } from '../entities/pending_doctor';
import type { PaginatedResponse } from '../entities/pagination';

export interface IDoctorRepository {
  getAll(): Promise<Doctor[]>;
  getAllFiltered(limit: number, offset: number, searchText: string): Promise<PaginatedResponse<Doctor>>;
  getPendingDoctors(): Promise<PendingDoctor[]>;
  verifyDoctor(id: string): Promise<void>;
}
