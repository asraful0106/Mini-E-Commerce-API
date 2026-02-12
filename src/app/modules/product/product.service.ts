import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError.js";
import { envVars } from "../../config/env.js";
import { Provider } from "../user/user.interface.js";
import type { IProduct, IProductImage } from "./product.interface.js";
import { deleteLocalFileByUrl } from "../../utils/localUpload.js";
import { Product } from "./product.model.js";

const createProduct = async (
  payload: Partial<IProduct>,
  imageUrls: string[],
) => {
  const images: IProductImage[] =
    envVars.PROVIDER === "LOCAL"
      ? imageUrls.map((url) => ({ url, provider: Provider.LOCAL }))
      : [];

  const created = await Product.create({
    ...payload,
    images,
  });

  return created;
};

const updateProduct = async (
  id: string,
  payload: Partial<IProduct>,
  imageUrls?: string[],
) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new AppError(StatusCodes.NOT_FOUND, "Product not found!");
  }

  if (imageUrls && imageUrls.length > 0 && envVars.PROVIDER === "LOCAL") {
    const oldImages = product.images || [];
    for (const img of oldImages) {
      if (img?.provider === Provider.LOCAL && img?.url) {
        await deleteLocalFileByUrl(img.url);
      }
    }
    product.images = imageUrls.map((url) => ({
      url,
      provider: Provider.LOCAL,
    }));
  }

  Object.assign(product, payload);

  await product.save();
  return product;
};

const deleteProduct = async (id: string) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new AppError(StatusCodes.NOT_FOUND, "Product not found!");
  }

  // delete local images
  if (envVars.PROVIDER === "LOCAL") {
    for (const img of product.images || []) {
      if (img?.provider === Provider.LOCAL && img?.url) {
        await deleteLocalFileByUrl(img.url);
      }
    }
  }

  await Product.deleteOne({ _id: id });

  return { message: "Product deleted successfully" };
};

export const productService = {
  createProduct,
  updateProduct,
  deleteProduct,
};
