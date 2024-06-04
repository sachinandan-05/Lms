import { NextFunction } from "express";

const catchAsyncError =
  (func: any) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(func(req, res, next)).catch(next);
  };

export { catchAsyncError };
