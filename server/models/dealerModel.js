import mongoose from "mongoose";

// Define the company schema
const CompanySchema = new mongoose.Schema({
    cmpId: { type: String, required: true },
    cmpName: { type: String, required: true }
});

// Define the main shop schema
const dealerSchema = new mongoose.Schema({
    userId:{type:mongoose.Types.ObjectId,required:true},
    shopName: { type: String, required: true },
    shopOwner: { type: String, },
    mobNo: { type: String},
    area: { type: String, required: true },
    shopAddress: { type: String, required: true },
    company: { type: CompanySchema, required: true }, 
    withGST:{type:Boolean},
    // Embedded company object
    // createdAt: { type: Date, default: Date.now }
},{timestamps:true});

// Create a model
export const dealerModel = mongoose.model('dealer-Record', dealerSchema);

