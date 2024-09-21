import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
dotenv.config()
import authRoutes from './routes/authRoutes.js';
const app=express();
import DB_connection from './DBconfig/DB.config.js';
import ticketRoutes from './routes/ticketRoutes.js'
import { addContactDetails } from './controllers/portfolioControler.js'
const port=process.env.PORT;
app.use(express.json()) 
app.use(cookieParser());

app.use(cors({
    origin:[process.env.BASE_URL,process.env.BASE_URL2,process.env.PORTFOLiO_URL],
    credentials:true,
    methods:["POST","GET","DELETE","PATCH"]
}))

app.use("/user",authRoutes)
app.use("/ticket",ticketRoutes)
app.get("/",(req,res)=>{
    res.json({
        message:"this is server page"
    })
})


// portfolio routes
app.post('/user/post/message',addContactDetails)


app.listen(port,()=>{
    DB_connection()
    console.log("server runing on port 2000");
})