import dotenv from "dotenv";
import { IUser } from "../models/user.model";
import { Response } from "express";
import redisClient from "./redis";
dotenv.config();

interface ITokenOptions {
    expires: Date;
    maxAge: number;
    httpOnly: boolean;
    sameSite: 'lax' | 'strict' | 'none' | undefined;
    secure?: boolean;
}
 // Parse environment variable to integrate with fallback value
 const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRY|| '900', 10);
 const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRY || '1200', 10);


    // Options for cookies

export const accessTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire *60*60* 1000),
    maxAge: accessTokenExpire *60*60* 1000,
    httpOnly: true,
    sameSite: 'lax'
};
export const refreshTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire *24*60*60* 1000),
    maxAge: refreshTokenExpire *24*60*60* 1000,
    httpOnly: true,
    sameSite: 'lax'
};
export const sendToken =  async(user: IUser, statusCode: number, res: Response) => {
    const accessToken =   await user.signinAccessToken();
    const refreshToken = await user.signResfreshToken();

    // Upload session to Redis
     redisClient.set(user._id, JSON.stringify(user));

 
   

    // Only set secure to true in production
    if (process.env.NODE_ENV === 'production') {
        accessTokenOptions.secure = true;
        refreshTokenOptions.secure = true;
    }
  
    res.cookie("accessToken", accessToken, accessTokenOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenOptions);

    
    
    res.status(statusCode).json({
        success: true,
        user,
        accessToken,
        message: "Login successfully!"
    });

   

   
};
