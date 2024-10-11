import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "../utils/url";
import { urlReloader } from "../utils/urlReloder";
axios.defaults.baseURL=url;
export const payment=createAsyncThunk("payment",async(formData,{dispatch})=>{

    return await axios.post("/payment/add",formData,{withCredentials:true}).then(res=>{
        urlReloader({response:res.data,dispatch})
        if(res.data.status){
            dispatch(recentPayment())
        }
        
        return res.data
    })
})
export const recentPayment=createAsyncThunk("recentPayment",async(_,{dispatch})=>{
    return axios.get("/payment/recent",{withCredentials:true}).then(res=>{
        urlReloader({response:res.data,dispatch,messageAllow:false})

          return res.data;
    }).catch(err=>{
        alert(err)
    })
})
const paymentSlice=createSlice({
    name:"payment",
    initialState:{
        recentPayment:{
            loading:false,
            data:[]
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(recentPayment.pending,({recentPayment})=>{
            recentPayment.loading=true
        })
        builder.addCase(recentPayment.fulfilled,({recentPayment},{payload})=>{
            recentPayment.loading=false;
            recentPayment.data=payload?.data || []
        })
        builder.addCase(recentPayment.rejected,({recentPayment})=>{
            recentPayment.loading=false
        })
    }

})

export const paymentReducer=paymentSlice.reducer;