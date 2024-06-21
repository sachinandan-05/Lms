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



// router declaration

app.use("/app/v1/user",userRouter)
app.use("/app/v1/course",courseRouter)


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
