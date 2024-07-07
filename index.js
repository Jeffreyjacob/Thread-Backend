import "dotenv/config";
import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";
import ConnectDB from "./config/db/connect.js";
import authRoute from './routes/auth.js';
import errorHandler from "./middleware/errorHandler.js";


const app = express()



app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(cookieParser())

app.use("/api/auth",authRoute)

app.use(errorHandler)


const PORT = process.env.PORT || 5000


app.listen(PORT,()=>{
    console.log(`Server is Running on Port ${PORT}`)
    ConnectDB()
})