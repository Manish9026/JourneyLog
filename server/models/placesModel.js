import mongoose from "mongoose";

const placesSchema=mongoose.Schema({
    name:{
        type:String,
        unique: true 
    },
    lang:String,
    long:String,

})

export const placeModel=mongoose.model("places",placesSchema);