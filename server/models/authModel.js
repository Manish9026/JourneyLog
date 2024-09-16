import mongoose from "mongoose";


const authSchema=mongoose.Schema({

    userName:{
        type:String,

    },
    userEmail:{
        type:String,
        required:true
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
    userToken:String
})

export  const userModel=mongoose.model("user",authSchema);