import type { Specialty } from './specialty';

export interface WorkingHour {
  dayOfWeek: number;
  hour: number;
  minute: number;
  _id: string;
}

export interface Doctor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  certificates: string;
  patientsCount: number;
  ratingsCount: number;
  specialty: Specialty;
  licenseUrl: string;
  verified: boolean;
  address: string;
  avatarURL: string;
  cccd: string;
  backCccdUrl: string;
  frontCccdUrl: string;
  isDeleted: boolean;
  hasHomeService: boolean;
  isClinicPaused: boolean;
  services: any[];
  workingHours: WorkingHour[];
  createdAt: string;
  updatedAt: string;
  fcmToken?: string;
  description?: string;
}
