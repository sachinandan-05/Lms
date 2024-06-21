import express from "express";
import {
    activateUser,
    getuserDetails,
    loginUser,
    logoutUser,
    socialAuth,
    updateAccessToken,
    updatePassword,
    updateProfilePic,
    updateUserDetails,
    userRegistration
} from "../controllers/user.controller";
import { authorizedRole, isAuthenticated } from "../middleware/auth.middleware";


console.log("user", userRegistration)


const userRouter = express.Router();


userRouter.route("/resistration").post(userRegistration as any)
userRouter.route("/activateuser").post(activateUser as any)
userRouter.post("/login", loginUser as any)
userRouter.get("/logout", isAuthenticated as any, logoutUser as any)
userRouter.get("/refresh", updateAccessToken as any)
userRouter.get("/me", isAuthenticated as any, getuserDetails as any)
userRouter.route("/social-auth").post(socialAuth as any)
userRouter.route("/update-user").put(isAuthenticated as any, updateUserDetails as any)
userRouter.route("/update-password").put(isAuthenticated as any, updatePassword as any)
userRouter.route("/update-user-profile").put(isAuthenticated as any, updateProfilePic as any)



export default userRouter