import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbUrl: string = process.env.MONGODB_URI || "mongodb://localhost:27017/";

const connectDb = async () => {
  try {
    await mongoose.connect(dbUrl).then((data: any) => {
      console.log(`db is connected with ${data.connection.host}`);
    });
  } catch (error: any) {
    console.log(error.message);
    setTimeout(connectDb, 5000);
  }
};
export default connectDb;
