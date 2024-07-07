import session from "express-session"
import passport from "passport"
import { Strategy as InstagramStategy } from 'passport-instagram';
import User from "../models/auth.js";

const Passport = (app) => {
    app.use(
        session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 24 * 60 * 60 * 1000
            }
        })
    )

    app.use(passport.initialize())
    app.use(passport.session())

    passport.use(
        new InstagramStategy(
            {
                clientID: process.env.INSTAGRAM_CLIENT_ID,
                clientSecret: process.env.INSTAGRAM_SECRET_KEY,
                callbackURL: "https://thread-backend-0wpa.onrender.com/auth/instagram/callback",

            }, async (accessToken, refreshToken, profile,done) => {
                User.find({ instagramId: profile.id }, function (err, user) {
                    return done(err, user);
                  });
            }
        )
    )
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id)
            done(null, user)
        } catch (error) {
            done(error, null)
        }
    })
}

export default Passport