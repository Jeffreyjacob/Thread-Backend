import mongoose from "mongoose";


const postSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    Img:{
        type:String,
        default:""
    },
    Text:{
        type:String
    },
    Like:[
        {type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:[]
        }
    ],
    comments:[
        {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        text:{
            type:String,
            required:true
        }
    }
    ]
},{timestamps:true})


const Post = mongoose.model("Post",postSchema)

export default Post;