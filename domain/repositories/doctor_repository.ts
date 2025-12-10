import type { Doctor } from '../entities/doctor';

export interface IDoctorRepository {
  getAll(): Promise<Doctor[]>;
}
