import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { urlReloader } from "../utils/urlReloder";
import { url } from "../utils/url";
axios.defaults.baseURL=url
export const addRoute=createAsyncThunk("addRoute",async(formData,{dispatch})=>{

    return await axios.post("/travel/add",formData,{withCredentials:true}).then((res)=>{
    
    urlReloader({response:res.data,dispatch});

    if(res.data.status){
        dispatch(recentRoutes())
    }
    return res.data
    }).catch((err)=>{
        alert(err)
    })
})
export const  recentRoutes=createAsyncThunk("recentRoutes",async(navigate,{dispatch})=>{
    return await axios.get(`/travel/getRecentRoutes?skip=${navigate?.skip || 0}&next=${navigate?.next || 5}`,{withCredentials:true}).then((res)=>{
        urlReloader({response:res.data,dispatch,messageAllow:false});
        console.log(res.data);       
        return res.data
    }).catch((err)=>{
        alert(err)
    })
})

export const searchPlace=createAsyncThunk("searchPlace",async(srhParam)=>{
    console.log(srhParam)
    return await axios.get("/travel/places",{params:{srhParam},withCredentials:true}).then((res)=>{

        console.log(res.data);
        
      return  res.data}
    ).catch((err)=>{
        alert(err)
    })
})
const travelRouteSlice=createSlice({
    name:"travelRoute",
    initialState:{
        addRoute:{
            loading:false,
            recentRoutes:[],
            srhResult:{
                loading:false,
                data:[]
            }
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(addRoute.pending,({addRoute})=>{
            addRoute.loading=true;
        })
        builder.addCase(addRoute.fulfilled,({addRoute},{payload})=>{
            addRoute.loading=false;
            // addRoute.recentRoutes=payload.data || []
        })
        builder.addCase(recentRoutes.pending,({addRoute},)=>{
            addRoute.loading=true
        })
        builder.addCase(recentRoutes.fulfilled,({addRoute},{payload})=>{
            addRoute.loading=false
            addRoute.recentRoutes=payload?.data || []
        })
        builder.addCase(searchPlace.pending,({addRoute})=>{
            addRoute.srhResult.loading=true;
        })
        builder.addCase(searchPlace.fulfilled,({addRoute},{payload})=>{
            addRoute.srhResult.loading=false;
            addRoute.srhResult.data=payload?.data || [];

        })
    }
})

export default travelRouteSlice.reducer;