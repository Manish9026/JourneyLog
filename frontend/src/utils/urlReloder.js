import { toast } from "react-toastify";

 export const urlReloader=(res)=>{


    if(res?.status){
        toast.success(res?.message)
    }
    else{
        toast.error(res?.message)
    }
   
}