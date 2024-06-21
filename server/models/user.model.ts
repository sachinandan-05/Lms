import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const emailRegexPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


export interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    password: string;
    avatar: {
        public_id: string;
        url: string;
    };
    role: string;
    isVarifiend: boolean;
    courses: Array<{ course_Id: string }>;
    comparePassword: (password: string) => Promise<boolean>;
    signinAccessToken: () => string;

    signResfreshToken: () => string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter your Name!!"],
        },
        email: {
            type: String,
            required: [true, "Please enter your email !!"],
            unique: true,
            validate: {
                validator: function (value: string) {
                    return emailRegexPattern.test(value);
                },
                message: "please enter a valid email",
            },
        },
        password: {
            type: String,
            minlength: [6, "password should be minimum 6 characters!"],
            select: false,
        },
        avatar: {
            url: String,
            public_id: String,
        },
        role: {
            type: String,
            default: "user",
        },
        isVarifiend: {
            type: Boolean,
            default: false,
        },
        courses: [{
            course_Id: String,
           
        }],
    },
    { timestamps: true }
);

// hash before saving

userSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// compare password method
userSchema.methods.comparePassword = async function (
    enteredPassword: string
): Promise<boolean> {
    console.log("password", this.password);
    return await bcrypt.compare(enteredPassword, this.password)
};

//Accesstoken generator

userSchema.methods.signinAccessToken = async function (): Promise<string> {
    return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN as string || " " ,{
        expiresIn:'5m'
    });

};

// refresh token generator

userSchema.methods.signResfreshToken = async function () {

    return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || ' ' ,{
        expiresIn:"3d"
    });
};
const userModel: Model<IUser> = mongoose.model("User", userSchema);

export default userModel;
