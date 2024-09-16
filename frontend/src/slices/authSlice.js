import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { url } from '../utils/url'
import { urlReloader } from '../utils/urlReloder'
axios.defaults.baseURL = url
export const login = createAsyncThunk("login", async (formdata) => {
    return await axios.post("/user/login", formdata, { withCredentials: true }).then(res => {
        urlReloader(res.data)
    //    console.log( res.data)
        return res.data
    }).catch((error)=>{
        return error
    })
})

export const register = createAsyncThunk("register", async (formdata) => {
   try{
    // console.log(formdata);
    
     const data = new FormData();
    for (const key in formdata) {
        data.append(key, formdata[key]);
    }

    return await axios.post("/user/register", data).then(res => {

        urlReloader(res.data);
// console.log(res.data);

        return res.data
    }).catch((error) => {
        alert(error)
        return error
    })}
    catch(error){
console.log(error);

    }
})
export const isVerified=createAsyncThunk("isVerified",async(_,{dispatch})=>
    {
    
    
    const response= await axios.get('/user/verify',{withCredentials:true});

    // console.log(response.data);
    urlReloader(response.data,dispatch)
    // if(response.data.statusCode==65){
    //     dispatch(setFormStatus({login:true}))
    // }
    return response.data
})



export const logout=createAsyncThunk("logout",async()=>{
    return await axios.get('/user/logout',{withCredentials:true}).then(res=>{

        urlReloader(res.data)
        return res.data
    }).catch(err=>{
        alert(err)
    })
})
const authSlice = createSlice({
    name: "auth",
    initialState: {
        status: false,
        loading: false,
        userInfo:{},
        formStatus:{
            login:false,
            register:false
        }
    },
    reducers:{
        setFormStatus(state,{payload}){
           Object.keys(payload).map((key,indx)=>{
            state.formStatus[key]=Boolean(payload[key])        
           })
            // state.formStatus[Object.entries(payload)[0][0]]=Boolean(Object.entries(payload)[0][1])
        }
    },
    extraReducers:(builder)=>{


        builder.addCase(register.pending,(state)=>{
            state.loading=true;
        })
        builder.addCase(register.fulfilled,(state,{payload})=>{
            state.loading=false;
            state.status=payload?.status
        })
        builder.addCase(login.pending,(state)=>{
            state.loading=true;
        })
        builder.addCase(login.fulfilled,(state,{payload})=>{
            state.loading=false;
            state.userInfo=payload?.data;
            state.status=payload?.status
        })

        builder.addCase(isVerified.fulfilled,(state,{payload})=>{
            
            state.status=payload?.status;
            state.userInfo=payload?.data;
        })
      
        builder.addCase(logout.fulfilled,(state,{payload})=>{
            state.status=false
        })


    },
})
export const {setFormStatus}=authSlice.actions;
export default authSlice.reducer