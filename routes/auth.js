import express from 'express';
import { LoginHandler, LogoutHandler, SignUpHandler } from '../controller/auth.js';


const router = express.Router()

router.route("/signup").post(SignUpHandler)
router.route("/login").post(LoginHandler)
router.route("/logout").post(LogoutHandler)

export default router;