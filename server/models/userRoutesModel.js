import mongoose from "mongoose";

const routesSlice=mongoose.Schema({

    userId:{
        type:mongoose.Schema.ObjectId,
        required: true,
        ref: "user"
    },
    travel:{
        type:[{
            whereTo:{
                type:String
            },
            whereFrom:{
                type:String
            },
            travelBy:{
                type:String
            },
            amount:Number,
            date:{
                type:Date,
                default:Date.now
            }
        }]

    },
   
},{ timestamps: true })

export const userRouteModel=mongoose.model("userRoutes",routesSlice);