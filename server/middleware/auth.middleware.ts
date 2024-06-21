import dotenv from "dotenv";
import { Response, Request, NextFunction } from "express";
import { catchAsyncError } from "../utils/catchAsyncError";
import jwt, { JwtPayload } from "jsonwebtoken";
import redisClient from "../utils/redis";
import errorHandler from "../utils/errorHandler";
dotenv.config();

// Extend the Request interface to include the user property
interface CustomRequest extends Request {
  user?: any;
}

export const isAuthenticated = catchAsyncError(async (req: CustomRequest, res: Response, next: NextFunction) => {
  const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

  if (!accessToken) {
    return next(new errorHandler("Please login to access this resource!", 401));
  }

  let decoded: string | JwtPayload;
  try {
    decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN as string) as string | JwtPayload;
  } catch (error) {
    return next(new errorHandler("Invalid access token", 400));
  }

  if (typeof decoded === 'string' || !decoded) {
    return next(new errorHandler("Invalid access token", 400));
  }

  const userId = (decoded as JwtPayload).id;

  const user = await redisClient.get(userId);

  if (!user) {
    return next(new errorHandler("User not found", 404));
  }

  req.user = JSON.parse(user);
  next();
});

//  -----validate user role------

export const authorizedRole = (...roles: string[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || '')) {
      return next(new errorHandler(`Role: ${req.user?.role} is not allowed to access this resource`, 403));
    }
    next();
  };
};
