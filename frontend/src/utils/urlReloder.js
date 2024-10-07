import { toast } from "react-toastify";
import { setFormStatus } from "../slices/authSlice";
 export const urlReloader=({response,dispatch,messageAllow=true}={})=>{

    if(response?.statusCode==65){
       return  dispatch(setFormStatus({login:true}))
    }
    if(messageAllow){
        if(response?.status){
            return  toast.success(response?.message)
         }
         else{
           return  toast.error(response?.message)
         }
    }
    
   
}