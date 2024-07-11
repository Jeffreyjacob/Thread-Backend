import User from "../models/auth.js"


export const GetUserHandler = async (req,res,next)=>{
    try{
      const userId = req.user._id
      const user = await User.findById(userId)
      res.status(200).json(user)
    }catch(error){
      console.log(error)
      next(error)
    }
}