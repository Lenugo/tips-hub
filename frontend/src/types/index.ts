export interface Tip {
  id: string;
  title: string;
  content: string;
  publishedDate: string;
  category: string[];
  likes: number;
  likedBy: string[];
  createdAt: string;
  author?: {
    _id: string;
    username: string;
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

export interface User {
  _id: string;
  username: string;
  email: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}