import express from "express";
import { authorizedRole, isAuthenticated } from "../middleware/auth.middleware";
import { getCoursesAnyltics, getOrdesAnalytic, getUserAnyltics } from "../controllers/analytic.controller";

const analyticRoute = express.Router();

analyticRoute.get("/user-analtic",isAuthenticated as any ,authorizedRole("admin"),getUserAnyltics as any);
analyticRoute.get("/courses-analtic",isAuthenticated as any ,authorizedRole("admin"),getCoursesAnyltics as any);
analyticRoute.get("/orders-analytic",isAuthenticated as any ,authorizedRole("admin"),getOrdesAnalytic as any);
export default analyticRoute;
