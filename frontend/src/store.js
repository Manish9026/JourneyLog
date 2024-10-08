import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";travelRouteSlice
import travelRouteSlice from "./slices/travelRouteSlice";
import statementSlice from './slices/statementSlice'

export const store=configureStore({
    reducer:{
        
        statement:statementSlice,
       auth:authSlice,
       travelRoute:travelRouteSlice
    }

})
