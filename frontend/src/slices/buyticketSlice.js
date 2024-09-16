import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { urlReloader } from "../utils/urlReloder";
import { setFormStatus } from "./authSlice";



export const  bookTicket=createAsyncThunk("bookTicket",async(data,{dispatch})=>{
   const response=await  axios.post("/ticket/book",data,{withCredentials:true})
   urlReloader(response.data,dispatch)
console.log(response.data);

return response.data

})
const buyTicketSlice=createSlice({
    name:"buyTicket",
    initialState:{
        ticketData:{
            moviData:{},
            cinemaData:{},
            selectedAT:{
                // time:"",
                // date:""
            },
            tickets:[
                // {
                // tk_Category:""
                //     tkNo:"",
                //     seatNo:""
                // }
            ],
            price:"",




        },
        seatingComp:{
            isActive:false
        }
        ,ticketBook:{
            status:false,
            loading:false,           
        }
    },
    reducers:{
        setTicket({ticketData},{payload}){

            // ticketData[payload.type]=payload.data;
            // console.log(payload);
        if(payload?.type){
            payload.type.map((object)=>{
                console.log(object);
               if( object[0]=="tickets"){
                ticketData[object[0]].push(object[1])

                return
               }
                ticketData[object[0]]=object[1]


                
            })
       
        }
        },
        setActive({seatingComp}){
            console.log("called");
            
            seatingComp.isActive=!seatingComp.isActive

        }
    }
})
export const {setTicket,setActive}=buyTicketSlice.actions
export default buyTicketSlice.reducer