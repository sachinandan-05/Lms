import { Request, Response, NextFunction } from "express";
import { generateLast12MonthData } from "../utils/analytic.generator";
import { catchAsyncError } from "../utils/catchAsyncError";
import userModel from "../models/user.model";
import errorHandler from "../utils/errorHandler";
import courseModel from "../models/course.model";
import orderModel from "../models/order.model";


// ------------------------get user anlytic------------------------------------


export const getUserAnyltics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await generateLast12MonthData(userModel);
        res.status(201).json(
            {
                success: true,
                users
            }
        )
    } catch (error: any) {
        return next(new errorHandler(error.message, 500))

    }
})
// ------------------------get courses anlytic------------------------------------


export const getCoursesAnyltics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courses = await generateLast12MonthData(courseModel);
        res.status(201).json(
            {
                success: true,
                courses
            }
        )
    } catch (error: any) {
        return next(new errorHandler(error.message, 500))

    }
})
// ------------------------get oders anlytic------------------------------------


export const getOrdesAnalytic = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await generateLast12MonthData(orderModel);
        res.status(201).json(
            {
                success: true,
                orders
            }
        )
    } catch (error: any) {
        return next(new errorHandler(error.message, 500))

    }
})