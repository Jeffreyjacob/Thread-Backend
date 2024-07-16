import express from "express"
import { VerifyToken } from "../middleware/auth.js"
import { GetNotificationHandler } from "../controller/notification.js"


const router = express.Router()

router.route("/").get(VerifyToken,GetNotificationHandler)

export default router