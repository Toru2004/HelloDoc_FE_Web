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
