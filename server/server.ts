import dotenv from "dotenv"
import {app} from "./app"
import connectDb from "./db/db"
import {v2 as cloudinary} from "cloudinary"

dotenv.config({
    path:".env"
})

// cloudinary config

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET_KEY
})



app.listen(process.env.PORT || 8080 ,()=>{
    console.log(`port is listining on port:${process.env.PORT}`)
})

//db connection
connectDb()


