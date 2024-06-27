import express from "express"
import { errorMiddleware } from "./middleware/error"
import  { NextFunction, } from "express"
import cookieParser from "cookie-parser"
import { Request,Response } from "express"
import cors from "cors"


export const app = express ()


//bodyparser

app.use(express.json({limit:"50mb"}))

// cookie-parser

app.use(cookieParser())

//cors =>cros origin resource sharing

app.use(
    cors({
        origin:process.env.CROS_ORIGIN
    })
)

//testing api

app.get("/test",(req:Request,res:Response,next:NextFunction)=>{
    res.json({
        status:200,
        message:"app is running "
    })
})




// router installation
import userRouter from "./routes/user.route"
import courseRouter from "./routes/course.route"
import orderRoute from "./routes/order.route"
import notificationRoute from "./routes/notification.route"
import analyticRoute from "./routes/anyltic.route"
import layoutRoute from "./routes/layout.route"

// router declaration

app.use("/app/v1/user",userRouter)
app.use("/app/v1/course",courseRouter)
app.use("/app/v1/order",orderRoute)
app.use("/app/v1/notification",notificationRoute)
app.use("/app/v1/anlytic",analyticRoute)
app.use("/app/v1/layout",layoutRoute)


//error 
app.use(errorMiddleware);


// unknown route

app.get("*",(req:Request,res:Response,next:NextFunction)=>{
    res.json({
        status:404,
        message:"this route is not declare",
        error:true
    })
})
