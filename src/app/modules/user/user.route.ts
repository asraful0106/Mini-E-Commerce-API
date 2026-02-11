import { Router } from "express";
import { userController } from "./user.controller.js";
import { validateRequest } from "../../middlewares/validateReqest.js";
import { creatUserZodSchema, updateUserZodSchema } from "./user.validation.js";
import { memoryUpload } from "../../config/multer.js";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { UserRole } from "./user.interface.js";

const router = Router();

router.post(
  "/register",
  validateRequest(creatUserZodSchema),
  userController.createUser,
);

router.patch(
  "/:id",
  memoryUpload.single("image"),
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(UserRole)),
  userController.updateUser,
);

router.delete("/:id", userController.deleteUser);

export const userRouter = router;
