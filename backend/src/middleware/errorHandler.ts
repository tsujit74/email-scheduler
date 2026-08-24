import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof AppError) {
    console.error(
      `[${err.statusCode}] ${err.message}`,
    );

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  console.error("[500] Unexpected error:", err);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}