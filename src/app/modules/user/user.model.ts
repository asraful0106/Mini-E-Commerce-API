import { model, Model, Schema } from "mongoose";
import {
  IsActive,
  Provider,
  UserRole,
  type IAuthProvider,
  type IUser,
  type IUserImage,
} from "./user.interface.js";

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: {
      type: String,
      required: true,
    },
    providerId: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    _id: false,
  },
);

const userImageSchema = new Schema<IUserImage>(
  {
    url: { type: String },
    provider: {
      type: String,
      enum: Object.values(Provider),
    },
  },
  {
    versionKey: false,
    _id: false,
  },
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },

    phone: { type: String, default: null, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: { type: String },

    address: { type: String, default: null, trim: true },

    is_verified: { type: Boolean, default: false, required: true },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CUSTOMER,
      required: true,
    },

    cancelled_orders_count: {
      type: Number,
      default: 0,
      required: true,
      min: 0,
    },

    isDeleted: { type: Boolean, default: false },

    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },

    image: {
      type: userImageSchema,
      default: null,
    },

    auths: {
      type: [authProviderSchema],
      default: [],
    },

    cart: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
      default: null,
    },

    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
        default: [],
      },
    ],
  },
  {
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

// Index
// userSchema.index({ email: 1 }, { unique: true });
// userSchema.index({ phone: 1 });

export const User: Model<IUser> = model<IUser>("User", userSchema);
