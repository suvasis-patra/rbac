import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { ErrorCode } from "../utils/types";
import { User } from "../models/user.model";
import { UserLoginSchema, UserSchema } from "../utils/validation";
import { ApiError } from "../utils/ErrorResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import {
  generateAccessTokenAndRefreshToken,
  isPasswordCorrect,
} from "../utils";
import { ObjectId } from "mongoose";

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const userData = req.body;
    const validateUser = UserSchema.safeParse(userData);
    if (!validateUser.success) {
      throw new ApiError(400, "validation error", ErrorCode.VALIDATION_FAILED);
    }
    const { fullName, email, password } = validateUser.data;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(401, "Email already exist", ErrorCode.EMAIL_EXIST);
    }
    const user = new User({ fullName, email, password });
    await user.save();

    res.status(201).json(new ApiResponse(201, user._id, "user registered!"));
  }
);

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const userData = req.body;
  const validateUser = UserLoginSchema.safeParse(userData);
  if (!validateUser.success) {
    throw new ApiError(400, "validation error", ErrorCode.VALIDATION_FAILED);
  }
  const { email, password } = validateUser.data;
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new ApiError(400, "User not found", ErrorCode.USER_NOT_FOUND);
  }
  const isCorrect = await isPasswordCorrect({
    password,
    hashedPassword: existingUser.password,
  });
  if (!isCorrect) {
    throw new ApiError(
      401,
      "Unauthorized request",
      ErrorCode.UNAUTHORIZED_ACCESS
    );
  }
  const { accessToken, refreshToken } = generateAccessTokenAndRefreshToken(
    existingUser._id
  );
  const user = await User.findById(existingUser._id);
  if (!user) {
    throw new ApiError(400, "User not found", ErrorCode.USER_NOT_FOUND);
  }
  user.refreshToken = refreshToken;
  await user.save();

  const options = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          userId: user._id,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});
export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    const incomingRefreshToken = req.cookies.refreshToken;
    if (!incomingRefreshToken) {
      throw new ApiError(
        401,
        "Unauthorized request!",
        ErrorCode.UNAUTHORIZED_ACCESS
      );
    }
    const userInfo = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as { userId: ObjectId };
    const user = await User.findById(userInfo.userId);
    if (!user) {
      throw new ApiError(401, "User not found!", ErrorCode.USER_NOT_FOUND);
    }
    if (user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(
        401,
        "Unauthorized request!",
        ErrorCode.UNAUTHORIZED_ACCESS
      );
    }
    const { accessToken, refreshToken } = generateAccessTokenAndRefreshToken(
      user._id
    );
    const options = {
      httpOnly: true,
      secure: true,
    };
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            userId: user._id,
            accessToken,
            refreshToken,
          },
          "Token refreshed!"
        )
      );
  }
);
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.headers["userId"];
  if (!userId) {
    throw new ApiError(400, "User not found", ErrorCode.USER_NOT_FOUND);
  }
  await User.findByIdAndUpdate(
    userId,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  res
    .send(204)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(204, null, "logged out!"));
});
