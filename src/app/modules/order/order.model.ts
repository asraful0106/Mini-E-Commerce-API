import { model, Schema } from "mongoose";
import type { IOrder, IOrderItem } from "./order.interface.js";
import { ORDER_STATUS } from "./order.interface.js";

const orderItemSchema = new Schema<IOrderItem>(
  {
    product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    qty: { type: Number, required: true, min: 1 },
    total_price: { type: Number, required: true, min: 0 },
  },
  { _id: false, versionKey: false },
);

const orderSchema = new Schema<IOrder>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    payment_id: { type: Schema.Types.ObjectId, ref: "Payment", default: null },
    product_item: { type: [orderItemSchema], default: [] },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  },
);

export const Order = model<IOrder>("Order", orderSchema);
