import mongoose from "mongoose";

const  ticketScheme=mongoose.Schema({
    tickets:Array,
    cinemaData:Object,
    userId:String,
    moviData:Object
})
export const ticketModel=mongoose.model("ticket",ticketScheme);