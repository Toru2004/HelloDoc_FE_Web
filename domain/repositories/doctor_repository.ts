import type { Doctor } from '../entities/doctor';
import type { PendingDoctor } from '../entities/pending_doctor';

export interface IDoctorRepository {
  getAll(): Promise<Doctor[]>;
  getPendingDoctors(): Promise<PendingDoctor[]>;
  verifyDoctor(id: string): Promise<void>;
}
