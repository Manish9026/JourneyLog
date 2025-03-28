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
            dispatch(getStatements({skip:0,next:5,company:""}))
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

export const updateTravelRoute=createAsyncThunk("updateTravelRoute",async(data,{dispatch})=>{
    console.log(data,"data");
    
        return await axios.patch("/travel/update",data,{withCredentials:true}).then((res)=>{
        
        urlReloader({response:res.data,dispatch});
    
        if(res.data.status){
            if(res.data.data.editFrom=="statement"){
                dispatch(getStatements({skip:0,next:5,company:""}))
                console.log("statement");
                
            }
            else
                dispatch(recentRoutes())
                dispatch(setEditAlert({type:"clear"}))

        }
        return res.data
        }).catch((err)=>{
            console.log(err);
            
            alert(err)
        })
    })

    export const deleteTravelRecords=createAsyncThunk("deleteTravelRecords",async(data,{dispatch})=>{
        console.log(data,"data");
        
            return await axios.post("/travel/delete-rocord-company",data,{withCredentials:true}).then((res)=>{
            
            urlReloader({response:res.data,dispatch});
        
            return res.data
            }).catch((err)=>{
                console.log(err);
                
                alert(err)
            })
        })

    export const getTravelRecord=createAsyncThunk("getTravelRecord",async(data,{dispatch})=>{
            console.log(data,"data");
            
                return await axios.get("/travel/getTravelRecords",{withCredentials:true,params:data}).then((res)=>{
                
                urlReloader({response:res.data,dispatch,messageAllow:false});
            
                return res.data
                }).catch((err)=>{
                    console.log(err);
                    
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
        },
        editState:{
            alert:false,
            loading:false,
            data:{},
        },
        deleteAllRecordsState:{
            message:"",
            loading:false,
            error:"",
            status:""
        },
        travelRecords:{
            loading:false,
            data:[]
        },
        popupType:""
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
        setAlert:(state)=>{
            state.deleteState.alert=state.deleteState.alert===1?true:1;
            state.popupType="del"
        },
        setEditAlert:(state,{payload})=>{
            if(payload && payload.type=="clear"){
                state.editState.data={}
            }

            state.editState.alert=state.editState.alert===1?true:1;
            state.popupType="edit";
        },
        setEditData:({editState},{payload})=>{
            if(payload){

                editState.data=payload;
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

        builder.addCase(deleteTravelRecords.pending,({deleteAllRecordsState})=>{
            deleteAllRecordsState.loading=true;
        })
        builder.addCase(deleteTravelRecords.fulfilled,({deleteAllRecordsState},{payload})=>{
            deleteAllRecordsState.loading=false;
            deleteAllRecordsState.message=payload?.message || "";
            deleteAllRecordsState.error=payload?.error || "";
            deleteAllRecordsState.status=payload?.status
        })

        builder.addCase(getTravelRecord.pending,({travelRecords})=>{        
            travelRecords.loading=true;
            
        })

        builder.addCase(getTravelRecord.fulfilled,({travelRecords},{payload})=>{
            travelRecords.loading=false;
            travelRecords.data=payload?.data || [];

        })


    }
})
export const {setDelStateData,setAlert,setEditAlert,setEditData}=travelRouteSlice.actions;
export default travelRouteSlice.reducer;