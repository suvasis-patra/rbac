import { Request, Response } from "express";

import { ErrorCode } from "../utils/types";
import { User } from "../models/user.model";
import { UserSchema } from "../utils/validation";
import { ApiError } from "../utils/ErrorResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";

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
