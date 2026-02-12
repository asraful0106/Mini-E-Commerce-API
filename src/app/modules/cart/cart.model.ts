import { model, Model, Schema } from "mongoose";
import type { ICart, ICartItem } from "./cart.interface.js";

const cartItemSchema = new Schema<ICartItem>(
  {
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    unit_price: {
      type: Number,
      required: true,
      min: 0,
    },
    qty: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false, versionKey: false },
);

const cartSchema = new Schema<ICart>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // 1 cart per user
      index: true,
    },
    cart_item: {
      type: [cartItemSchema],
      default: [],
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

export const Cart: Model<ICart> = model<ICart>("Cart", cartSchema);
