import userModel, { IUser } from "../models/user.model";
import dotenv from "dotenv";
import errorHandler from "../utils/errorHandler";
import { catchAsyncError } from "../utils/catchAsyncError";
import { Response, Request, NextFunction, json } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMails";
import { accessTokenOptions, refreshTokenOptions, sendToken } from "../utils/jwt";
dotenv.config();
import bcrypt from "bcrypt";
import redisClient from "../utils/redis";
import { getAllUserService, getUserInfoById, updateUserRoleByAdminService } from "../service/user.service";
import { set } from "mongoose";
import cloudinary from "cloudinary"

// create token

interface IActiveToken {
  token: string;
  activationCode: string;
}

export const createActivationToken = (user: any): IActiveToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    { user, activationCode },

    process.env.ACTIVATION_SECRET as Secret,

    {
      expiresIn: "5m",
    }
  );

  return { token, activationCode };
};

// resister user
interface IresistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

const userRegistration = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      // email exist?
      const IsemailExist = await userModel.findOne({ email });
      if (IsemailExist) {
        return next(
          new errorHandler(
            " The email address you entered is already registered. Please use a different email address!",
            400
          )
        );
      }

      const user: IresistrationBody = {
        name,
        email,
        password,
      };
      console.log("user email:", user.email);
      const activationToken = createActivationToken(user);

      const activationCode = activationToken.activationCode;

      const data = { user: { name: user.name }, activationCode };

      // const html = await ejs.renderFile(path.join(__dirname+"../mails/activateEmail.ejs"),data)
      // console.log("html",html)

      try {
        await sendMail({
          email: user.email,
          subject: "activate your account",
          template: "activateEmail.ejs",
          data,
        });

        res.status(201).json({
          success: true,
          message: `please check your email! ${user.email} to activate your account`,
          activationToken: activationToken.token,
          activationCode: activationToken.activationCode,
        });
      } catch (error: any) {
        return next(new errorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new errorHandler(error.message, 400));
    }
  }
);

//--------------------------------- activate user-----------------------------------------------------

interface IactivationRequest {
  activation_token: string;
  activation_code: string;
}

const activateUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IactivationRequest;

      // console.log(req.body)

      const decodedToken = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as { user: IUser; activationCode: string };

      if (decodedToken.activationCode !== activation_code) {
        return next(new errorHandler("Invalid activation code", 400));
      }

      const { name, email, password } = decodedToken.user;

      const existingUser = await userModel.findOne({ email });

      if (existingUser) {
        return next(
          new errorHandler("A user with this email already exists", 400)
        );
      }

      const newUser = await userModel.create({
        name,
        email,
        password,
      });
      await newUser.save();
      console.log("user", newUser);

      console.log(newUser);
      res.status(201).json({
        success: true,
        data: newUser,
      });
    } catch (error: any) {
      return next(new errorHandler(error.message, 400));
    }
  }
);
// -----------------------------------------------login user--------------------------------------------------------

interface Ilogin {
  email: string;
  password: string;
}

const loginUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return next(new errorHandler("please enter email and password!", 400));
      }

      const user = await userModel.findOne({ email }).select("+password");

      if (!user) {
        return next(new errorHandler("invalid email or password!", 400));
      }

      const isPasswordMatch = await user.comparePassword(password); //checking password

      if (!isPasswordMatch) {
        return next(new errorHandler("invalid password!", 400));
      }

      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new errorHandler(error.message, 400));
    }
  }
);

// ------------------------------logout user------------------------------------------------------------------
interface CustomRequest extends Request {
  user?: any;
}
const logoutUser = catchAsyncError(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      res.cookie("accessToken", "", { maxAge: 1 });
      res.cookie("refreshToken", "", { maxAge: 1 });

      const userId = req.user?._id || "";
      console.log("userId", userId);
      redisClient.del(userId);
      res.status(200).json({
        message: "logout successfully!",
      });
      console.log("logout done");
    } catch (error: any) {
      return new errorHandler(error.message, 400);
    }
  }
);

// --------------------------------update -----access----token------------------------------------

const updateAccessToken = catchAsyncError(async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const refresh_Token = req.cookies?.refreshToken;
    const decodedToken = jwt.verify(refresh_Token, process.env.REFRESH_TOKEN as string) as JwtPayload;
    const message = "could not refresh token";
    if (!decodedToken) {
      return next(new errorHandler(message, 400))

    }
    const session = await redisClient.get(decodedToken.id as string);
    if (!session) {
      return next(new errorHandler("Plaese login to access this resources!", 400))
    }

    const User: IUser = JSON.parse(session);

    const accessToken = jwt.sign({ id: User._id }, process.env.ACCESS_TOKEN as string, { expiresIn: "5m" })
    const refreshToken = jwt.sign({ id: User._id }, process.env.REFRESH_TOKEN as string, { expiresIn: "3d" })

    req.user = User;

    res.cookie("accessToken", accessToken, accessTokenOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenOptions);
    await redisClient.set(User._id,JSON.stringify(User),"EX",604800); //expire in 7day

    res.status(200).json({
      success: true,
      User,
      accessToken,
      message: "refresh successfully!"
    });


  } catch (error: any) {
    return next(new errorHandler(error.message, 400))

  }
})

