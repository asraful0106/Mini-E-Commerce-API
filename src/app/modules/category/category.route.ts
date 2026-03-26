// category.route.ts
import express from "express";
import {
  categoryIdParamSchema,
  createCategoryZodSchema,
  updateCategoryZodSchema,
} from "./category.validation.js";
import { CategoryController } from "./category.controller.js";
import { validateRequest } from "../../middlewares/validateReqest.js";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { UserRole } from "../user/user.interface.js";

const router = express.Router();

router.post(
  "/",
  validateRequest(createCategoryZodSchema),
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  CategoryController.createCategory,
);

router.get("/", CategoryController.getAllCategories);

router.get(
  "/:id",
  validateRequest(categoryIdParamSchema),
  CategoryController.getCategoryById,
);

router.patch(
  "/:id",
  validateRequest(updateCategoryZodSchema),
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  CategoryController.updateCategory,
);

router.delete(
  "/:id",
  validateRequest(categoryIdParamSchema),
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  CategoryController.deleteCategory,
);

export const CategoryRoutes = router;
