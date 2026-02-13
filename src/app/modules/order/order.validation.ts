import { z } from "zod/v3";

export const createOrderFromCartZodSchema = z.object({}).strict();

// Admin status update
export const updateOrderStatusZodSchema = z
  .object({
    status: z.enum([
      "PENDING",
      "CANCEL",
      "COMPLETE",
      "PROCESSING",
      "DELIVERED",
      "FAILED",
    ] as const),
  })
