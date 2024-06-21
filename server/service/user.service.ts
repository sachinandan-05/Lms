import {Response } from "express";
import errorHandler from "../utils/errorHandler";
import redisClient from "../utils/redis";


export const getUserInfoById=async(UserId:string ,res:Response)=>{
   try {
     const userJson=await redisClient.get(UserId)
     if(userJson){
        const user= JSON.parse(userJson);
        res.status(201).json({
            user,
            success:true
         })


     }
     
   } catch (error:any) {
    throw (new errorHandler(error.message,400));
    
   }

}