import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "../utils/url";
import { urlReloader } from "../utils/urlReloder";
import isNotEmpty from "../utils/isNotEmpty";

axios.defaults.baseURL=url
export const  getStatements=createAsyncThunk("getStatements",async(statementData,{dispatch})=>{
    return await axios.post(`/travel/all-routes?skip=${statementData?.skip || 0}&next=${statementData?.next || 5} &company=${statementData?.company} &getType=statement`,{filter:statementData?.filterData},{withCredentials:true,}).then((res)=>{
        urlReloader({response:res.data,dispatch,messageAllow:false});
        console.log(res.data);  
        if(statementData?.refetch)
             res.data.refetch = statementData?.refetch || false 
       
        return res.data
    }).catch((err)=>{
        alert(err)
    })
})


const statementSlice=createSlice({
    name:"statement",
    initialState:{
        statement:[],
        loading:false,
        printLoading:false,
        next:null,
        skip:null,
        filterStates:{},
        scrollStates:{
            loading:false,
            isFull:false
        }

    },
    reducers:{
        sort({statement,loading},{payload}){
            if(payload=='1'){
                // if(Array.isArray(statement)){
                statement.sort((a,b)=>new Date(a.createdAt) - new Date(b.createdAt))
                
            }else{
                statement.sort((a,b)=>new Date(b.createdAt) - new Date(a.createdAt))
            }

        },
        setPrintLoading(state,{payload}){            
           state.printLoading=payload
        },
        setFilterStates(state,{payload}){
            state.filterStates=payload
        }
    },

    extraReducers:(builder)=>{

        builder.addCase(getStatements.pending,(state)=>{
            state.loading=true;
        })
        builder.addCase(getStatements.fulfilled,(state,{payload})=>{
            state.loading=false;
            if(!payload?.refetch){
                state.scrollStates.isFull=false
                state.statement=payload?.data?.travelRoute || [];
            }else{
                state.scrollStates.isFull=false
                // state.scrollStates.loading=true
                state.statement=[...state.statement,...payload?.data?.travelRoute || []] || [];
                if(payload?.data?.travelRoute?.length==0 || !payload?.data?.travelRoute){
                    state.scrollStates.isFull=true
                    // state.scrollStates.loading=false
                }
            }
            // state.statement=payload?.data?.travelRoute || [];
            state.next=payload?.data?.next || null;
            state.skip=payload?.data?.skip || null;
        })
        builder.addCase(getStatements.rejected,(state)=>{
            state.loading=false;
        })

    }

})
export const {sort,setPrintLoading,setFilterStates}=statementSlice.actions
export default statementSlice.reducer;