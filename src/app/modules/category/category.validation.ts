// category.validation.ts
import { z } from "zod/v3";

export const createCategoryZodSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  description: z.string().max(500).optional(),
  image: z.string().url("Invalid image URL").optional().nullable(),
  parent: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const updateCategoryZodSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .optional(),
  description: z.string().max(500).optional(),
  image: z.string().url("Invalid image URL").optional().nullable(),
  parent: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const categoryIdParamSchema = z.object({
  id: z.string().length(24, "Invalid category ID"),
});
