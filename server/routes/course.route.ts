import express from "express"
import {  addAnswer, addQuestionInCourse, deleteCourse, getAllCourses, getAllCoursesByAdmin, getCourseByUser, getSingleCourse, updateCourseInfo, uploadCourse} from "../controllers/course.controller";
import { authorizedRole, isAuthenticated } from "../middleware/auth.middleware";

const courseRouter=express.Router();


courseRouter.post("/create-course",isAuthenticated as any,authorizedRole("admin") ,uploadCourse as any)
courseRouter.put("/update-course-info/:id",isAuthenticated as any,authorizedRole("admin") ,updateCourseInfo as any)
courseRouter.get("/get-single-course/:id",isAuthenticated as any ,getSingleCourse as any)
courseRouter.get("/get-all-courses",isAuthenticated as any ,getAllCourses as any)
courseRouter.get("/get-single-course-byuser/:id",isAuthenticated as any ,getCourseByUser as any)
courseRouter.put("/add-question",isAuthenticated as any ,addQuestionInCourse as any)
courseRouter.put("/reply-question",isAuthenticated as any ,addAnswer as any)
courseRouter.get("/get-all-course-byAdmin",isAuthenticated as any,authorizedRole("admin") ,getAllCoursesByAdmin as any)
courseRouter.delete("/delete-course/:id",isAuthenticated as any,authorizedRole("admin") ,deleteCourse as any)



export default courseRouter;

