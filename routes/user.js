import express from 'express'
import { GetUserHandler } from '../controller/user.js'
import { VerifyToken } from '../middleware/auth.js'


const router = express.Router()

router.route("/").get(VerifyToken,GetUserHandler)


export default router