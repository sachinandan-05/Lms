import { NextFunction, Response, Request } from "express";
import { catchAsyncError } from "../utils/catchAsyncError";
import cloudinary from "cloudinary";
import createCourse, { getAllCourseService } from "../service/course_service";
import errorHandler from "../utils/errorHandler";
import courseModel from "../models/course.model";
import redisClient from "../utils/redis";
import mongoose from "mongoose";
import sendMail from "../utils/sendMails";
import notificationModel from "../models/notification.model";

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

            await redisClient.set(courseId, JSON.stringify(course),'EX',604800);//7days expire

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
    } catch (error: any) {
        return next(new errorHandler(error.message, 500));
    }



})

// --------------------------get-courses-deatails__for valid user-----------------------
interface customRequest extends Request {
    user?: any
}
export const getCourseByUser = catchAsyncError(async (req: customRequest, res: Response, next: NextFunction) => {
    try {
        const userCourseList = req.user?.courses;
        const courseId = req.params.id;
        const courseExist = userCourseList?.find((course: any) => course._id === courseId)
        if (!courseExist) {
            throw next(new Error("you are not eligible to access this course!"))
        }

        const course = await courseModel.findById(courseId);
        const content = course?.courseData;

        res.status(200).json({
            success: true,
            content
        })

    } catch (error: any) {
        return next(new errorHandler(error.message, 500));


    }
})

// ----------------------------add-question_in_course--------------------------------------------------

interface IAddQuestionData {
    question: string,
    courseId: string,
    contentId: string

}
export const addQuestionInCourse = catchAsyncError(async (req: customRequest, res: Response, next: NextFunction) => {
    try {
        const { question, courseId, contentId }: IAddQuestionData = req.body;
        const course = await courseModel.findById(courseId);
        if(!course){
            throw new Error("course doesnot exist");
        }
        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new errorHandler("invalid content id!", 400))

        }
        const courseContent = course?.courseData.find((item: any) => item._id.equals(contentId));
        if (!courseContent) {
            return next(new errorHandler("invalid content id!", 400))

        }
        //  create a  new quetion object

        const newQuestion: any = {
            user: req.user,
            question,
            questionReply: []
        }
        // add this question to our course 

        courseContent.questions.push(newQuestion);
        //----- add notifiction
        await notificationModel.create({
            userId: req.user._id,
            title: "New question",
            message: `You have a new question on this course:${courseContent.title}`
        })



        // save the updated course
        await course?.save();
        res.status(200).json({
            success: true,
            course,
        })
    } catch (error: any) {
        return next(new errorHandler(error.message, 500));
    }
})

// --------------------------add answer of question---------------------------------

interface IAddAnswertoQuestion {
    answer: string,
    courseId: string,
    contentId: string,
    questionId: string
}
export const addAnswer = catchAsyncError(async (req: customRequest, res: Response, next: NextFunction) => {
    try {
        const { answer, courseId, contentId, questionId }: IAddAnswertoQuestion = req.body

        const course = await courseModel.findById(courseId);
        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new errorHandler("invalid content id!", 400))

        }
        const courseContent = course?.courseData.find((item: any) => item._id.equals(contentId));
        if (!courseContent) {
            return next(new errorHandler("invalid content id!", 400))
        }
        const question = courseContent.questions.find((item: any) => item._id.equals(questionId));

        if (!question) {
            return next(new errorHandler("invailid question Id", 400));
        }
        //create a new answer
        const newAnswer: any = {
            user: req.user,
            answer
        }

        question?.questionReplies?.push(newAnswer);

        if (req.user._id === question?.user?._id) {
            // send Notification
            await notificationModel.create({
                userId: req.user._id,
                title: "New reply on question",
                message: `You have a new question's reply on this course:${courseContent.title}`
            })
        } else {
            // send mail
            const data = {
                name: question?.user.name,
                title: courseContent.title
            }
            try {
                await sendMail({
                    email: question.user.email,
                    subject: "question-reply",
                    template: "question-reply.ejs",
                    data
                })

            } catch (error: any) {
                return next(new errorHandler(error.message, 500));
            }
        }
        // save in data base
        course?.save();
        res.status(200).json({
            success: true,
            course,
        })
    } catch (error: any) {
        return next(new errorHandler(error.message, 500));

    }


})

// -------------------------------get all courses -only for admin---------------------------------------

export const getAllCoursesByAdmin = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courses = await getAllCourseService();
  
        res.status(200).json({
            success: true,
            courses
        });
    } catch (error: any) {
        next(new errorHandler(error.message, 500));
    }
  });

//   ------------------------------delete course by admin---------------------------

export const deleteCourse= catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {id}=req.params as {id:string}
        console.log("id",id)
    
        const course= await courseModel.findById(id);
        console.log("course",course)
        if(!course){
            return next(new errorHandler("course not found",400));
            }
    
            await courseModel.findByIdAndDelete(id);
            const cacheCourse= await redisClient.get(id);
            if (cacheCourse) {
                await redisClient.del(id);    
            }
            

            res.status(200).json({
                success:true,
                message:"course deleted successfull"
            })
    } catch (error:any) {
        next(new errorHandler(error.message, 500));
        
    }
})