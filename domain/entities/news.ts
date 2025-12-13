export interface News {
  _id: string;
  admin: string;
  title: string;
  content: string;
  media: string[];
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNewsDto {
  adminId: string;
  title: string;
  content: string;
  images?: File[];
}

export interface UpdateNewsDto {
  title?: string;
  content?: string;
  images?: File[];
}
