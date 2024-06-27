import express from "express"
import { authorizedRole, isAuthenticated } from "../middleware/auth.middleware";
import { getAllNotification, updateNotification } from "../controllers/notification.controller";


const notificationRoute= express.Router();

notificationRoute.get("/get-all-notification",isAuthenticated as any,authorizedRole("admin"), getAllNotification as any)
notificationRoute.put("/update-notification/:id",isAuthenticated as any,authorizedRole("admin"), updateNotification as any)

export default notificationRoute;