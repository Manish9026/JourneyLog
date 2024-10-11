import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
dotenv.config()
import authRoutes from './routes/authRoutes.js';
const app=express();
import DB_connection from './DBconfig/DB.config.js';
import { travelRoutes } from './routes/userTravelRoutes.js'
import { paymentRoute } from './routes/paymentRoutes.js'

const port=process.env.PORT;
app.use(express.json()) 
app.use(cookieParser());

app.use(cors({
    origin:[process.env.BASE_URL,process.env.BASE_URL2,process.env.PORTFOLiO_URL],
    credentials:true,
    methods:["POST","GET","DELETE","PATCH"]
}))

app.use("/user",authRoutes);
app.use("/travel",travelRoutes)
app.use("/payment",paymentRoute)

app.get("/",(req,res)=>{
    res.json({
        message:"this is server page"
    }) 
})






app.listen(port,()=>{
    DB_connection()
    console.log("server runing on port 2000");
})