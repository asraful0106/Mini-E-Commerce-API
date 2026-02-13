import AppError from "../../errorHelper/AppError.js";
import mongoose, { Types } from "mongoose";
import { Cart } from "../cart/cart.model.js";
import { Order } from "./order.model.js";
import { ORDER_STATUS, type IOrder, type IOrderItem } from "./order.interface.js";
import { Payment } from "../payment/payment.model.js";
import { PAYMENT_STATUS } from "../payment/payment.interface.js";
import { User } from "../user/user.model.js";
import { Product } from "../product/product.model.js"; // adjust path
import { StatusCodes } from "http-status-codes";

const getTransactionId = (userId: string) =>
  `tran_${Date.now()}_${userId}_${Math.floor(Math.random() * 1000)}`;

const createOrderFromCart = async (userId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);
    if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found!");

    if (!user.phone || !user.address) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Please update your profile (phone & address) to checkout.",
      );
    }

    const cart = await Cart.findOne({ user_id: userId }).session(session);
    if (!cart || cart.cart_item.length === 0) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Cart is empty!");
    }

    // Build order items from cart + validate products
    const orderItems: IOrderItem[] = [];
    let totalAmount = 0;

    for (const item of cart.cart_item) {
      const product = await Product.findById(item.product_id)
        .session(session)
        .select("price stock_qty reserved_qty is_active");
      if (!product)
        throw new AppError(StatusCodes.NOT_FOUND, "Product not found!");

      if (product.is_active === false) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          "Product is not active!",
        );
      }

      const available =
        Number(product.stock_qty ?? 0) - Number(product.reserved_qty ?? 0);
      if (available < item.qty) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          "Insufficient stock for a product in your cart!",
        );
      }

      const unitPrice = Number(product.price);
      const lineTotal = unitPrice * Number(item.qty);

      orderItems.push({
        product_id: item.product_id as any,
        qty: Number(item.qty),
        total_price: lineTotal,
      });

      totalAmount += lineTotal;

      // Reserve stock (recommended approach)
      product.reserved_qty =
        Number(product.reserved_qty ?? 0) + Number(item.qty);
      await product.save({ session });
    }

    const order = new Order({
      user_id: new Types.ObjectId(userId),
      product_item: orderItems,
      status: ORDER_STATUS.PENDING,
    });
    await order.save({ session });

    const transactionId = getTransactionId(userId);

    const payment = new Payment({
      order_id: order._id,
      status: PAYMENT_STATUS.UNPAID,
      transactionId,
      amount: totalAmount,
    });
    await payment.save({ session });

    const updatedOrder = await Order.findByIdAndUpdate(
      order._id,
      { payment_id: payment._id },
      { new: true, runValidators: true, session },
    )
      .populate("user_id", "name email phone address")
      .populate("payment_id");

    // Clear cart
    cart.cart_item = [];
    await cart.save({ session });

    await session.commitTransaction();
    session.endSession();

    return {
      order: updatedOrder,
      payment,
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

const getMyOrders = async (userId: string) => {
  return Order.find({ user_id: userId })
    .sort({ created_at: -1 })
    .populate("payment_id")
    .populate("product_item.product_id");
};

const getAllOrders = async () => {
  return Order.find()
    .sort({ created_at: -1 })
    .populate("payment_id")
    .populate("user_id", "name email phone")
    .populate("product_item.product_id");
};

const getSingleOrder = async (orderId: string) => {
  const order = await Order.findById(orderId)
    .populate("payment_id")
    .populate("user_id", "name email phone address")
    .populate("product_item.product_id");

  if (!order) throw new AppError(StatusCodes.NOT_FOUND, "Order not found!");
  return order;
};

const updateOrderStatus = async (orderId: string, status: ORDER_STATUS) => {
  const order = await Order.findById(orderId);
  if (!order) throw new AppError(StatusCodes.NOT_FOUND, "Order not found!");

  // You can add strict transitions here if you want
  order.status = status;
  await order.save();

  return order;
};

export const OrderService = {
  createOrderFromCart,
  getMyOrders,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
};
