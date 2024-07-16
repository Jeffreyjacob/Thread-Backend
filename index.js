import "dotenv/config";
import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";
import ConnectDB from "./config/db/connect.js";
import authRoute from './routes/auth.js';
import errorHandler from "./middleware/errorHandler.js";
import Passport from "./utils/passport.js";
import userRoute from './routes/user.js';
import instagramAuth from './routes/instagramAuth.js';
import postRoute from './routes/post.js';
import {v2 as cloudinary} from 'cloudinary';
import notificationRoute from "./routes/notification.js"


cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET
})

const app = express()



app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
  origin:["http://localhost:5173","https://thread-frontend-git-main-jeffreys-projects-13ebf7f6.vercel.app","https://thread-frontend.onrender.com"],
  credentials:true
}))
app.use(cookieParser())
Passport(app)


app.get("/health",async(req,res)=>{
    res.send({message:"health OK!"})
  });
app.use("/api/auth",authRoute)
app.use("/auth",instagramAuth)
app.use("/api/user",userRoute)
app.use("/api/post",postRoute)
app.use("/api/notification",notificationRoute)

app.use(errorHandler)


const PORT = process.env.PORT || 5000


app.listen(PORT,()=>{
    console.log(`Server is Running on Port ${PORT}`)
    ConnectDB()
})