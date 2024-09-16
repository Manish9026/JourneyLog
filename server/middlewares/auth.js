
import { AuthTools } from "../controllers/authController.js";
import { userModel } from "../models/authModel.js";
 export const authMiddleWare=async(req,res,next)=>{
    
    try {
        const {uid}=req.cookies;
        console.log("hello",uid);
        
        if(uid){
          const {userId} =await AuthTools.tokenVerifier(uid)
          console.log(userId);
          
          const existUser=await userModel.findOne({_id:userId},{password:false})
          if(existUser){

           req.user=existUser
           next();
   
           return
          }
          res.clearCookie('uid', {
            sameSite: 'None',
            secure: true
        }).status(201).json({
            message:"firstly login",
            statusCode:65,
            data:[]
        });

        }else{
            res.status(201).json({
                message:"firstly login",
                statusCode:65,
                data:[]
            })
        }


        
    } catch (error) {
      console.log(error);
        
    }

}
