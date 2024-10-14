import { badRes, goodRes, isNotEmpty } from "./index.js";
import { paymentModel } from "../models/paymentModel.js";
import { userRouteModel } from "../models/userRoutesModel.js";
import { userModel } from "../models/authModel.js";

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
    static updateRemainingAmount=async({userId,remainingAmount,cmpId,lastDate}={})=>{
        // console.log(userId,remainingAmount,cmpId,lastDate);
        
        if(userId && isNotEmpty(remainingAmount) && lastDate && cmpId){
            return await userModel.updateOne(
                { _id: userId, "company._id": cmpId },  // Find the user and the specific product
                { $set: { "company.$.remainingAmount": remainingAmount,"company.$.recentPayment":new Date(lastDate)} }  ,  // Update the specific product using positional operator
               { new: true,}
              ).then((result)=>{
                // console.log(result);
                if(result) return true
                
              }).catch((err)=>{
                return false
              })
        }
    }


    static payment=async(req,res)=>{
       try {
        const userId=req.user._id;
        console.log(req.body);
        
        let {startDate,endDate,amount,company}=req.body;
        amount=Number(amount)
        company=req.user?.company?.find((c)=>c.cmpName===company.cmpName) || "";
        let {remainingAmount,_id,recentPayment}=company;
        let totalAmount  =remainingAmount + amount;
        console.log(userId,company,remainingAmount,_id,recentPayment,startDate,endDate); 


        if(totalAmount && isNotEmpty(company) && isNotEmpty(startDate) && isNotEmpty(endDate) && isNotEmpty(userId)){

        startDate=new Date(startDate);
        endDate=new Date(endDate);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);


        const data=await userRouteModel.find({
            $and:[{userId},{createdAt:{$gte:startDate}},{createdAt:{$lte:endDate}},{"travel.payStatus":false}]  // Match specific travel entry
        })
        // // console.log(data);
        if(data.length!=0){
            // total travelAmount between given dates
            let total=0;
            // updates payment status status 
            for (let i = 0; i < data.length; i++) {
               data[i]?.travel?.map((travel)=>{
                if(!travel?.payStatus){
                    travel.payStatus=true;
                    total +=travel.amount;
                    console.log(travel.amount);
                    
                }
               }
    
            )
            await data[i].save()
                
            }       
            const newPayment=await paymentModel.create({
                company:{cmpId:company?._id,cmpName:company?.cmpName},startFrom:startDate,startTo:endDate,
                amount:{ travelAmount:total,
                    payAmount:amount,
                    prevRemainingAmount:remainingAmount,
                    NewRemainingAmount:totalAmount-total,},userId
            })
            
            if(await newPayment.save()){
               if( await this.updateRemainingAmount({userId,remainingAmount:(totalAmount-total),lastDate:endDate,cmpId:_id}))
                return goodRes({res,message:"payment successfully"})
            }
            else{
                return badRes({res,message:"try after some time"}) 
            }



        }else{
            return goodRes({res,message:"payment already done"})
        }
        }else{
            return badRes({res,message:"all fields are required"})

        }

       
       

        
        
       } catch (error) {
        console.log(error);
        
       }

    }

}