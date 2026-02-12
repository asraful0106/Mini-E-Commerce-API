import type { Types } from "mongoose";


export interface ICartItem {
  product_id: Types.ObjectId,
  unit_price: number,
  qty: number
}

export interface ICart {
    user_id: Types.ObjectId;
    cart_item: ICartItem[]
}