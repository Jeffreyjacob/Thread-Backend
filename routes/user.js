import express from 'express'
import { FollowUnFollowHandler, GetFollowerHandler, GetFollowingHandler, GetUserHandler, GetUserProfileHandlder,
     SearchUserHandler, SuggestedUserHandlder, UpdateUserHander } from '../controller/user.js'
import { VerifyToken } from '../middleware/auth.js'
import { Upload } from '../utils/Multer.js'


const router = express.Router()

router.route("/").get(VerifyToken,GetUserHandler)
router.route("/updateUser").put(Upload.single("profileImg"),VerifyToken,UpdateUserHander)
router.route("/follow/:id").post(VerifyToken,FollowUnFollowHandler)
router.route("/profile/:username").get(VerifyToken,GetUserProfileHandlder)
router.route("/searchUser").get(VerifyToken,SearchUserHandler)
router.route("/suggestUser").get(VerifyToken,SuggestedUserHandlder)
router.route("/getFollowers/:username").get(VerifyToken,GetFollowerHandler)
router.route("/getFollowing/:username").get(VerifyToken,GetFollowingHandler)

export default router