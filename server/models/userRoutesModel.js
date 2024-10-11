import mongoose from "mongoose";

const routesSlice=mongoose.Schema({

    userId:{
        type:mongoose.Schema.ObjectId,
        required: true,
        ref: "user"
    },
    company:{
        type:{
            cmpName:String,
            cmpId:String
        }

    },
    travel:{
        type:[{
            whereTo:{
                type:String
            },
            company:String,
            whereFrom:{
                type:String
            },
            travelBy:{
                type:String
            },
            amount:Number,
            date:{
                type:Date,
                default:new Date().toISOString()
            }
        }]

    },
   
},{ timestamps: true })

export const userRouteModel=mongoose.model("userRoutes",routesSlice);