// --------------------------------------getUserInfo-----------------------------------------------


const getuserDetails = catchAsyncError(async (req: CustomRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  console.log("userId", userId);
  getUserInfoById(userId, res);
})

// -----------------------------------------social auth----------------------------------------

interface ISocialAuthbody {
  email: string,
  name: string,
  avatar: string
}

const socialAuth = catchAsyncError(async (req: CustomRequest, res: Response, next: NextFunction) => {

  try {
    const { email, name, avatar } = req.body as ISocialAuthbody;
    const user = await userModel.findOne({ email });


    if (!user) {
      const newUser = await userModel.create({ email, name, avatar })
      sendToken(newUser, 200, res)
    }
  } catch (error: any) {
    return next(new errorHandler(error.message, 400))

  }
})

// ----------------------------------------update user details------------------------------------

interface IUpdateUserInfo {
  email: string,
  name: string
}

const updateUserDetails = catchAsyncError(async (req: CustomRequest, res: Response, next: NextFunction) => {

  try {
    const { email, name } = req.body as IUpdateUserInfo;

    const userId = req.user?._id;

    const user = await userModel.findById(userId)

    if (email && user) {
      const IsemailExist = await userModel.findOne({ email });
      console.log("user exist with this email", IsemailExist);
      if (IsemailExist) {
        next(new errorHandler("email already exist !!", 400))
      }
      user.email = email;

    }
    if (name && user) {
      user.name = name;

    }
    await user?.save();

    await redisClient.set(userId, JSON.stringify(user));

    res.json({
      user,
      success: true
    })
  } catch (error: any) {
    return next(new errorHandler(error.message, 400));

  }

})

// ------------------------------------update_user_password-------------------------------------------------

interface IUpdatePassword {
  oldPassword: string,
  newPassword: string
}

const updatePassword = catchAsyncError(async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { oldPassword, newPassword }: IUpdatePassword = req.body;

    if (!oldPassword) {
      throw new Error("Enter old Password!")
    }
    if (!newPassword) {
      throw new Error("Enter new Password!")
    }

    const userId = req.user?._id;
    if (!userId) {
      return res.status(400).json({ message: 'User not authenticated' });
    }

    // Fetch the user from the database
    const user = await userModel.findById(userId).select("+password");
    console.log("user", user)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // for social authentication
    if (user.password === undefined) {
      throw new errorHandler("invaild user", 400);

    }


    // Validate the old password
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Please enter correct password' });
    }


    // Update the user's password
    user.password = newPassword;
    await user.save();


    // Invalidate the Redis cache for the user
    await redisClient.set(userId, JSON.stringify(user));



    res.status(200).json({ message: 'Password changed successfully' });

  } catch (error: any) {
    return next(new errorHandler(error.message, 400));


  }
});

// ------------------------------------------update_avatar-------------------------------------------
interface IAvatar {
  avatar: string
}
const updateProfilePic = catchAsyncError(async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { avatar } = req.body as IAvatar;
  
    const userId = req.user?._id;
  
    const user = await userModel.findById(userId);
  
    if (user && avatar) {
      if (user?.avatar?.public_id) {
        await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);
  
        const my_cloud = await cloudinary.v2.uploader.upload(avatar, {
          folder: "avatars",
          width: "150",
        });
         // update avatar
        user.avatar = {
          public_id: my_cloud.public_id,
          url: my_cloud.secure_url
        }
      }
    }
  
    await user?.save();
  
    await redisClient.set(userId, JSON.stringify(user));

    return res.json({
      success:true,
      user,
      status:200,
      message:" profile picture updated successfully"
      
    })
  
  } catch (error:any) {
    return next(new errorHandler(error.message,400))
    
  }


})
// -------------------------get all user for -admin----------------------------------

 const getAllUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
      const users = await getAllUserService();

      res.status(200).json({
          success: true,
          users
      });
  } catch (error: any) {
      next(new errorHandler(error.message, 500));
  }
});
// --------------------------------update user role -only for user--------------------------------

const updateUserRole= catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{

  try {
    const{id,role}=req.body as {id:string,role:string}
     updateUserRoleByAdminService(res,id,role)
  
  } catch (error:any) {
    return next(new errorHandler(error.message,500));
    
  }

})

// -----------------------------delete user -only for admin-------------------------------

export const deleteUser= catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
  try {
    const {id }=req.params as {id:string}


    const user= await userModel.findById(id);

    if(!user){
      return next(new errorHandler("user not found",400));
    }
    await userModel.findByIdAndDelete(id);
    await redisClient.del(id);

  
    res.status(200).json({
      success:true,
      message:"user has been deleted successfully!!",
      user
    })
  
    
  } catch (error:any) {
    return next(new errorHandler(error.message,500));
  }



})

export {
  userRegistration,
  activateUser,
  loginUser,
  logoutUser,
  updateAccessToken,
  getuserDetails,
  socialAuth,
  updateUserDetails,
  updatePassword,
  updateProfilePic,
  getAllUser,
  updateUserRole
};
