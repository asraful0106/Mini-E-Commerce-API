import { z } from "zod/v3";

const toNumber = z.preprocess(
  (val) => {
    if (typeof val === "string") return val.trim();
    return val;
  },
  z.coerce.number({ invalid_type_error: "Price must be number." }),
);

export const createProductZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be string." })
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(120, { message: "Name can't exceed 120 characters." }),

  slug: z
    .string({ invalid_type_error: "Slug must be string." })
    .min(2, { message: "Slug must be at least 2 characters long." })
    .max(150, { message: "Slug can't exceed 150 characters." })
    .optional(),

  price: z.preprocess(
    (val) => (typeof val === "string" ? val.trim() : val),
    z.coerce
      .number({ invalid_type_error: "Price must be number." })
      .positive({ message: "Price must be greater than 0." }),
  ),

  stock_qty: z.coerce
    .number({ invalid_type_error: "Stock qty must be number." })
    .int({ message: "Stock qty must be integer." })
    .nonnegative({ message: "Stock qty can't be negative." })
    .optional(),

  reserved_qty: z.coerce
    .number({ invalid_type_error: "Reserved qty must be number." })
    .int({ message: "Reserved qty must be integer." })
    .nonnegative({ message: "Reserved qty can't be negative." })
    .optional(),

  is_active: z
    .boolean({ invalid_type_error: "is_active must be boolean." })
    .optional(),
});

export const updateProductZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be string." })
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(120, { message: "Name can't exceed 120 characters." })
    .optional(),

  slug: z
    .string({ invalid_type_error: "Slug must be string." })
    .min(2, { message: "Slug must be at least 2 characters long." })
    .max(150, { message: "Slug can't exceed 150 characters." })
    .optional(),

  price: z
    .preprocess(
      (val) => (typeof val === "string" ? val.trim() : val),
      z.coerce
        .number({ invalid_type_error: "Price must be number." })
        .positive({ message: "Price must be greater than 0." }),
    )
    .optional(),

  stock_qty: z.coerce
    .number({ invalid_type_error: "Stock qty must be number." })
    .int({ message: "Stock qty must be integer." })
    .nonnegative({ message: "Stock qty can't be negative." })
    .optional(),

  reserved_qty: z.coerce
    .number({ invalid_type_error: "Reserved qty must be number." })
    .int({ message: "Reserved qty must be integer." })
    .nonnegative({ message: "Reserved qty can't be negative." })
    .optional(),

  is_active: z
    .boolean({ invalid_type_error: "is_active must be boolean." })
    .optional(),
});
