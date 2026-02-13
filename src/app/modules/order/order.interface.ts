import type { Types } from "mongoose";

export enum ORDER_STATUS {
  PENDING = "PENDING",
  CANCEL = "CANCEL",
  COMPLETE = "COMPLETE",
  PROCESSING = "PROCESSING",
  DELIVERED = "DELIVERED",
  FAILED = "FAILED",
}

export interface IOrderItem {
    product_id: Types.ObjectId,
    qty:number,
    total_price: number,
}

export interface IOrder{
    user_id: Types.ObjectId,
    payment_id?: Types.ObjectId,
    product_item: IOrderItem[],
    status: ORDER_STATUS,
}