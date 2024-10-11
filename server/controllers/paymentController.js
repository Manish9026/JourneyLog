import { badRes, goodRes } from "./index.js";
import { paymentModel } from "../models/paymentModel.js";

export class payment{

    static addPayment=async(req,res)=>{

        try {
            


            console.log(req.body);
            const userId=req?.user?._id;
            const companies=req.user?.company;
            const {company,startFrom,startTo,amount}=req.body;  
            
            
            
            if(company && startFrom?.startDate && startTo?.startDate && amount ){
                if(!companies.find((a)=>a.cmpName==company.cmpName)) return badRes({res,message:"company is not valid"})
                const newPayment=await paymentModel.create({
                    company,startFrom:startFrom.startDate,startTo:startTo.startDate,
                    amount,userId
                })
    
                if(await newPayment.save()){
                    goodRes({res,message:"transation successfully"})
                }else{
                    badRes({res,message:"something went wrong"})
                }
            }
            else{
                badRes({res,message:"all fields are required"})
    
            }
        } catch (error) {
            badRes({res,message:"internal error"})
            
        }
       
        
       
    }

    static recentPayment=async(req,res)=>{
        try {
            const userId=req?.user?._id;
            if(!userId) badRes({res,"message":"unauthorised"})

            const matchPayment=await paymentModel.find({userId}).sort({createdAt:-1});

            if(matchPayment)
                goodRes({res,data:matchPayment});
            else
                badRes({res,data:[]})


        } catch (error) {
            badRes({res,data:[],message:"internal error"})
            
        }
    }

}