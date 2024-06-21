import errorHandler from "../utils/errorHandler";
import { NextFunction, Request, Response } from "express";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Set default status code and message if not provided
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

  // Wrong MongoDB ID error
  if (err.name === "CastError") {
    const message = `Resource not found: Invalid ${err.path}`;
    err = new errorHandler(message, 400);
  }

  // Duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new errorHandler(message, 400);
  }

  // JWT token expired error
  if (err.name === "TokenExpiredError") {
    const message = "JSON Web Token is expired. Try again!";
    err = new errorHandler(message, 400);
  }

  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = "JSON Web Token is invalid. Try again!";
    err = new errorHandler(message, 400);
  }

  // Return the error response
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
