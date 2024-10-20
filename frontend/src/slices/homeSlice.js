import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "../utils/url";
import { urlReloader } from "../utils/urlReloder";
axios.defaults.baseURL=url;

export const  getTravelDetail=createAsyncThunk("getTravelDetail",async(statementData,{dispatch})=>{
    return await axios.post(`/travel/all-routes?skip=${statementData?.skip || 0}&next=${statementData?.next || 5} &company=${statementData?.company} &getType=home`,{filter:statementData?.filterData},{withCredentials:true,}).then((res)=>{
        urlReloader({response:res.data,dispatch,messageAllow:false});
        console.log(res.data,"home");       
        return res.data
    }).catch((err)=>{
        alert(err)
    })
})
const homeSlice=createSlice({
    name:"home",
    initialState:{
        travelDetail:[],
        loading:false,
        utilAmount:{},

    },
    extraReducers:(builder)=>{
        builder.addCase(getTravelDetail.pending,(state)=>{
            state.loading=true
        })
        builder.addCase(getTravelDetail.fulfilled,(state,{payload})=>{
            state.travelDetail=payload?.data?.travelDetail || [];
            state.utilAmount=payload?.data?.utilAmount || [];
            state.loading=false
        })
    }
})

export const homeReducer= homeSlice.reducer