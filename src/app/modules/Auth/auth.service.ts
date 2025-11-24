import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../../errors/ApiErrors";

import { jwtHelpers } from "../../../helpars/jwtHelpers";
import prisma from "../../../shared/prisma";
import { AuthUtils } from "./auth.utils";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!userData) {
    throw new Error("User not found");
  }

  if (!payload.password || !userData?.password) {
    throw new Error("Password is required");
  }
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Password incorrect!");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      photo: userData.photo || null,
    },
    config.jwt.jwt_secret as Secret,
    (config.jwt.expires_in as string) || "7d"
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      photo: userData.photo || null,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    message: "User logged in successfully",
  };
};

const register = async (payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  const isExist = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (isExist) {
    throw new ApiError(httpStatus.CONFLICT, "email already used");
  }
  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, 12);
  }

  const newUser = await prisma.user.create({ data: payload });
  return { message: "register success" };
};

export const AuthServices = {
  loginUser,
  register,
};
