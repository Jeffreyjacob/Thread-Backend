import express from 'express'
import passport from 'passport'


const router = express.Router()

// authenticate the user using google
//forward the request to google's authentication server
router.route("/instagram").get(passport.authenticate('instagram'))

router.route("/instagram/callback").get(passport.authenticate("instagram",{
    failureRedirect:`${process.env.FRONTEND_URL}/login`
}),(req,res)=>{
    const token = req.user.genertateToken()
    res.cookie("token",token,{
        httpOnly:true,secure: process.env.NODE_ENV === 'production' 
    })
    res.redirect(process.env.FRONTEND_URL);
})



export default  router