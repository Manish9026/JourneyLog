import { dealerModel } from "../models/dealerModel.js"
import  Joi from 'joi';
import { goodRes } from "./index.js";
import { UserRoutes } from "./userRoutesController.js";
import { placeModel } from "../models/placesModel.js";
const dealerSchemaWithValidation = Joi.object({
    shopName: Joi.string().trim().min(3).max(50).required(),
    shopOwner: Joi.string().trim().min(3).max(50),
    mobNo: Joi.string().trim().allow(null, '').optional(),
    area: Joi.string().trim().min(3).max(100).required(),
    shopAddress: Joi.string().trim().min(5).max(200).required(),
    company: Joi.object({
        cmpId: Joi.string().trim().required(),
        cmpName: Joi.string().trim().required()
    }),
    withGST:Joi.boolean()
});

  export class Dealer extends UserRoutes{

    static addNewDealer=async(req,res)=>{
        try {
            // Validate request body
            const userId = req?.user?._id || null;
            const newData={...req.body,userId}
            // res.send({newData})
            const { error } = dealerSchemaWithValidation.validate(req.body);
            // console.log(error.details);
            
            if (error) return res.status(400).json({ error: error.details[0].message });

            const existPlace=await placeModel.find({name:newData?.area.trim()});
            if(existPlace && existPlace?.length==0){
                await new placeModel({name:newData.area}).save();
            }       
            // // Create a new shop record
            const addNewDealer = new dealerModel(newData);
            await addNewDealer.save();
            
            goodRes({res,data:addNewDealer,message:"successfully added",statusCode:201})
        } catch (error) {
            console.error('Error adding shop:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }

    }

    static getDealerDetail=async(req,res)=>{
        try {
            const userId=req?.user?._id;
            const { shopName, shopOwner, area,cmpId,query,type } = req.query;
            // Build a dynamic filter object
            console.log(query,type);
            
            let filter = {};
            if(userId) filter.userId=userId;
            if (shopName) filter.shopName = { $regex: shopName, $options: 'i' }; // Case-insensitive search
            if (shopOwner) filter.shopOwner = { $regex: shopOwner, $options: 'i' };
            if (area) filter.area = { $regex: shopAddress, $options: 'i' };
            if(cmpId) filter['company.cmpId']=cmpId;
            console.log(filter); 
            let dealerData={};
            if(type=="multipleSrh"){
             dealerData = await dealerModel.find({userId,
                $or: [
                    { shopName: { $regex: query, $options: "i" } }, // Case-insensitive search for shopName
                    { shopOwner: { $regex: query, $options: "i" } }, // Case-insensitive search for shopOwner
                    { area: { $regex: query, $options: "i" } } // Case-insensitive search for area
                ]
            });
        console.log("search",dealerData);
        
        }
            else
            dealerData = await dealerModel.find(filter).sort({createdAt:-1});

            
            // res.status(200).json({ success: true, count: shops.length, data: shops });
            goodRes({res,message:"",data:{records:dealerData,count: dealerData.length}})
        } catch (error) {
            console.error('Error searching shops:', error);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }
  }