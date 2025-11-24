import { Request, Response } from "express";
import httpStatus from "http-status";
import config from "../../../config";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AuthServices } from "./auth.service";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUser(req.body);

  if (result.refreshToken) {
    // Set refresh token in cookies for verified users
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: config.env === "production",
      sameSite: "strict",
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: result.accessToken ? { accessToken: result.accessToken } : {},
  });
});
const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.register(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Registration successfully",
    data: result,
  });
});

export const AuthController = {
  loginUser,
  register,
};
