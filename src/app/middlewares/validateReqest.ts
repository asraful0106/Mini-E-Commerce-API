import type { NextFunction, Request, Response } from "express";
import type { AnyZodObject } from "zod/v3";

export const validateRequest =
  (zodSchema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await zodSchema.parseAsync(req.body);
      next();
    } catch (err) {
      next(err);
    }
  };
