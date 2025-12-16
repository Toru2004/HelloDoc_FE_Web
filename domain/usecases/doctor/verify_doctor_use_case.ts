import type { IDoctorRepository } from '../../repositories/doctor_repository';

export class VerifyDoctorUseCase {
  constructor(private doctorRepository: IDoctorRepository) {}

  async execute(id: string): Promise<void> {
    await this.doctorRepository.verifyDoctor(id);
  }
}
