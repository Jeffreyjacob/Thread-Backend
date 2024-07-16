import Notification from "../models/notification.js"


export const GetNotificationHandler = async (req,res,next)=>{
    try{
        const userId = req.user._id
        const notification = await Notification.find({to:userId}).populate({path:"from",select:"username profileImg"})
        await Notification.updateMany({to:userId},{read:true});
        res.status(200).json(notification);
    }catch(error){
      console.log(error)
      next(error)
    }
}