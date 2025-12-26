import type { IDoctorRepository } from "../../repositories/doctor_repository";

export class RejectDoctorUseCase {
  constructor(private doctorRepository: IDoctorRepository) {}

  async execute(id: string, reason: string): Promise<void> {
    return await this.doctorRepository.rejectDoctor(id, reason);
  }
}
