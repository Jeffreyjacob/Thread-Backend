import { z } from "zod"
import User from "../models/auth.js"
import ErrorResponse from "../utils/errorResponse.js"
import {v2 as cloudinary} from "cloudinary";
import Notification from "../models/notification.js";


export const GetUserHandler = async (req,res,next)=>{
    try{
      const userId = req.user._id
      const user = await User.findById(userId).populate({path:"following"}).populate({path:"followers"})
      res.status(200).json(user)
    }catch(error){
      console.log(error)
      next(error)
    }
}

export const UpdateUserHander = async (req,res,next) =>{
  try{
    const {bio,link,fullname} = req.body
    const userId = req.user._id
    const user = await User.findById(userId)
    if(!user){
      throw new ErrorResponse("User not found",404)
    }
    let newImage 
    if(req.file){
      const image = req.file
      const base64Image = Buffer.from(image.buffer).toString("base64")
      const dataURI = `data:${image.mimetype};base64,${base64Image}`;
      const uploadImage = await cloudinary.uploader.upload(dataURI)
      newImage = uploadImage.url
    }
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = newImage || user.profileImg;
    user.fullname = fullname || user.fullname;
    const updatedProfile = await user.save()
    res.status(200).json(updatedProfile)
  }catch(error){
    console.log(error)
    next(error)
  }
}

export const FollowUnFollowHandler = async (req,res,next)=>{
   try{
      const id = req.params.id
      const userId = req.user._id
      const userToFollow = await User.findById(id)
      const currentUser = await User.findById(userId)
      if(id === userId.toString()){
        throw new ErrorResponse("You can't follow or unfollow yourself",400)
      }
      if(!currentUser || !userToFollow){
        throw new ErrorResponse("User not found",404)
      }
      const following = currentUser.following.includes(id)
      if(following){
        //unfollow user 
        await User.findByIdAndUpdate(userId,{$pull:{following:id}})
        await User.findByIdAndUpdate(id,{$pull:{followers:userId}})
        // notification
        res.status(200).json({
          success:true,
          message:"You unfollow this user"
        })
      }else{
        // follow user 
         await User.findByIdAndUpdate(userId,{$push:{following:id}})
         await User.findByIdAndUpdate(id,{$push:{followers:userId}})
        // notification
        const newNotification  = new Notification({
          type:"Follow",
          from:userId,
          to:userToFollow
        })
        await newNotification.save()
        res.status(200).json({
          success:true,
          message:"You follow this user"
        })
      }
   }catch(error){
      console.log(error)
      next(error)
   }
}

export const GetUserProfileHandlder = async(req,res,next)=>{
  try{
    const {username} = req.params
    const user = await User.findOne({username:username})
    .populate({path:"following"})
    .populate({path:"followers"})
    if(!user){
      throw new ErrorResponse("User not found",404)
    }
    res.status(200).json(user)
  }catch(error){
   console.log(error)
   next(error)
  }
}

export const SearchUserHandler = async(req,res,next)=>{
  try{
      const {name} = req.query
      let query = {}
      if(name){
       const nameRegex = new RegExp(name,"i")
       query = {
        $or:[
          {fullname:{$regex:nameRegex}},
          {username:{$regex:nameRegex}}
        ]
       }
      }
      const user = await User.find(query).populate({path:"following"})
      .populate({path:"followers"})
      res.status(200).json(user)
  }catch(error){
    console.log(error)
    next(error)
  }
}

export const SuggestedUserHandlder = async(req,res,next)=>{
  try{
    const userId = req.user._id
    const usersFollowByMe = await User.findById(userId).select("following")
    const users = await User.aggregate([
      {
        $match:{
          _id:{$ne:userId}
        }
      },
      {$sample:{size:20}}
    ])
    const filteredUser = users.filter((user)=>!usersFollowByMe.following.includes(user._id))
    filteredUser.forEach(user => user.password = null)
    res.status(200).json(filteredUser)
  }catch(error){
    console.log(error)
    next(error)
  }
}

export const GetFollowerHandler = async (req,res,next)=>{
  try{
    const {username} = req.params
    const user = await User.findOne({username}).select("followers").populate({path:"followers"})
    if(!user){
      throw new ErrorResponse("User not found",404)
    }
    if(user.followers.length === 0){
      return res.status(200).json([])
    }
    res.status(200).json(user)
  }catch(error){
    console.log(error)
    next(error)
  }
}

export const GetFollowingHandler = async (req,res,next)=>{
  try{
    const {username} = req.params
    const user = await User.findOne({username}).select("following").populate({path:"following"})
    if(!user){
      throw new ErrorResponse("User not found",404)
    }
    if(user.following.length === 0){
      return res.status(200).json([])
    }
    res.status(200).json(user)
  }catch(error){
    console.log(error)
    next(error)
  }
}