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
            console.log(error.details);
            
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
  }