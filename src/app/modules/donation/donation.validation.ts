// donation.validation.ts
import { z } from "zod/v3";

export const createDonationZodSchema = z.object({
  user_id: z.string().optional(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters")
    .trim(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  trees: z
    .number()
    .int("Number of trees must be a whole number")
    .min(1, "At least 1 tree must be donated"),
  amount: z.number().min(1, "Donation amount must be greater than 0"),
});

export const updateDonationZodSchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  email: z.string().email().optional().or(z.literal("")),
  trees: z.number().int().min(1).optional(),
  amount: z.number().min(1).optional(),
});
