import type { Types } from "mongoose";

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export enum Provider {
  S3 = "S3",
  LOCAL = "LOCAL",
  CLOUDINARY = "CLOUDINARY",
}

export interface IAuthProvider {
  provider: string;
  providerId: string;
}

export interface IUserImage {
  url: string;
  provider: Provider;
  created_at?: Date;
  updated_at?: Date;
}

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  phone?: string | null;
  email: string;
  password?: string;
  address?: string | null;
  is_verified: boolean;
  role: UserRole;
  cancelled_orders_count: number;
  isDeleted?: boolean;
  isActive?: IsActive;
  image: IUserImage;
  auths: IAuthProvider[];
  cart: Types.ObjectId;
  orders: Types.ObjectId[];
  created_at: Date;
  updated_at: Date;
}