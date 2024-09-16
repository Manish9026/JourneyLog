import { toast } from "react-toastify";
import { setFormStatus } from "../slices/authSlice";
 export const urlReloader=(res,dispatch)=>{

    if(res.statusCode==65){
        dispatch(setFormStatus({login:true}))
    }
    if(res?.status){
        toast.success(res?.message)
    }
    else{
        toast.error(res?.message)
    }
   
}