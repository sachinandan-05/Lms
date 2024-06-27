import express from "express";
import { createOrder, getAllOrderByAdmin } from "../controllers/order.controller";
import { authorizedRole, isAuthenticated } from "../middleware/auth.middleware";


const orderRoute= express.Router();

orderRoute.post("/order-course",isAuthenticated as any, createOrder as any)
orderRoute.get("/all-orders",isAuthenticated as any,authorizedRole("admin") ,getAllOrderByAdmin as any)

export default orderRoute;
