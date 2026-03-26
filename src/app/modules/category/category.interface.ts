// category.interface.ts
import { Document, Types } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description?: string;
  slug: string;
  image?: string;
  isActive: boolean;
  parent?: Types.ObjectId; // For hierarchical categories (optional)
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategoryCreate {
  name: string;
  description?: string;
  image?: string;
  parent?: string;
  isActive?: boolean;
}

export interface ICategoryUpdate {
  name?: string;
  description?: string;
  image?: string;
  parent?: string;
  isActive?: boolean;
}
