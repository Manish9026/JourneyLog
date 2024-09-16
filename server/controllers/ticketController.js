import { ticketModel } from "../models/TicketDetail.js";

export const bookTicket=async(req,res)=>{
    try {
       const  {user}=req;
       const {tickets,moviData,cinemaData}=req.body;
       if(tickets && moviData && cinemaData){

        const ticket=await ticketModel({
            tickets,cinemaData,moviData,totalTicket:tickets.length,
            userId:user._id
        })
        if(await ticket.save()){

            res.json({
                message:"booked ticket",
                status:true,
            })
        }
        else{
            res.json({
                message:"try again",
                status:false,
            })
        }
       }

    } catch (error) {
        
        console.log(error);
        
    }

} 