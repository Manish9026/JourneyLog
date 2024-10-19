import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { urlReloader } from "../utils/urlReloder";
import { url } from "../utils/url";
import { getStatements } from "./statementSlice";
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
export const deleteRoute=createAsyncThunk("deleteRoute",async(data,{dispatch})=>{
console.log(data,"data");

    return await axios.delete("/travel/delete",{withCredentials:true,data}).then((res)=>{
    
    urlReloader({response:res.data,dispatch});

    if(res.data.status){
        if(res.data.data.deleteFrom=="statement")
            dispatch(getStatements())
        else
            dispatch(recentRoutes())
    }
    return res.data
    }).catch((err)=>{
        alert(err)
    })
})
// export const  recentRoutes=createAsyncThunk("recentRoutes",async(navigate,{dispatch})=>{
//     return await axios.get(`/travel/getRecentRoutes?skip=${navigate?.skip || 0}&next=${navigate?.next || 5}`,{withCredentials:true}).then((res)=>{
//         urlReloader({response:res.data,dispatch,messageAllow:false});
//         console.log(res.data);       
//         return res.data
//     }).catch((err)=>{
//         alert(err)
//     })
// })

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
    return await axios.get("/travel/places",{params:{srhParam},withCredentials:true}).then((res)=>{
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
            },
           
        },
        deleteState:{
            alert:false,
            loading:false,
            data:[],
        }
    },
    reducers:{
        setDelStateData:({deleteState},{payload})=>{
            if(payload?.detail && payload?.type=="add"){
            deleteState.data.push(payload.detail)
            // deleteState.alert=true;
        }
        if(payload?.type=="delete"){
            deleteState.data=[]
        }
        
        },
        setAlert:({deleteState})=>{
            deleteState.alert=!deleteState.alert
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
export const {setDelStateData,setAlert}=travelRouteSlice.actions;
export default travelRouteSlice.reducer;