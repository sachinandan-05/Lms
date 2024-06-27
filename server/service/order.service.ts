import { NextFunction, Response } from "express";
import { catchAsyncError } from "../utils/catchAsyncError";
import orderModel, { IOrder } from "../models/order.model";

// ------create new order
export const newOrder = async (data: IOrder): Promise<IOrder> => {
    const order = await orderModel.create(data);
    return order;
};

// all order
export const getAllOrderService = async () => {
    const orders = await orderModel.find().sort({ createdAt: -1 });

    return orders;
}





