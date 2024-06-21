import express from "express"
import {  getAllCourses, getCourseByUser, getSingleCourse, updateCourseInfo, uploadCourse} from "../controllers/course.controller";
import { authorizedRole, isAuthenticated } from "../middleware/auth.middleware";

const courseRouter=express.Router();


courseRouter.post("/create-course",isAuthenticated as any,authorizedRole("admin") ,uploadCourse as any)
courseRouter.put("/update-course-info/:id",isAuthenticated as any,authorizedRole("admin") ,updateCourseInfo as any)
courseRouter.get("/get-single-course/:id",isAuthenticated as any ,getSingleCourse as any)
courseRouter.get("/get-all-courses",isAuthenticated as any ,getAllCourses as any)
courseRouter.get("/get-single-course-byuser/:id",isAuthenticated as any ,getCourseByUser as any)



export default courseRouter;

