import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResposne } from "../../utils/sendResponse.js";
import { userService } from "./user.service.js";

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

export const userController = {
  createUser,
//   updateUser,
//   getAllUser,
};