import { catchAsyncError } from "../utils/catchAsyncError";
import { Request, Response, NextFunction } from "express";
import errorHandler from "../utils/errorHandler";
import notificationModel from "../models/notification.model";
import { NetStream } from "ioredis/built/types";
import corn from "node-cron"
// import orderModel from "../models/order.model";

// -------------------------------get all notification----------------------------------------

export const getAllNotification = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const Notification = await notificationModel.find().sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            Notification

        })
    } catch (error: any) {
        return next(new errorHandler(error.message, 500));

    }
})
// -----------------------------update-notification-----------------------------------------

export const updateNotification = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notification_id = req.params.id;

        const notification = await notificationModel.findById(notification_id);
        if (!notification) {
            throw new Error("notification doesnot exist");

        }
        (notification?.status) ? notification.status = "read" : notification?.status

        await notification.save();
        const notifications = await notificationModel.find().sort({ createdAt: -1 })
        res.status(201).json({
            success: true,
            notifications
        })

    } catch (error: any) {
        return next(new errorHandler(error.message, 500));

    }

})
// ---------------------------------delete notification----------------------------------------

corn.schedule("0 0 0 * * *", async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await notificationModel.deleteMany({ status: "read", createdAt: { $lt: thirtyDaysAgo } });
})