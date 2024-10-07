import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";travelRouteSlice
import travelRouteSlice from "./slices/travelRouteSlice";


export const store=configureStore({
    reducer:{
        
       auth:authSlice,
       travelRoute:travelRouteSlice
    }

})
