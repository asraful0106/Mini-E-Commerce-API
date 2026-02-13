import { model, Schema } from "mongoose";
import type { IPayment } from "./payment.interface.js";
import { PAYMENT_STATUS } from "./payment.interface.js";

const paymentSchema = new Schema<IPayment>(
  {
    order_id: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },
    transactionId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true, min: 0 },
    paymentGateWayData: { type: Schema.Types.Mixed },
    invoiceUrl: { type: String },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.UNPAID,
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  },
);

export const Payment = model<IPayment>("Payment", paymentSchema);
