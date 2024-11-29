import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ErrorResponse";
import { ErrorCode } from "../utils/types";

export const notFoundError = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new ApiError(
    404,
    "resource not found",
    ErrorCode.RESOURCE_NOT_FOUND
  );
  next(error);
};
