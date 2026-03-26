// category.service.ts

import AppError from "../../errorHelper/AppError.js";
import type { ICategoryCreate, ICategoryUpdate } from "./category.interface.js";
import Category from "./category.model.js";

const createCategory = async (payload: ICategoryCreate) => {
  const existingCategory = await Category.findOne({ name: payload.name });
  if (existingCategory) {
    throw new AppError(409, "Category with this name already exists");
  }

  const category = await Category.create(payload);
  return category;
};

const getAllCategories = async () => {
  const categories = await Category.find({ isActive: true })
    .populate("parent", "name slug")
    .sort({ name: 1 });
  return categories;
};

const getCategoryById = async (id: string) => {
  const category = await Category.findById(id).populate("parent", "name slug");
  if (!category) {
    throw new AppError(404, "Category not found");
  }
  return category;
};

const updateCategory = async (id: string, payload: ICategoryUpdate) => {
  const category = await Category.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).populate("parent", "name slug");

  if (!category) {
    throw new AppError(404, "Category not found");
  }

  return category;
};

const deleteCategory = async (id: string) => {
  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    throw new AppError(404, "Category not found");
  }

  return category;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
