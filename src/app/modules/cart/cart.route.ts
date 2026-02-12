import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { UserRole } from "../user/user.interface.js";
import { validateRequest } from "../../middlewares/validateReqest.js";
import { cartController } from "./cart.controller.js";
import {
  addToCartZodSchema,
  updateCartItemZodSchema,
  checkoutCartZodSchema,
} from "./cart.validation.js";
import { requireAuth } from "../../middlewares/requireAuth.js";

const router = Router();

// Get my cart
router.get(
  "/me",
  requireAuth,
  checkAuth(...Object.values(UserRole)),
  cartController.getMyCart,
);

// Add item (creates cart if not exists)
router.post(
  "/items",
  requireAuth,
  checkAuth(...Object.values(UserRole)),
  validateRequest(addToCartZodSchema),
  cartController.addToCart,
);

// Update qty (qty=0 removes)
router.patch(
  "/items/:productId",
  requireAuth,
  checkAuth(...Object.values(UserRole)),
  validateRequest(updateCartItemZodSchema),
  cartController.updateCartItemQty,
);

// Remove item
router.delete(
  "/items/:productId",
  requireAuth,
  checkAuth(...Object.values(UserRole)),
  cartController.removeCartItem,
);

// Clear cart
router.delete(
  "/clear",
  requireAuth,
  checkAuth(...Object.values(UserRole)),
  cartController.clearCart,
);

// Checkout (transaction, clears cart)
router.post(
  "/checkout",
  requireAuth,
  checkAuth(...Object.values(UserRole)),
  validateRequest(checkoutCartZodSchema),
  cartController.checkout,
);

export const cartRouter = router;
