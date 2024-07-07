import session from "express-session"
import passport from "passport"
import {Strategy as InstagramStategy} from 'passport-instagram';
import User from "../models/auth.js";

const Passport = (app)=>{
   app.use(
    session({
        secret:process.env.SESSION_SECRET,
        resave:false,
        saveUninitialized:false,
        cookie:{
            maxAge:24 * 60 * 60 *1000
        }
    })
   )

   app.use(passport.initialize())
   app.use(passport.session())

   passport.use(
    new InstagramStategy(
        {
            clientID:process.env.INSTAGRAM_CLIENT_ID,
            clientSecret:process.env.INSTAGRAM_SECRET_KEY,
            callbackURL:"/auth/instagram/callback",  
        },async(req,accessToken,refreshToken,profile,done)=>{
            try{
               if(req.user){
                 // user is already authenticated, link account
                 req.user.instagramId = profile.id;
                 await req.user.save();
                 return done(null,req.user);
               }
               let user = await User.findOne({username:profile.username})
               if(user){
                // User exist, log them in
                user.instagramId = profile.id,
                await user.save();
                return done(null,user)
               }
              user = new User({
                instagramId:profile.id,
                username:profile.username,
                fullname:profile.displayName,
                profileImg:profile.photos,
              })
              await user.save();
              return done(null,user);
            }catch(error){
               console.error(error);
               return done(error,null)
            }
        }
    )
   )
   passport.serializeUser((user,done)=>{
       done(null,user.id)
   })
   passport.deserializeUser(async(id,done)=>{
     try{
       const user = await User.findById(id)
       done(null,user)
     }catch(error){
       done(error,null)
     }
   })
}

export default Passport