export interface PendingDoctor {
  _id: string;
  userId: string;
  CCCD: string;
  license: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  verified: boolean;
  certificates: string;
  specialty: string; // The API returns an ID string for specialty
  faceUrl: string;
  avatarURL: string;
  licenseUrl: string;
  backCccdUrl: string;
  frontCccdUrl: string;
  isDeleted: boolean;
  status: string;
  denyReason?: string;
}
