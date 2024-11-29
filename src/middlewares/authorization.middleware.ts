import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose";
import { NextFunction, Request, Response } from "express";

import { ErrorCode } from "../utils/types";
import { ApiError } from "../utils/ErrorResponse";
import { User } from "../models/user.model";

export const authUser = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const accessToken =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  if (!accessToken) {
    throw new ApiError(
      401,
      "Unauthorized request!",
      ErrorCode.UNAUTHORIZED_ACCESS
    );
  }
  const decodedToken = jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET!
  ) as { userId: ObjectId };

  const user = await User.findById(decodedToken.userId);
  if (!user) {
    throw new ApiError(400, "User not found!", ErrorCode.USER_NOT_FOUND);
  }
  req.headers["userId"] = user._id.toString();
  next();
};
