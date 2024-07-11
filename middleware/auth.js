import User from "../models/auth.js";
import ErrorResponse from "../utils/errorResponse.js";
import jwt from 'jsonwebtoken';



export const VerifyToken = async (req,res,next)=>{
    try{
      const token = req.cookies.token
      if(!token){
        throw new ErrorResponse("Unauthorized: No token provided",401)
      }

      const decoded = jwt.verify(token,process.env.JWT_SECRET)
      if(!decoded){
        throw new ErrorResponse("Unauthorized:Invalid or Token exipred",401)
      }
      const user = await User.findById(decoded.id)
      if(!user){
        throw new ErrorResponse("User not found",404)
      }
      req.user = user
       next()
    }catch(error){
      console.log(error)
      next(error)
    }
}