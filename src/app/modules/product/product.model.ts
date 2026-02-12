import { model, Model, Schema } from "mongoose";
import type { HydratedDocument } from "mongoose";
import type { IProduct, IProductImage } from "./product.interface.js";
import { Provider } from "../user/user.interface.js";
import { generateSlug } from "../../utils/generateSlug.js";

const ProductImageSchema = new Schema<IProductImage>(
  {
    url: { type: String, required: true },
    provider: { type: String, enum: Object.values(Provider) },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  },
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, maxlength: 500 },
    slug: { type: String, unique: true, maxlength: 500 },
    price: { type: Number, required: true },
    stock_qty: { type: Number, default: 0 },
    reserved_qty: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true },
    images: { type: [ProductImageSchema], default: [] },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  },
);

ProductSchema.pre("save", async function (this: HydratedDocument<IProduct>) {
  if (!this.isModified("name") && !this.isModified("slug") && this.slug) return;

  const baseText = this.slug?.trim() ? this.slug : this.name;

  const baseSlug = generateSlug(baseText, {
    maxLength: 80,
    fallbackRandomSuffix: true,
  });

  const ProductModel = this.constructor as Model<IProduct>;

  let candidate = baseSlug;
  let counter = 2;

  while (
    await ProductModel.exists({
      slug: candidate,
      _id: { $ne: this._id },
    })
  ) {
    candidate = `${baseSlug}-${counter++}`;
  }

  this.slug = candidate;
});

ProductSchema.pre("findOneAndUpdate", async function () {
  const update = (this.getUpdate() ?? {}) as any;
  const $set = update.$set ?? update;

  if (!$set.name && !$set.slug) return;

  const baseText = ($set.slug ?? $set.name) as string;

  const baseSlug = generateSlug(baseText, {
    maxLength: 80,
    fallbackRandomSuffix: true,
  });

  const ProductModel = this.model as Model<IProduct>;

  let candidate = baseSlug;
  let counter = 2;

  // _id could be in query or in filter depending on how you call it
  const query = this.getQuery() as any;
  const currentId = query?._id;

  while (
    await ProductModel.exists({
      slug: candidate,
      ...(currentId ? { _id: { $ne: currentId } } : {}),
    })
  ) {
    candidate = `${baseSlug}-${counter++}`;
  }

  // write slug back to update
  if (update.$set) update.$set.slug = candidate;
  else update.slug = candidate;
});

export const Product: Model<IProduct> = model<IProduct>(
  "Product",
  ProductSchema,
);
