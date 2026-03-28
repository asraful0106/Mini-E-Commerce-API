// cart.service.ts
import mongoose, { Types } from "mongoose";
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError.js";
import { Cart } from "./cart.model.js";
import { Product } from "../product/product.model.js";

const getMyCart = async (userId: string) => {
  const cart = await Cart.findOne({ user_id: userId })
    .populate("cart_item.product_id", "name price images slug") // populate useful fields
    .lean();

  return cart ?? { user_id: userId, cart_item: [] };
};

const addItem = async (userId: string, productId: string, qty: number) => {
  const uid = new Types.ObjectId(userId);
  const pid = new Types.ObjectId(productId);

  // Validate product exists, is active, and has enough stock
  const product = await Product.findById(pid).select(
    "price stock_qty reserved_qty is_active name",
  );

  if (!product) {
    throw new AppError(StatusCodes.NOT_FOUND, "Product not found!");
  }

  if (product.is_active === false) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Product is not active!");
  }

  const availableStock =
    Number(product.stock_qty ?? 0) - Number(product.reserved_qty ?? 0);
  if (availableStock < qty) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `Insufficient stock. Only ${availableStock} available.`,
    );
  }

  const unit_price = Number(product.price);

  let cart = await Cart.findOne({ user_id: uid });

  if (!cart) {
    // Create new cart
    cart = await Cart.create({
      user_id: uid,
      cart_item: [{ product_id: pid, qty, unit_price }],
    });
  } else {
    // Check if item already exists in cart
    const existingItem = cart.cart_item.find(
      (i) => i.product_id.toString() === pid.toString(),
    );

    if (existingItem) {
      existingItem.qty += qty;
    } else {
      cart.cart_item.push({ product_id: pid, qty, unit_price });
    }

    await cart.save();
  }

  return cart;
};

const updateItemQty = async (
  userId: string,
  productId: string,
  qty: number,
) => {
  const uid = new Types.ObjectId(userId);
  const pid = new Types.ObjectId(productId);

  const cart = await Cart.findOne({ user_id: uid });
  if (!cart) throw new AppError(StatusCodes.NOT_FOUND, "Cart not found!");

  const idx = cart.cart_item.findIndex(
    (i) => i.product_id.toString() === pid.toString(),
  );

  if (idx === -1) {
    throw new AppError(StatusCodes.NOT_FOUND, "Cart item not found!");
  }

  if (qty === 0) {
    cart.cart_item.splice(idx, 1);
  } else {
    cart.cart_item[idx].qty = qty;
  }

  await cart.save();
  return cart;
};

const removeItem = async (userId: string, productId: string) => {
  const uid = new Types.ObjectId(userId);
  const pid = new Types.ObjectId(productId);

  const cart = await Cart.findOne({ user_id: uid });
  if (!cart) throw new AppError(StatusCodes.NOT_FOUND, "Cart not found!");

  const beforeLength = cart.cart_item.length;
  cart.cart_item = cart.cart_item.filter(
    (i) => i.product_id.toString() !== pid.toString(),
  );

  if (cart.cart_item.length === beforeLength) {
    throw new AppError(StatusCodes.NOT_FOUND, "Cart item not found!");
  }

  await cart.save();
  return cart;
};

const clearCart = async (userId: string) => {
  const cart = await Cart.findOne({ user_id: userId });
  if (!cart) return { message: "Cart already empty" };

  cart.cart_item = [];
  await cart.save();
  return cart;
};

const checkout = async (userId: string) => {
  const session = await mongoose.startSession();

  try {
    let result: any;

    await session.withTransaction(async () => {
      const cart = await Cart.findOne({ user_id: userId }).session(session);

      if (!cart || cart.cart_item.length === 0) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Cart is empty!");
      }

      cart.cart_item = [];
      await cart.save({ session });

      result = { message: "Checkout success. Cart cleared." };
    });

    return result;
  } finally {
    await session.endSession();
  }
};

export const cartService = {
  getMyCart,
  addItem,
  updateItemQty,
  removeItem,
  clearCart,
  checkout,
};
