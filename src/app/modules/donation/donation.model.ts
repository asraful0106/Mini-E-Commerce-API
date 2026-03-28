// donation.model.ts
import mongoose, { Schema, Model } from "mongoose";
import type { IDonation } from "./donation.interface.js";

const donationSchema = new Schema<IDonation>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User", // Optional: reference to User model
      default: null,
    },
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      trim: true,
      maxlength: [500, "Email cannot exceed 500 characters"],
      lowercase: true,
    },
    trees: {
      type: Number,
      required: [true, "Number of trees is required"],
      min: [1, "At least 1 tree must be donated"],
    },
    amount: {
      type: Number,
      required: [true, "Donation amount is required"],
      min: [1, "Amount must be greater than 0"],
    },
  },
  {
    timestamps: true,
  },
);

// Optional: Compound index
donationSchema.index({ user_id: 1, createdAt: -1 });

export const Donation: Model<IDonation> = mongoose.model<IDonation>(
  "Donation",
  donationSchema,
);
