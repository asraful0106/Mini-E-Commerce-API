// donation.interface.ts
import { Document, Types } from "mongoose";

export interface IDonation extends Document {
  user_id: Types.ObjectId | null;
  name: string;
  email?: string;
  trees: number;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDonationInput {
  user_id?: string;
  name: string;
  email?: string;
  trees: number;
  amount: number;
}
