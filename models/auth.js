import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const userSchema = new mongoose.Schema({
    instagramId:{
        type:String,
        unique:true,
        sparse:true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    fullname:{
        type:String,
        default:""
    },
    password: {
        type: String,
        select: false,
        minlength:6,
        required:function(){
            return !this.instagramId;
        }
    },
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    profileImg:{type:String,default:""},
    bio:{type:String,default:""},
    link:{type:String,default:""},
    LikedPosts:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            default: []
        }
    ]
})

userSchema.pre("save",async function(next){
   if(!this.isModified("password")){
     return next()
   }
   const salt = await bcrypt.genSalt(10);
   this.password = await bcrypt.hash(this.password,salt)
   next();
})

userSchema.methods.genertateToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES
    })
}

userSchema.methods.matchPassword = async function(password){
   return await bcrypt.compare(password,this.password);
}

const User = mongoose.model("User",userSchema)

export default User;