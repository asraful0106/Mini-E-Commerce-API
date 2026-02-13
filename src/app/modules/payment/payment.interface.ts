import { Types } from "mongoose";

export enum PAYMENT_STATUS {
  PAID = "PAID",
  UNPAID = "UNPAID",
  CANCELED = "CANCELED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export interface IPayment {
  order_id: Types.ObjectId;
  transactionId: string;
  amount: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paymentGateWayData?: any;
  invoiceUrl?: string;
  status: PAYMENT_STATUS;
}
