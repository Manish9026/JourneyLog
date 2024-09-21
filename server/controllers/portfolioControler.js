// import { status } from "server/reply.js";
import mongoose from "mongoose";
import { selfPro_DB_conn } from "../DBconfig/DB.config.js";
import { contactModel } from "../models/portfolioContact.js";
const badRes=({message,statusCode,data,error,res}={})=>{

   return res.status(statusCode || 201).json({
    message:message || "try after some time",
    status:false,
    data:data || null,
    error
   })

}
const goodRes=({message,statusCode,data,error,res}={})=>{

    return res.status(statusCode || 201).json({
     message:message || "success",
     status:true,
     data:data || null,
     error:null
    })
 
 }

export const addContactDetails=async(req,res)=>{
    try {
        // const conn=await selfPro_DB_conn();   
       if( 1){
       
        const {userName,userEmail,message,subject,mobileNo}=req.body;     
       const result= await contactModel.create({
        userName,userEmail,message,subject,mobileNo
        })
       const create= await result.save()
        if(create){
            goodRes({res,message:`Thank you dear ${userName}, Your Messages has been sent Successfully!`})
        }
        else{
            badRes({res})
        }

    }
        
    } catch (error) {
        console.log("error",error);
        badRes({res,message:"internal error"})

        
    }
}