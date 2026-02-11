import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/AppError.js";
import { Provider, type IAuthProvider, type IUser } from "./user.interface.js";
import { User } from "./user.model.js";
import { envVars } from "../../config/env.js";
import bcrypt from "bcryptjs";
import { deleteLocalFileByUrl } from "../../utils/localUpload.js";

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
    name,
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });
  return user;
};

const updateUser = async (
  id: string,
  payload: Partial<IUser>,
  imageUrl?: string,
) => {
  const user = await User.findById(id);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found!");
  }

  if (imageUrl && envVars.PROVIDER === "LOCAL") {
    const isLocalImage = user.image?.provider === Provider.LOCAL;

    if (isLocalImage && user.image?.url) {
      await deleteLocalFileByUrl(user.image.url);
    }

    user.image = {
      url: imageUrl,
      provider: Provider.LOCAL,
    };
  }

  Object.assign(user, payload);

  await user.save();

  return user;
};

const deleteUser = async (id: string) => {
  const user = await User.findById(id);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found!");
  }

  if (user.image?.provider === Provider.LOCAL) {
    await deleteLocalFileByUrl(user.image?.url);
  }

  user.isDeleted = true;
  await user.save();

  return { message: "User deleted successfully" };
};

export const userService = {
  createUser,
  updateUser,
  deleteUser,
};
