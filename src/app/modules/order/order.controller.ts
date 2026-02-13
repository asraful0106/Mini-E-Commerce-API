import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResposne } from "../../utils/sendResponse.js";
import { OrderService } from "./order.service.js";
import type { JwtPayload } from "jsonwebtoken";
import type { ORDER_STATUS } from "./order.interface.js";
import AppError from "../../errorHelper/AppError.js";
import { StatusCodes } from "http-status-codes";

const createOrderFromCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodeToken = req.user as JwtPayload;
    const result = await OrderService.createOrderFromCart(decodeToken.userId);

    sendResposne(res, {
      statusCode: 201,
      success: true,
      message: "Order created successfully",
      data: result,
    });
  },
);

const getMyOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodeToken = req.user as JwtPayload;
    const result = await OrderService.getMyOrders(decodeToken.userId);

    sendResposne(res, {
      statusCode: 200,
      success: true,
      message: "My orders retrieved successfully",
      data: result,
    });
  },
);

const getSingleOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;
    const result = await OrderService.getSingleOrder(orderId as string);

    sendResposne(res, {
      statusCode: 200,
      success: true,
      message: "Order retrieved successfully",
      data: result,
    });
  },
);

const getAllOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await OrderService.getAllOrders();

    sendResposne(res, {
      statusCode: 200,
      success: true,
      message: "Orders retrieved successfully",
      data: result,
    });
  },
);

const updateOrderStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!orderId || Array.isArray(orderId)) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Valid orderId is required");
    }

    if (status === undefined) {
      throw new AppError(StatusCodes.NOT_ACCEPTABLE, "Status is required");
    }

    const result = await OrderService.updateOrderStatus(orderId, status);

    sendResposne(res, {
      statusCode: 200,
      success: true,
      message: "Order status updated successfully",
      data: result,
    });
  },
);


export const OrderController = {
  createOrderFromCart,
  getMyOrders,
  getSingleOrder,
  getAllOrders,
  updateOrderStatus,
};
