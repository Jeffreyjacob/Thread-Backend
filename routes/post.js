import express from 'express';
import { VerifyToken } from '../middleware/auth.js';
import {  CommentOnPostHandler, CreatePostHandler, DeleteCommentOnPostHandler, 
    DeletePostHandler, EditPostHandler, GetAllPostHandler, GetFollowingPost,
     GetPostByIdHandler, LikeUnlikePostHandler } from '../controller/post.js';
import { Upload } from '../utils/Multer.js';


const router = express.Router()


router.route("/").post(Upload.single("img"),VerifyToken,CreatePostHandler)
router.route("/").get(GetAllPostHandler)
router.route("/getFollowingPost").get(VerifyToken,GetFollowingPost)
router.route("/getPostbyId/:id").get(VerifyToken,GetPostByIdHandler)
router.route("/like/:id").post(VerifyToken,LikeUnlikePostHandler)
router.route("/comment/:id").post(VerifyToken,CommentOnPostHandler)
router.route("/deleteComment/:id").post(VerifyToken,DeleteCommentOnPostHandler)
router.route("/deletePost/:id").delete(VerifyToken,DeletePostHandler)
router.route("/editPost/:id").put(Upload.single("img"),VerifyToken,EditPostHandler)


export default router;