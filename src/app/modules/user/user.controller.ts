import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResposne } from "../../utils/sendResponse.js";
import { userService } from "./user.service.js";
import { saveLocalImage } from "../../utils/localUpload.js";
import { envVars } from "../../config/env.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const createdUser = await userService.createUser(req.body);

    sendResposne(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "User created successfully",
      data: createdUser,
    });
  },
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    let imageUrl: string | undefined;

    if (req.file) {
      if (envVars.PROVIDER == "LOCAL") {
        const saved = await saveLocalImage({
          buffer: req.file.buffer,
          originalname: req.file.originalname,
          // folder optional; defaults to public/uploads
        });
        imageUrl = saved.url;
      }
    }

    const updated = await userService.updateUser(id as string, req.body, imageUrl);

    sendResposne(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User updated successfully",
      data: updated,
    });
  },
);

const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await userService.deleteUser(id as string);

    sendResposne(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User deleted successfully",
      data: result,
    });
  },
);

export const userController = {
  createUser,
  updateUser,
  deleteUser,
};