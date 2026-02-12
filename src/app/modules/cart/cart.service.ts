import mongoose, { Types } from "mongoose";
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError.js";
import { Cart } from "./cart.model.js";

// OPTIONAL (recommended): use Product model to validate product exists + price/stock
// import { Product } from "../product/product.model.js";

const getMyCart = async (userId: string) => {
  const cart = await Cart.findOne({ user_id: userId })
    .populate("cart_item.product_id") // optional
    .lean();

  return cart ?? { user_id: userId, cart_item: [] };
};

const addItem = async (userId: string, productId: string, qty: number) => {
  const uid = new Types.ObjectId(userId);
  const pid = new Types.ObjectId(productId);

  // OPTIONAL: Validate product exists, active, price, stock, etc.
  // const product = await Product.findById(pid).select("price stock_qty reserved_qty is_active");
  // if (!product) throw new AppError(StatusCodes.NOT_FOUND, "Product not found!");
  // const unitPrice = product.price;

  // If you don't check Product now, you must accept unit_price somehow.
  // Minimal safe approach: require Product check. For now, we'll assume you have Product model.
  // If you don't, tell me and I’ll adjust.

  throwIfNoProductModel(); // remove when Product is available

  const cart = await Cart.findOne({ user_id: uid });

  // If no cart -> create
  if (!cart) {
    // unit_price should come from Product
    const unit_price = 0; // replace by product.price
    const created = await Cart.create({
      user_id: uid,
      cart_item: [{ product_id: pid, qty, unit_price }],
    });
    return created;
  }

  // If exists -> merge/increment qty
  const item = cart.cart_item.find(
    (i) => i.product_id.toString() === pid.toString(),
  );

  if (item) {
    item.qty += qty;
  } else {
    const unit_price = 0; // replace by product.price
    cart.cart_item.push({ product_id: pid, qty, unit_price });
  }

  await cart.save();
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
  if (idx === -1)
    throw new AppError(StatusCodes.NOT_FOUND, "Cart item not found!");

  if (qty === 0) {
    cart.cart_item.splice(idx, 1);
  } else {
    const item = cart.cart_item[idx];
    if (!item) {
      throw new AppError(StatusCodes.NOT_FOUND, "Cart item not found!");
    }
    item.qty = qty;
  }

  await cart.save();
  return cart;
};

const removeItem = async (userId: string, productId: string) => {
  const uid = new Types.ObjectId(userId);
  const pid = new Types.ObjectId(productId);

  const cart = await Cart.findOne({ user_id: uid });
  if (!cart) throw new AppError(StatusCodes.NOT_FOUND, "Cart not found!");

  const before = cart.cart_item.length;
  cart.cart_item = cart.cart_item.filter(
    (i) => i.product_id.toString() !== pid.toString(),
  );

  if (cart.cart_item.length === before) {
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

function throwIfNoProductModel() {
  throw new AppError(
    StatusCodes.NOT_IMPLEMENTED,
    "Product model check is required to set unit_price. Wire Product model in cart.service.ts (recommended).",
  );
}

export const cartService = {
  getMyCart,
  addItem,
  updateItemQty,
  removeItem,
  clearCart,
  checkout,
};
