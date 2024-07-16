import z from "zod"
import User from "../models/auth.js"
import ErrorResponse from "../utils/errorResponse.js";
import {v2 as cloudinary} from 'cloudinary'
import Post from "../models/post.js";
import Notification from "../models/notification.js";

const CreatPostShema = z.object({
    text:z.string().min(1,"Please ener a post content")
})
const CommentPostSchema = z.object({
    text:z.string().min(1,"Please enter a comment")
})

export const CreatePostHandler = async (req,res,next)=>{
    try{
       const Request = CreatPostShema.parse(req.body)
       const {text} = Request
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
        newImage = uploadImage.url;
       }

       const newPost = new Post({
         user:userId,
         Text:text,
         Img:newImage
       })
       await newPost.save()
       res.status(201).json(newPost)
    }catch(error){
        console.log(error)
        next(error)
    }
}

export const GetAllPostHandler = async (req,res,next)=>{
    try{
       const post = await Post.find().sort({createdAt:-1}).populate({path:"user"}).populate({path:"comments.user"})
       if(post.length === 0){
        return res.status(200).json([])
       }
       res.status(200).json(post)
    }catch(error){
      console.log(error)
      next(error)
    }
}

export const EditPostHandler = async (req,res,next)=>{
    try{
       const request = CreatPostShema.parse(req.body)
       const {text} = request
       const userId = req.user._id
       const postId = req.params.id
       const post = await Post.findById(postId)
       if(!post){
          throw new ErrorResponse("Post not found",404)
       }
       if(post.user._id.toString() !== userId.toString()){
          throw new ErrorResponse("You are not authorized to edit this Post",401)
       }
       let newImage
       if(req.file){
         const image = req.file
         const base64Image = Buffer.from(image.buffer).toString("base64")
         const dataURI = `data:${image.mimetype};base64,${base64Image}`;
         const uploadImage = await cloudinary.uploader.upload(dataURI)
         newImage = uploadImage.url
       }
       post.Text = text || post.Text ;
       post.Img = newImage || post.Img;
       await post.save()
       res.status(200).json({
        success:true,
        message:"Post Edited!"
       })

    }catch(error){
        console.log(error)
        next(error)
    }
}

export const GetPostByIdHandler = async(req,res,next)=>{
    try{
     const postId = req.params.id
    const post = await Post.findById(postId)
    .populate({path:"user"})
    .populate({path:"comments.user"})
    if(!post){
        throw new ErrorResponse("Post not found",404)
    }
    res.status(200).json(post)
    }catch(error){
        console.log(error)
        next(error)
    }
}

export const DeletePostHandler = async(req,res,next)=>{
    try{
       const userId = req.user._id
       const postId = req.params.id
       const post = await Post.findById(postId)
       if(!post){
        throw new ErrorResponse("Post not found",404)
       }
       //Check to make sure the user that created the post is the one deleting it
       if(post.user._id.toString() !== userId.toString()){
        throw new ErrorResponse("You are not authorized to delete this post",401)
       }
       // delete the post imge from cloudinary
       if(post.Img){
        const imgId = post.Img.split("/").pop().split(".")[0]
        await cloudinary.uploader.destroy(imgId);
       }
       // Delete the postId in likedPost Array of all the user that liked this post
       const userLikedPost = post.Like
       await User.updateMany({_id:userLikedPost},{$pull:{LikedPosts:postId}})
       await Post.findOneAndDelete({user:userId,_id:postId})
       
        res.status(200).json({success:true,message:"Post Deleted!"})
    }catch(error){
        console.log(error)
        next(error)
    }
}

export const LikeUnlikePostHandler = async(req,res,next)=>{
    try{
        const userId = req.user._id
        const postId = req.params.id
        const user = await User.findById(userId)
        if(!user){
            throw new ErrorResponse("User not found",404)
        }
        const post = await Post.findById(postId)
        if(!post){
            throw new ErrorResponse("Post not found",404)
        }

        const existingLike = post.Like.includes(userId)
        if(existingLike){
            await post.updateOne({$pull:{Like:userId}})
            await User.updateOne({_id:userId},{$pull:{LikedPosts:postId}})
            const updatedLikes = post.Like.filter((id)=> id.toString() !== userId.toString())
            res.status(200).json(updatedLikes)
        }else{
            post.Like.push(userId)
            await User.updateOne({_id:userId},{$push:{LikedPosts:postId}})
            await post.save()
            //Notification
            const newNotification = new Notification({
                type:"Like",
                from:userId,
                to:post.user._id
            })
            await newNotification.save()
            const updatedLikes = post.Like
            res.status(200).json(updatedLikes)
        }

    }catch(error){  
        console.log(error)
        next(error)
    }
}

export const GetFollowingPost = async(req,res,next)=>{
    try{
       const userId = req.user._id
       const user = await User.findById(userId)
       if(!user){
        throw new ErrorResponse("User not found",404)
       }
       const following = user.following
       const post = await Post.find({user:{$in:following}}).sort({createdAt:-1})
       .populate({path:"user"})
       .populate({path:"comments.user"})
       res.status(200).json(post)
    }catch(error){
        console.log(error)
        next(error)
    }
}

export const CommentOnPostHandler = async (req,res,next)=>{
    try{
      const request = CommentPostSchema.parse(req.body)
      const {text} = request
      const userId = req.user._id
      const postId = req.params.id
      const post = await Post.findById(postId)
      if(!post){
        throw new ErrorResponse("Post not found",404)
      }
      // Add the comment to the post
    post.comments.push({ user: userId, text });
    await post.save();

    // Populate the user field in comments and return the updated post
    const updatedPost = await Post.findById(postId).populate("comments.user");

    res.status(201).json(updatedPost.comments);
    }catch(error){
      console.log(error)
      next(error)
    }
}

export const DeleteCommentOnPostHandler = async (req,res,next)=>{
    try{
      const postId = req.params.id
      const CommentId = req.query.commentId
      if(!CommentId){
        throw new ErrorResponse("Please provide id of the comment, you want to delete!",400)
      }
      const post = await Post.findById(postId)
      if(!post){
        throw new ErrorResponse("Post not found",404)
      }
      await post.updateOne({$pull:{comments:{_id:CommentId}}})
       res.status(200).json({success:true,message:"Comment Deleted!"})
    }catch(error){
      console.log(error)
      next(error)
    }
}

export const GetPostByUserHandler = async(req,res,next)=>{
    try{
      const {username} = req.params
      const user = await User.findOne({username:username})
      if(!user){
        throw new ErrorResponse("User not found",404)
      }
      const post = await Post.find({user:user._id}).populate({path:"user"})
      if(post.length === 0){
        return res.status(200).json([])
      }
      res.status(200).json(post)
    }catch(error){
       console.log(error)
       next(error)
    }
}