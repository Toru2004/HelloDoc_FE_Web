import type { IDoctorRepository } from '../../repositories/doctor_repository';
import type { PendingDoctor } from '../../entities/pending_doctor';

export class GetPendingDoctorsUseCase {
  constructor(private doctorRepository: IDoctorRepository) {}

  async execute(): Promise<PendingDoctor[]> {
    return await this.doctorRepository.getPendingDoctors();
  }
}
