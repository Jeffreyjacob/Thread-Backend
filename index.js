import "dotenv/config";
import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";
import ConnectDB from "./config/db/connect.js";
import authRoute from './routes/auth.js';
import errorHandler from "./middleware/errorHandler.js";
import Passport from "./utils/passport.js";
import instagramAuth from './routes/instagramAuth.js'


const app = express()



app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(cookieParser())
Passport(app)


app.get("/health",async(req,res)=>{
    res.send({message:"health OK!"})
  });
app.use("/api/auth",authRoute)
app.use("/auth",instagramAuth)

app.use(errorHandler)


const PORT = process.env.PORT || 5000


app.listen(PORT,()=>{
    console.log(`Server is Running on Port ${PORT}`)
    ConnectDB()
})