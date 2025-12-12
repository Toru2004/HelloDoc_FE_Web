export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  avatarURL?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  fcmToken?: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  phone: string;
  password: string;
}
