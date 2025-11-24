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

export const AuthServices = {
  loginUser,
};
