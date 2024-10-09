import { badRes, goodRes } from "./index.js";
import { userRouteModel } from "../models/userRoutesModel.js"
import { placeModel } from "../models/placesModel.js";
import { userModel } from "../models/authModel.js";

export class UserRoutes {

    static setRecentCmp=async(userId,cmpName)=>{
        console.log(userId,cmpName);
        
        try {
            const exist=await userModel.findOne({_id:userId})
            console.log(exist);
            
            if(exist){
                exist.recentCompany=cmpName;
               await  exist.save()
            }
        } catch (error) {
            console.log(error);
            
        }
    }

    static addRoute = async (req, res) => {
        const userId = req?.user?._id || null

        try {

            const { whereTo, whereFrom, amount, travelBy,company} = req.body;

            // console.log(company);
            
            if (whereTo && whereFrom && amount && travelBy && userId) {
                let todayDate = new Date;
                let startDate = new Date;
                await this.addPlace(whereFrom,whereTo);
                this.setRecentCmp(userId,company?.cmpName)

                startDate.setHours(0, 0, 0, 0);
                todayDate.setHours(23, 59, 59, 999);
                const existTravelRoute = await userRouteModel.findOne({ $and: [{ createdAt: { $lte: todayDate } }, { createdAt: { $gte: startDate } }, { userId },{"company.cmpId":company?.cmpId}] })
                // console.log(existTravelRoute);
                
                if (existTravelRoute) {
                    //  existTravelRoute.company=company;
                     existTravelRoute?.travel?.push({ whereTo, whereFrom, amount, travelBy })
                    if (existTravelRoute.save()) {
                        return goodRes({ res, data: existTravelRoute, message: "booked" })
                    }
                    else return badRes({ res, error })


                } else {
                    return await userRouteModel.create({
                        userId,
                        travel: [{
                            whereTo, whereFrom, amount, travelBy
                        }],
                        company

                    }).then((result) => {
                        result.save()
                        return goodRes({ res, data: result, message: "booked" })
                    }).catch((error) => {
                        console.log(error);
                        
                        return badRes({ res, error })

                    })
                }


            }
            return badRes({ res, message: "all fields are required" })
        } catch (error) {
            console.log(error);

            return badRes({ res, message: "internal error" })


        }
    }

    static addPlace=async(whereFrom,whereTo)=>{
        whereFrom=whereFrom.toLowerCase()
        whereTo=whereTo.toLowerCase()

        
try {
    const existPlace1=await placeModel.findOne({name:whereFrom})
    const existPlace2=await placeModel.findOne({name:whereTo})
    if(!existPlace1){
       return  await placeModel({
            name:whereFrom
        }).save()
    }
    if(!existPlace2){
       return await placeModel({
            name:whereTo
        }).save()
    }

    
} catch (error) {
    console.log(error);
    
}
    }

    static getAllRoutes = async (req, res) => {
        const userId = req?.user?._id || null
        try {
            if (!userId) return badRes({ res, message: "user not authenticated" })
            const allRoutes = await userRouteModel.find({ userId });

            if (allRoutes.length != 0) {
                goodRes({ res, data: allRoutes })
            } else
                return badRes({ res, data: [], message: "result not found" })

        } catch (error) {
            badRes({ res, message: "internal error" })
        }
    }

    static getRecentRoutes =async(req,res)=>{
        const {limit,skip}=req.query;
        const userId=req?.user?._id
        const {recentCompany}=req.user;
        try {
            const recentRoutes=await userRouteModel.find({userId,"company.cmpName":recentCompany}).sort({updatedAt:-1}).limit(limit);
            if(recentRoutes.length!=0){
                goodRes({res,data:recentRoutes})
            }else badRes({res,})
            
        } catch (error) {
            badRes({res,})
            
        }

    }
    static searchPlace=async(req,res)=>{
        try {
            const {srhParam}=req.query;
            console.log(srhParam);
            
            if(srhParam){
                const regex=new RegExp("^" + srhParam, "i")
                const places=await placeModel.find({name:{ $regex: regex}});


                    return goodRes({res,data:places})
            }else{
                badRes({res,message:"not found"})
            }
           
        } catch (error) {
            badRes({res,message:"internal error"})
            
        }
    }

    // detail page controller
    static addCompany=async(req,res)=>{
        try {
            const{ _id,company}=req.user;
            const {cmpName}=req.body;

            if(_id && cmpName){
                if(company.find((ell)=>ell.cmpName==cmpName )){
                return goodRes({res,data:[],message:"already added"})

                }else{
                    const existCmp=await userModel.findOneAndUpdate(
                        { _id },// The filter for the document you want to update
                        {
                            $addToSet: {
                                company: { cmpName, recentPayment: new Date() } // Add new company if it doesn't exist
                            },
                            $set: {
                                recentCompany: cmpName// Set the most recent company
                            }
                        },{
                            projection: { userName: 0, userEmail: 0 ,profileImage:0,password:0,userToken:0},
                            returnDocument:"after"
                        }
                    );
                return goodRes({res,data:existCmp?.company,message:"successfully added"})
                }

                
            }else{
            return badRes({res,message:"field is empty",data:[]})
            }

        } catch (error){
           return  badRes({res,message:"internal error",data:[]})
            
        }
    }
    static getDetails=async(req,res)=>{
        try {
            const {_id,company}=req.user;

            goodRes({res,data:{company}})
        } catch (error) {
            badRes({res,message:"internal error"})
        }
    }
}