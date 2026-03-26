import { Router } from "express";
import { memoryUpload } from "../../config/multer.js";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { validateRequest } from "../../middlewares/validateReqest.js";
import { UserRole } from "../user/user.interface.js";
import { productController } from "./product.controller.js";
import {
  createProductZodSchema,
  updateProductZodSchema,
} from "./product.validation.js";

const router = Router();

// Get all products
router.get("/", productController.getProducts);

//Get product by ID
router.get("/:id", productController.getProductByID);

// Get products by category
router.get("/category/:category", productController.getProductsByCategory);

// Create product
// form-data:
// - images: (multiple files)
// - name, price, stock_qty ...
router.post(
  "/",
  memoryUpload.array("images", 10),
  validateRequest(createProductZodSchema),
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  productController.createProduct,
);

// Update product
router.patch(
  "/:id",
  memoryUpload.array("images", 10),
  validateRequest(updateProductZodSchema),
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  productController.updateProduct,
);

router.delete(
  "/:id",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  productController.deleteProduct,
);

export const productRouter = router;
