import dotenv from "dotenv"
import express, { NextFunction, response } from "express"
import cookieParser from "cookie-parser"
import { Request,Response } from "express"
import cors from "cors"
import app from "./app"
import connectDb from "./utils/db"
import { errorMidleware } from "./middleware/error"
dotenv.config({
    path:".env"
})


app.listen(process.env.PORT || 8080 ,()=>{
    console.log(`port is listining on port:${process.env.PORT}`)
})

//db connection
connectDb()


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

//unknown route

app.get("*",(req:Request,res:Response,next:NextFunction)=>{
    res.json({
        status:404,
        message:"this route is not declare",
        error:true
    })
})

//error 
app.use(errorMidleware);
