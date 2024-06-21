import { NextFunction, Response, Request } from "express";
import { catchAsyncError } from "../utils/catchAsyncError";
import cloudinary from "cloudinary";
import createCourse from "../service/course_service";
import errorHandler from "../utils/errorHandler";
import courseModel from "../models/course.model";
import redisClient from "../utils/redis";

// -------------------------------------------upload_course-------------------------------------
export const uploadCourse = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            console.log("Data received:", data);

            const thumbNail = data?.thumbNail;
            if (thumbNail && thumbNail.url) {
                console.log(
                    "Uploading thumbnail to Cloudinary",
                    new Date().toISOString()
                );
                const myCloud = await cloudinary.v2.uploader.upload(thumbNail.url, {
                    folder: "courses",
                });

                data.thumbNail = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
            } else {
            }

            await createCourse(data, res as any, next);
        } catch (error: any) {
            return next(new errorHandler(error.message, 500));
        }
    }
);

// ----------------------------------------------edit_course----------------------------------

export const updateCourseInfo = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;

            const thumbNail = data?.thumbNail;
            if (thumbNail) {
                await cloudinary.v2.uploader.destroy(thumbNail.public_id);
                const myCloud = await cloudinary.v2.uploader.upload(thumbNail, {
                    folder: "courses",
                });
                data.thumbNail = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
            }
            const courseId = req.params.id;

            const course = await courseModel.findByIdAndUpdate(
                courseId,
                {
                    $set: data,
                },
                {
                    new: true,
                }
            );

            return res.status(201).json({
                message: "course updated successfully !",
                success: true,
                course
            })
        } catch (error: any) {
            return next(new errorHandler(error.message, 500));
        }
    }
);

// -------------------------get-single-course__without_purchase-------------------------------

export const getSingleCourse = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseId = req.params.id
        const isCacheExist = await redisClient.get(courseId)
        if (isCacheExist) {
            const course = JSON.parse(isCacheExist)
            res.json({
                success: true,
                course,
                status: 201
            })
        }
        else {
            const course = await courseModel.findById(courseId).select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");

            await redisClient.set(courseId, JSON.stringify(course));

            res.status(201).json({
                success: true,
                course
            })
        }


    } catch (error: any) {
        return next(new errorHandler(error.message, 500));
    }
})

// -----------------------------get-all-Course__withoutPurshing--------------------------

export const getAllCourses = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

    try {
        const isCacheExist = await redisClient.get("allcourses")
        if (isCacheExist) {
            return res.status(201).json({
                success: true,
                isCacheExist
            })
        } else {
    
            const courses = await courseModel.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
    
            await redisClient.set("allcourses", JSON.stringify(courses));
    
            res.status(201).json({
                success: true,
                courses
            })
        }
    } catch (error:any) {
        return next(new errorHandler(error.message, 500));
    }

    
    
    })
    
// --------------------------get-courses-deatails__for valid user-----------------------
interface customRequest extends Request{
    user?:any
}
export const getCourseByUser = catchAsyncError(async (req: customRequest, res: Response, next: NextFunction) => {
    try {
        const userCourseList = req.user?.courses;
        const courseId = req.params.id;
        const courseExist = userCourseList?.find((course: any) => course._id === courseId)
        if (!courseExist) {
            throw next(new Error("you are not eligible to access this course!"))
        }

        const course= await courseModel.findById(courseId);
        const content= course?.courseData;

        res.status(200).json({
            success:true,
            content
        })

    } catch (error: any) {
        return next(new errorHandler(error.message, 500));


    }
})