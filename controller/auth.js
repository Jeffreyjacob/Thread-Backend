import User from "../models/auth.js"
import ErrorResponse from "../utils/errorResponse.js"
import GenerateCookie from "../utils/generateCookie.js"
import { LoginSchema, SignUpSchema } from "../zodSchema.js"



export const LoginHandler = async (req,res,next)=>{
    try{
        const request = LoginSchema.parse(req.body)
        const {username,password} = request
        
        const user = await User.findOne({username}).select("+password")
        if(!user){
            throw new ErrorResponse("Invalid Credentials",401)
        }
        const isMatch = await user.matchPassword(password)
        if(!isMatch){
            throw new ErrorResponse("Invalid Credentials",401)
        }
        GenerateCookie(user,res)
        res.status(200).json({
            success:true,
            message:"Login Successfully!"
        })
    }catch(error){
       console.log(error)
       next(error)
    }
}

export const SignUpHandler = async(req,res,next)=>{
    try{
       const request = SignUpSchema.parse(req.body)
       const {fullname,password,username} = request
       const existingUser = await User.findOne({username})
       if(existingUser){
          throw new ErrorResponse("username already exist",400)
       }
       const user = new User({fullname,password,username})
       await user.save()
       GenerateCookie(user,res)
       res.status(201).json({
        success:true,
        message:"User Created"
       })
    }catch(error){
     console.log(error)
     next(error)
    }
}

export const LogoutHandler = async(req,res,next)=>{
    try{
       res.cookie("token","",{maxAge:0})
       res.status(200).json({
        success:true,
        message:"Logout Successfull!"
       })
    }catch(error){
     console.log(error)
     next(error)
    }
}
