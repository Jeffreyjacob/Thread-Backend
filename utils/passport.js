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

            }, async (accessToken, refreshToken, profile, callback) => {
                User.findOne({
                    instagramId: profile.id
                }, function (err, user) {
                    if (err) return callback(err);
                    if (user) {
                        return callback(null, user); // Check if user already exists
                    }
                    const {
                        id,
                        full_name,
                        username,
                        profile_picture,
                        bio,
                    } = profile._json.data;
                    const new_user = new User({
                        instagramId:id,
                        fullname:full_name,
                        username,
                        profileImg:profile_picture,
                        bio
                    });
                    new_user.save(function (err, user) {
                        if (err) {
                            throw err;
                        }
                        return callback(null, user);
                    });
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