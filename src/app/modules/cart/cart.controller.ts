import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResposne } from "../../utils/sendResponse.js";
import { cartService } from "./cart.service.js";
import type { JwtPayload } from "jsonwebtoken";

const getMyCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const userId = decodedToken.userId;
    console.log("cart: ", userId);
    const cart = await cartService.getMyCart(userId);

    sendResposne(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Cart fetched successfully",
      data: cart,
    });
  },
);

const addToCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const userId = decodedToken.userId;
    const { product_id, qty } = req.body;

    const cart = await cartService.addItem(userId, product_id, qty);

    sendResposne(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Item added to cart",
      data: cart,
    });
  },
);

const updateCartItemQty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const userId = decodedToken.userId;
    const { productId } = req.params;
    const { qty } = req.body;

    const cart = await cartService.updateItemQty(userId, productId as string, qty);

    sendResposne(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Cart item updated",
      data: cart,
    });
  },
);

const removeCartItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const userId = decodedToken.userId;
    const { productId } = req.params;

    const cart = await cartService.removeItem(userId, productId as string);

    sendResposne(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Cart item removed",
      data: cart,
    });
  },
);

const clearCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const userId = decodedToken.userId;

    const cart = await cartService.clearCart(userId);

    sendResposne(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Cart cleared",
      data: cart,
    });
  },
);

const checkout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const userId = decodedToken.userId;

    const result = await cartService.checkout(userId);

    sendResposne(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Checkout completed",
      data: result,
    });
  },
);

export const cartController = {
  getMyCart,
  addToCart,
  updateCartItemQty,
  removeCartItem,
  clearCart,
  checkout,
};
