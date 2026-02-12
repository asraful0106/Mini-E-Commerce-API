import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResposne } from "../../utils/sendResponse.js";
import { envVars } from "../../config/env.js";
import { saveLocalImage } from "../../utils/localUpload.js";
import { productService } from "./product.service.js";

const normalizeNumberFields = (body: any) => {
  if (body?.price !== undefined) body.price = Number(body.price);
  if (body?.stock_qty !== undefined) body.stock_qty = Number(body.stock_qty);
  if (body?.reserved_qty !== undefined)
    body.reserved_qty = Number(body.reserved_qty);
  if (body?.is_active !== undefined)
    body.is_active = body.is_active === "true" || body.is_active === true;
  return body;
};

const createProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    normalizeNumberFields(req.body);

    let imageUrls: string[] = [];

    if (req.files && Array.isArray(req.files) && envVars.PROVIDER === "LOCAL") {
      const files = req.files as Express.Multer.File[];

      // save all images async (stream inside saveLocalImage)
      imageUrls = await Promise.all(
        files.map(async (f) => {
          const saved = await saveLocalImage({
            buffer: f.buffer,
            originalname: f.originalname,
          });
          return saved.url;
        }),
      );
    }

    const created = await productService.createProduct(req.body, imageUrls);

    sendResposne(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Product created successfully",
      data: created,
    });
  },
);

const updateProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    normalizeNumberFields(req.body);

    let imageUrls: string[] | undefined;
    if (
      req.files &&
      Array.isArray(req.files) &&
      (req.files as any[]).length > 0 &&
      envVars.PROVIDER === "LOCAL"
    ) {
      const files = req.files as Express.Multer.File[];

      imageUrls = await Promise.all(
        files.map(async (f) => {
          const saved = await saveLocalImage({
            buffer: f.buffer,
            originalname: f.originalname,
          });
          return saved.url;
        }),
      );
    }

    const updated = await productService.updateProduct(id as string, req.body, imageUrls);

    sendResposne(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Product updated successfully",
      data: updated,
    });
  },
);

const deleteProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await productService.deleteProduct(id as string);

    sendResposne(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Product deleted successfully",
      data: result,
    });
  },
);

export const productController = {
  createProduct,
  updateProduct,
  deleteProduct,
};
