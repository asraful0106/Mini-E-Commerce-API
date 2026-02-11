import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import passport from "passport";
import AppError from "../../errorHelper/AppError.js";
import { createUserTokens } from "../../utils/userTokens.js";
import { clearCookies, setAuthCookie } from "../../utils/manageCookies.js";
import { sendResposne } from "../../utils/sendResponse.js";
import { StatusCodes } from "http-status-codes";
import { AuthServices } from "./auth.service.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const credentialsLogin = catchAsync(async (req, res, next) => {
  passport.authenticate("local", async (err: any, user: any, info: any) => {
    if (err) return next(new AppError(401, err));
    if (!user) return next(new AppError(401, info?.message || "Unauthorized"));

    const userTokens = await createUserTokens(user);

    const safeUser = user.toObject();
    delete safeUser.password;

    setAuthCookie(res, userTokens);

    return sendResposne(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User Logged In Successfully.",
      data: safeUser,
    });
  })(req, res, next);
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "No refresh token recieved from cookies",
      );
    }

    const tokenInfo = await AuthServices.getNewAccessToken(
      refreshToken as string,
    );

    setAuthCookie(res, tokenInfo);

    sendResposne(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "New Acess Token Retrived Successfuly.",
      data: tokenInfo,
    });
  },
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    clearCookies(res, ["accessToken", "refreshToken"]);
    sendResposne(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User Logged Out Successfuly.",
      data: null,
    });
  },
);

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
};
