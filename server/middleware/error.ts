import errorHandler from "../utils/errorHandler";
import { NextFunction, Request, Response } from "express";

export const errorMidleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "internal server error";

  // wrong mongodb id error
  if (err.name === "castError") {
    const message = `resorce not found invalid:${err.path}`;
    err = new errorHandler(message, 400);
  }
  //duplicate key error
  if (err.code === 11000) {
    const message = `duplicate ${Object.keys(err.keyValue)} entered`;
    err = new errorHandler(message, 400);
  }
  //wrong jwt erro
  if ((err.name = "jsonWebTokenError")) {
    const message = `json web token is invailid try again`;
    err = new errorHandler(message, 400);
  }

  //jwt token expired error

  if (err.name === "TokenExpiredError") {
    const message = `json web token is expired , try Again!!`;
    err = new errorHandler(message, 400);
  }

  res.status(500).json({
    success: false,
    message: err.message,
  });
};
