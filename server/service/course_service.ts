import { Response,  NextFunction } from "express";
import courseModel from "../models/course.model";
import { catchAsyncError } from "../utils/catchAsyncError";
import errorHandler from "../utils/errorHandler";


// ---------------------------------create_course-----------------------------------------

const createCourse = async (data: any, res: Response, next: NextFunction) => {
    try {
        const course = new courseModel(data);
        await course.save();
        return res.status(201).json({
          message:"course uploded successfully",
          success:true,
          course
        })
    } catch (error: any) {
        next(new errorHandler(error.message, 500));
    }
};

export default createCourse;
