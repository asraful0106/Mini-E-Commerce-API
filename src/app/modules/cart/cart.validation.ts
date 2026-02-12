import { z } from "zod/v3";

// ObjectId validator (simple)
const objectId = z
  .string({ invalid_type_error: "product_id must be string" })
  .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid product_id" });

export const addToCartZodSchema = z
  .object({
    product_id: objectId,
    qty: z.coerce
      .number({ invalid_type_error: "qty must be number" })
      .int({ message: "qty must be integer" })
      .min(1, { message: "qty must be at least 1" }),
  })
  .strict();

export const updateCartItemZodSchema = z
  .object({
    qty: z.coerce
      .number({ invalid_type_error: "qty must be number" })
      .int({ message: "qty must be integer" })
      .min(0, { message: "qty cannot be negative" }), // 0 means remove
  })
  .strict();

export const removeCartItemZodSchema = z.object({}).strict();

export const checkoutCartZodSchema = z
  .object({
    // optional in future: address, payment_method, etc.
  })
  .strict();
