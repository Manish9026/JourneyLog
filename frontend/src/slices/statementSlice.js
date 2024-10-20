import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "../utils/url";
import { urlReloader } from "../utils/urlReloder";

axios.defaults.baseURL=url
export const  getStatements=createAsyncThunk("getStatements",async(statementData,{dispatch})=>{
    return await axios.post(`/travel/all-routes?skip=${statementData?.skip || 0}&next=${statementData?.next || 5} &company=${statementData?.company} &getType=statement`,{filter:statementData?.filterData},{withCredentials:true,}).then((res)=>{
        urlReloader({response:res.data,dispatch,messageAllow:false});
        console.log(res.data);       
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
        printLoading:false

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
        }
    },

    extraReducers:(builder)=>{

        builder.addCase(getStatements.pending,(state)=>{
            state.loading=true;
        })
        builder.addCase(getStatements.fulfilled,(state,{payload})=>{
            state.loading=false;
            state.statement=payload?.data || []
        })

    }

})
export const {sort,setPrintLoading}=statementSlice.actions
export default statementSlice.reducer;