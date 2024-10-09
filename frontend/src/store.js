import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";travelRouteSlice
import travelRouteSlice from "./slices/travelRouteSlice";
import statementSlice from './slices/statementSlice'
import detailReducer from "./slices/detailSlice";

export const store=configureStore({
    reducer:{
        detail:detailReducer,
        statement:statementSlice,
       auth:authSlice,
       travelRoute:travelRouteSlice
    }

})
