import { ZodError } from "zod"
import ErrorResponse from "../utils/errorResponse.js";


const handleZodError = (err,res)=>{
    return res.status(400).json({
        message:err.message,
        error:err.issues.map((err) => ({
            path: err.path.join(","),
            message: err.message
        }))
    })
}

const handleAppError = (res,err)=>{
   return res.status(err.statusCode).json({
       message:err.message
   });
}


const errorHandler = async(err,req,res,next)=>{
    console.log(`PATH ${req.path}`,err)
    if(err instanceof ZodError){
        return handleZodError(err,res)
    }
    if(err instanceof ErrorResponse){
        return handleAppError(res,err)
    }

    return res.status(500).json({message:"Internal server error"})
}

export default errorHandler;