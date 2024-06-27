import { Response } from "express";
import errorHandler from "../utils/errorHandler";
import redisClient from "../utils/redis";
import userModel from "../models/user.model";


export const getUserInfoById = async (UserId: string, res: Response) => {
   try {
      const userJson = await redisClient.get(UserId)
      if (userJson) {
         const user = JSON.parse(userJson);
         res.status(201).json({
            user,
            success: true
         })
      }

   } catch (error: any) {
      throw (new errorHandler(error.message, 400));
   }

}


// ------------------------get all user----------------------------

export const getAllUserService=async()=>{
  const users= await userModel.find().sort({createdAt: -1});

   return users;
}

// ---------------------------updateUserRole--------------------------

export const updateUserRoleByAdminService= async(res:Response,id:string,role:string)=>{
   const user= await userModel.findByIdAndUpdate(id,{role},{new:true})

   res.status(201).json({
      success:true,
      message:"user role updated successfully!!",
      user
   })
}



