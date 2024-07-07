import express from 'express';
import { LoginHandler, SignUpHandler } from '../controller/auth.js';


const router = express.Router()

router.route("/login").post(LoginHandler)
router.route("/signup").post(SignUpHandler)

export default router;