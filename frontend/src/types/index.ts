export interface Tip {
  id: string;
  title: string;
  content: string;
  publishedDate: string;
  categories: string[];
  likes: number;
  likedBy: string[];
  createdAt: string;
  author?: Author;
}

export interface Author {
  _id: string;
  username: string;
  email: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface LikedResponse {
  success: boolean;
  data: Tip;
  action: string;
}

export interface User {
  id: string;
  userName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface TipResponse {
  success: boolean
  data: Tip[] | Tip
}

export interface TipDeleteResponse {
  success: boolean
  data: { message: string }
}


/** User */
export type LoginBody = {
  email: string,
  password: string
}

export type LoginResponse = {
  success: boolean,
  token: string,
  message: string,
  user: User
}

export type StoredUserInfo = {
  user: User,
  token: string
}

export type RegisterBody = {
  email: string,
  password: string,
  username: string
}

export interface UserSelected {
  id: string
  userName: string
  email: string
  createdAt: string
  updatedAt: string
  likedTips?: string[] 
}


export enum NotificationType {
  Success = 'success',
  Error = 'error',
  Info = 'info',
  Warning = 'warning'
}
