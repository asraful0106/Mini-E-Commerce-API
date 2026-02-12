import type { Provider } from "../user/user.interface.js";

export interface IProductImage {
  url: string;
  provider?: Provider;
  created_at?: Date;
  updated_at?: Date;
}

export interface IProduct {
  name: string;
  slug: string;
  price: number;
  stock_qty?: number;
  reserved_qty?: number;
  is_active?: boolean;
  images: IProductImage[];
  created_at?: Date;
  updated_at?: Date;
}
