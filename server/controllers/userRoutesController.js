import { badRes, goodRes } from "./index.js";
import { userRouteModel } from "../models/userRoutesModel.js"
import { placeModel } from "../models/placesModel.js";

export class UserRoutes {

    static addRoute = async (req, res) => {
        const userId = req?.user?._id || null

        try {

            const { whereTo, whereFrom, amount, travelBy } = req.body;

            if (whereTo && whereFrom && amount && travelBy && userId) {
                let todayDate = new Date;
                let startDate = new Date;
                this.addPlace(whereFrom,whereTo)
                startDate.setHours(0, 0, 0, 0);
                todayDate.setHours(23, 59, 59, 999);
                const existTravelRoute = await userRouteModel.findOne({ $and: [{ createdAt: { $lte: todayDate } }, { createdAt: { $gte: startDate } }, { userId }] })

                if (existTravelRoute) {
                    await existTravelRoute?.travel?.push({ whereTo, whereFrom, amount, travelBy })
                    if (existTravelRoute.save()) {
                        return goodRes({ res, data: existTravelRoute, message: "booked" })
                    }
                    else return badRes({ res, error })


                } else {
                    return await userRouteModel.create({
                        userId,
                        travel: [{
                            whereTo, whereFrom, amount, travelBy
                        }]

                    }).then((result) => {
                        result.save()
                        return goodRes({ res, data: result, message: "booked" })
                    }).catch((error) => {
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
    const existPlace=await placeModel.findOne({$or:[{name:whereFrom},{name:whereTo}]})
    console.log(existPlace);
    
    if(existPlace){
       if( existPlace.name==whereFrom){
        await placeModel({
            name:whereTo
        }).save()
       }else{
        await placeModel({
            name:whereFrom
        }).save()
       }
    }else{
        await placeModel({
            name:whereTo
        }).save()
        await placeModel({
            name:whereFrom
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
        try {
            const recentRoutes=await userRouteModel.find({userId}).sort({updatedAt:-1});
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
}