import { Router } from "express";
import { userController } from "./user.controller.js";
import { validateRequest } from "../../middlewares/validateReqest.js";
import { creatUserZodSchema } from "./user.validation.js";

const router = Router();

router.post(
  "/register",
  validateRequest(creatUserZodSchema),
  userController.createUser,
);

export const userRouter = router;