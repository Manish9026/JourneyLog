import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "../utils/url";
import { urlReloader } from "../utils/urlReloder";
import { isVerified } from "./authSlice";

axios.defaults.baseURL=url;
export const addCompany=createAsyncThunk("addCompany",async(cmpName,{dispatch})=>{
    return await axios.post("/travel/add-company",{cmpName},{withCredentials:true}).then((res)=>{
        urlReloader({response:res.data,dispatch})
        if(res?.data?.status)
            dispatch(isVerified())
       return  res.data;
    }).catch((err)=>{
        alert(err)
    })
})
export const getDetails=createAsyncThunk("getDetails",async(_,{dispatch})=>{
    return await axios.get("/travel/all-details",{withCredentials:true}).then((res)=>{
        urlReloader({response:res.data,dispatch,messageAllow:false})
       return  res.data;
    }).catch((err)=>{
        alert(err)
    })

})
const detailSlice=createSlice({
    name:"detail",
    initialState:{
     company:{
        data:[],
        loading:false,
     },
     loading:false
    },
    reducers:{

    },
    extraReducers:(builder)=>{
        builder.addCase(addCompany.pending,({company})=>{
            company.loading=true;
        })
        builder.addCase(addCompany.fulfilled,({company},{payload})=>{
            company.loading=false;
            if(payload?.data?.length!=0)
            company.data=payload?.data || []
        })

        builder.addCase(getDetails.pending,(state)=>{
            state.loading=true;
        })
        builder.addCase(getDetails.fulfilled,(state,{payload})=>{
            state.loading=false;
            state.company.data=payload?.data?.company || []
        })
    }
})
export const {}=detailSlice.actions;
export default detailSlice.reducer;