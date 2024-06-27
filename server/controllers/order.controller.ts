import { catchAsyncError } from "../utils/catchAsyncError";
import { Request, Response, NextFunction } from "express";
import errorHandler from "../utils/errorHandler";
import userModel, { IUser } from "../models/user.model";
import courseModel from "../models/course.model";
import { getAllOrderService, newOrder } from "../service/order.service";
import sendMail from "../utils/sendMails";
import notificationModel from "../models/notification.model";
import { IOrder } from "../models/order.model";


// ---------------------------create_order----------------------------------------------------------

interface CustomRequest extends Request {
    user: IUser;
}

export const createOrder = catchAsyncError(async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const { courseId, payment_info } = req.body as { courseId: string; payment_info: object };
        const userId = req.user?._id as string;

        if (!userId) {
            return next(new errorHandler("Invalid user ID", 400));
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return next(new errorHandler("User not found", 404));
        }

        const courseExists = user.courses.some((course) => course.course_Id === courseId);
        if (courseExists) {
            return next(new errorHandler("You have already purchased this course!", 400));
        }

        const course = await courseModel.findById(courseId);
        if (!course) {
            return next(new errorHandler("Course not found!", 404));
        }

        const data: any = {
            courseId: courseId,
            userId: userId,
            payment_info: payment_info
        };

        const mailData = {
            order: {
                _id: courseId.slice(0, 6),
                name: course.name,
                price: course.price,
                date: new Date().toLocaleDateString('en-us', {
                    year: "numeric", month: "long", day: "2-digit"
                })
            }
        };

        try {
            await sendMail({
                email: user.email,
                subject: "Order Confirmation",
                template: "order-confirmation.ejs",
                data: mailData
            });
        } catch (error: any) {
            return next(new errorHandler(error.message, 500));
        }

        user.courses.push({ course_Id: courseId });
        await user.save();

        // Notification for admin
        await notificationModel.create({
            userId: userId,
            title: "New Order",
            message: `You have a new order for the course: ${course.name}`
        });

        course.purchased = (course.purchased || 0) + 1;
        await course.save();

        const order = await newOrder(data);

        res.status(201).json({
            success: true,
            order
        });

    } catch (error: any) {
        return next(new errorHandler(error.message, 500));
    }
});

// ---------------------getAllOrderByAdmin--------------------------------------

export const getAllOrderByAdmin = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courses = await getAllOrderService();

        res.status(200).json({
            success: true,
            courses
        });
    } catch (error: any) {
        next(new errorHandler(error.message, 500));
    }
});
