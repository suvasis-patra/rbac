import { NextFunction, Request, Response } from "express";

import { ErrorCode } from "../utils/types";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ErrorResponse";

export const authorizeRole =
  (roles: string[]) =>
  async (req: Request, _: Response, next: NextFunction) => {
    const userId = req.headers["userId"];
    if (!userId) {
      throw new ApiError(401, "User not found!", ErrorCode.USER_NOT_FOUND);
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(401, "User not found!", ErrorCode.USER_NOT_FOUND);
    }
    if (!roles.includes(user.role)) {
      throw new ApiError(403, "Access Denied!", ErrorCode.UNAUTHORIZED_ACCESS);
    }
    next();
  };
