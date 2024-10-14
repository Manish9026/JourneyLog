import mongoose from "mongoose";


const authSchema=mongoose.Schema({

    userName:{
        type:String,

    },
    userEmail:{
        type:String,
        required:true,
        index: true ,
    },
    password:{
        type:String
    },
    current_location:{
        type:Object
    },
    profileImage:{
        type:String,
    },
    company:{
        type:[{
            cmpName:String,
            createdAt:{
                type:Date,
                default:Date.now
            },
            remainingAmount:{type:Number,default:0},
            recentPayment:Date
        }]
    },
    recentCompany:{
       type:String 
    },


    userToken:String
})

export  const userModel=mongoose.model("user",authSchema);