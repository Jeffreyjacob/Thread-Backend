
const GenerateCookie = (user,res)=>{
    const token = user.genertateToken()
   return res.cookie("token",token,{
    maxAge:24 * 60 * 60 * 1000,
    httpOnly:true,
    sameSite:"strict",
    secure:process.env.NODE_ENV !== "development"
   })
}

export default GenerateCookie;