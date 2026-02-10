import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError.js";
import type { IAuthProvider, IUser } from "./user.interface.js";
import { User } from "./user.model.js";
import { envVars } from "../../config/env.js";
import bcrypt from "bcryptjs";

const createUser = async (payload: Partial<IUser>) => {
  const { email, name, password, ...rest } = payload;

  if (!email || !name) {
    throw new AppError(StatusCodes.BAD_REQUEST, "All fileds are required.");
  }

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User Already Exist!");
  }

  const hashedPassword = await bcrypt.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND),
  );
  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });
  return user;
};

export const userService = {
  createUser,
  //   updateUser,
  //   getAllUser,
};
