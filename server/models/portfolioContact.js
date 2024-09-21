import mongoose from "mongoose";
import { selfPro_DB_conn } from "../DBconfig/DB.config.js";


const conn=await selfPro_DB_conn();
const contactschema=mongoose.Schema({
    userName:String,
    userEmail:String,
    message:String,
    mobileNo:Number,
    subject:String

})

export const contactModel=conn.model("contact",contactschema)