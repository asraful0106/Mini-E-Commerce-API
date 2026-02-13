import AppError from "../../errorHelper/AppError.js";
import mongoose from "mongoose";
import { Payment } from "./payment.model.js";
import { PAYMENT_STATUS } from "./payment.interface.js";
import { Order } from "../order/order.model.js";
import { ORDER_STATUS } from "../order/order.interface.js";
import { Product } from "../product/product.model.js";
import { SSLService } from "../sslCommerz/sslCommerz.service.js";
import type { ISsLCommerz } from "../sslCommerz/sslCommerz.interface.js";
import { StatusCodes } from "http-status-codes";

const initPayment = async (orderId: string) => {
  const payment = await Payment.findOne({ order_id: orderId });
  if (!payment)
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Payment not found for this order!",
    );

  const order = await Order.findById(orderId).populate(
    "user_id",
    "name email phone address",
  );
  if (!order) throw new AppError(StatusCodes.NOT_FOUND, "Order not found!");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = order.user_id as any;

  if (!user?.phone || !user?.address) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Please update your profile (phone & address) to pay.",
    );
  }

  const sslPayload: ISsLCommerz = {
    address: user.address,
    email: user.email,
    phoneNumber: user.phone,
    name: user.name,
    amount: payment.amount,
    transactionId: payment.transactionId,
  };

  const sslPayment = await SSLService.sslPaymentInit(sslPayload);

  return {
    paymentUrl:
      sslPayment.GatewayPageURL ??
      sslPayment.GateWayPageURL ??
      sslPayment.GatewayPageURL,
  };
};

const successPayment = async (query: Record<string, string>) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const transactionId = query.transactionId;
    if (!transactionId) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "transactionId is required.",
      );
    }

    const payment = await Payment.findOne({
      transactionId,
    }).session(session);

    if (!payment)
      throw new AppError(StatusCodes.NOT_FOUND, "Payment not found!");

    await Payment.updateOne(
      { transactionId },
      { status: PAYMENT_STATUS.PAID, paymentGateWayData: query },
      { runValidators: true, session },
    );

    const order = await Order.findById(payment.order_id).session(session);
    if (!order)
      throw new AppError(StatusCodes.NOT_FOUND, "Order not found!");

    // finalize stock: move reserved_qty -> reduce stock_qty
    for (const item of order.product_item) {
      const product = await Product.findById(item.product_id).session(session);
      if (!product)
        throw new AppError(StatusCodes.NOT_FOUND, "Product not found!");

      // subtract from stock and reserved
      product.stock_qty = Number(product.stock_qty ?? 0) - Number(item.qty);
      product.reserved_qty = Math.max(
        0,
        Number(product.reserved_qty ?? 0) - Number(item.qty),
      );

      if (product.stock_qty < 0) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          "Stock became negative. Order cannot be completed.",
        );
      }

      await product.save({ session });
    }

    order.status = ORDER_STATUS.COMPLETE;
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    return { success: true, message: "Payment completed successfully." };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

const failPayment = async (query: Record<string, string>) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const transactionId = query.transactionId;
    if (!transactionId) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "transactionId is required.",
      );
    }

    const payment = await Payment.findOne({
      transactionId,
    }).session(session);

    if (!payment)
      throw new AppError(StatusCodes.NOT_FOUND, "Payment not found!");

    await Payment.updateOne(
      { transactionId },
      { status: PAYMENT_STATUS.FAILED, paymentGateWayData: query },
      { runValidators: true, session },
    );

    const order = await Order.findById(payment.order_id).session(session);
    if (!order)
      throw new AppError(StatusCodes.NOT_FOUND, "Order not found!");

    // release reserved qty
    for (const item of order.product_item) {
      const product = await Product.findById(item.product_id).session(session);
      if (!product) continue;

      product.reserved_qty = Math.max(
        0,
        Number(product.reserved_qty ?? 0) - Number(item.qty),
      );
      await product.save({ session });
    }

    order.status = ORDER_STATUS.FAILED;
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    return { success: true, message: "Payment failed." };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

const cancelPayment = async (query: Record<string, string>) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const transactionId = query.transactionId;
    if (!transactionId) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "transactionId is required.",
      );
    }

    const payment = await Payment.findOne({
      transactionId,
    }).session(session);

    if (!payment)
      throw new AppError(StatusCodes.NOT_FOUND, "Payment not found!");

    await Payment.updateOne(
      { transactionId },
      { status: PAYMENT_STATUS.CANCELED, paymentGateWayData: query },
      { runValidators: true, session },
    );

    const order = await Order.findById(payment.order_id).session(session);
    if (!order)
      throw new AppError(StatusCodes.NOT_FOUND, "Order not found!");

    // release reserved qty
    for (const item of order.product_item) {
      const product = await Product.findById(item.product_id).session(session);
      if (!product) continue;

      product.reserved_qty = Math.max(
        0,
        Number(product.reserved_qty ?? 0) - Number(item.qty),
      );
      await product.save({ session });
    }

    order.status = ORDER_STATUS.CANCEL;
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    return { success: true, message: "Payment cancelled." };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

export const PaymentService = {
  initPayment,
  successPayment,
  failPayment,
  cancelPayment,
};
