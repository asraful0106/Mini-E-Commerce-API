import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { validateRequest } from "../../middlewares/validateReqest.js";
import { OrderController } from "./order.controller.js";
import { UserRole } from "../user/user.interface.js";
import { createOrderFromCartZodSchema, updateOrderStatusZodSchema } from "./order.validation.js";

const orderRouter = Router();

// Create order from my cart
orderRouter.post(
  "/",
  checkAuth(...Object.values(UserRole)),
  validateRequest(createOrderFromCartZodSchema),
  OrderController.createOrderFromCart,
);

// My orders
orderRouter.get(
  "/my-orders",
  checkAuth(...Object.values(UserRole)),
  OrderController.getMyOrders,
);

// Admin: all orders
orderRouter.get(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  OrderController.getAllOrders,
);

// Single order
orderRouter.get(
  "/:orderId",
  checkAuth(...Object.values(UserRole)),
  OrderController.getSingleOrder,
);

// Update order status
orderRouter.patch(
  "/:orderId/status",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(updateOrderStatusZodSchema),
  OrderController.updateOrderStatus,
);

export default orderRouter;
