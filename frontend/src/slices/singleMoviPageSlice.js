import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const moviApiSetting=(param)=>{

    let settings = {
        "url": `https://api-gate2.movieglu.com/${param}`,
        "method": "GET",
        "timeout": 0,
        "headers": {
        "api-version": "v201",
        "Authorization": "Basic TU9WSV8yMzc6YVExNXJuVzRpTTJ4",
        "client": "MOVI_237",
        "x-api-key": "TpPglqEF7S8Dh3vQmtqoQ9xUiqNEbCAp2S23S314",
        "device-datetime": "2024-09-15T07:21:42.248Z",
        "territory": "IN",
        },
        "withCredentials":true
       
        };
    return settings
}


export const  getshowTime=createAsyncThunk("getshowTime",async({movi_id,date})=>{

console.log(movi_id,date);

console.log(new Date());

// axios.get("",{withCredentials:true})
   return await (await axios(moviApiSetting(`filmShowTimes/?film_id=365963&date=2024-09-15`))).then((res)=>{
    console.log(res.data);

    return res.data
    

   }).catch((err)=>{

    console.log(err);

   })
})
export const getMoviDetailsAndCinema=createAsyncThunk("getMoviDetailsAndCinema",async({movi_id,IMDB_id})=>{
    console.log(movi_id);
    
    console.log(  Date.now().toString());

        
       return  await axios(
   moviApiSetting(`filmDetails/?film_id=${movi_id}`)
   ).then(res=>{console.log(res.data)
    return res.data;
   }
   ).catch(err=>console.log(err)
   )
})
export const getMovieData=createAsyncThunk("getMovieData",async ({movi_id,IMDB_id})=>{
    let settings = {
        "url": `https://api-gate2.movieglu.com/filmDetails/?film_id=${movi_id}`,
        "method": "GET",
        "timeout": 0,
        "headers": {
        "api-version": "v201",
        "Authorization": "Basic TU9WSV8yMzY6VVZEN3ZIdjFEMnNX",
        "client": "MOVI_236",
        "x-api-key": "c24arLPNJh66nISFgzeL94x6zzNTlAtI2ozwWKDR",
        "device-datetime": "2020-06-18T12:07:57.296Z",
        "territory": "IN",
        },
        };
        const options = {
            method: 'GET',
            url: 'https://imdb146.p.rapidapi.com/v1/title/',
            params: {id: IMDB_id},
            headers: {
              'x-rapidapi-key': 'b371688177msh7e77dbb1331dbaep1ec891jsn553480282cf0',
              'x-rapidapi-host': 'imdb146.p.rapidapi.com'
            }
          };
          try {
            console.log("called");
            
            const response = await axios(options);
            // const {id,titleText,ratingsSummary,genres,plot,primaryImage,releaseDate,writers,directors} =response.data;
            console.log({...{movi_id},...response.data});
            return {...{movi_id},...response.data}
        } catch (error) {
            console.error(error);
            return {}
        }
        
//    await axios(
//    settings
//    ).then(res=>console.log(res.data)
//    ).catch(err=>console.log(err)
//    )
})
const singleMoviPageSlice=createSlice({
    name:"singleMoviPage",
    initialState:{
       loading:false,
       status:false,
       data:{},
       buyMoviContainer:{
        data:{},
        loading:false,
        status:false
       }
    },
    extraReducers:(builder)=>{

        builder.addCase(getMovieData.pending,(state)=>{
            state.loading=true;

        })
        builder.addCase(getMovieData.fulfilled,(state,{payload})=>{
            state.loading=false;
            state.data=payload || {}
            state.status=true;
        })

        builder.addCase(getMoviDetailsAndCinema.pending,({buyMoviContainer})=>{
            buyMoviContainer.loading=true;
        })
        builder.addCase(getMoviDetailsAndCinema.fulfilled,({buyMoviContainer},{payload})=>{
            buyMoviContainer.loading=false;
            buyMoviContainer.data=payload || {}
        })
    }
})

export default singleMoviPageSlice.reducer;