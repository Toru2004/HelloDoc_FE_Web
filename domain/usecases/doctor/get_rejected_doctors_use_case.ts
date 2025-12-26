import type { PendingDoctor } from "../../entities/pending_doctor";
import type { IDoctorRepository } from "../../repositories/doctor_repository";

export class GetRejectedDoctorsUseCase {
  constructor(private doctorRepository: IDoctorRepository) {}

  async execute(): Promise<PendingDoctor[]> {
    return await this.doctorRepository.getRejectedDoctors();
  }
}
