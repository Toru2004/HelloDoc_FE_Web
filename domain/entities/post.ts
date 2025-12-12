export interface UserInfo {
  _id: string;
  name: string;
  avatarURL?: string;
}

export interface Post {
  _id: string;
  user: string;
  userModel: string;
  content: string;
  media: string[];
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
  userInfo?: UserInfo; // Optional since API might not always include it
}
