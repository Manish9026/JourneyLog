import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";travelRouteSlice
import travelRouteSlice from "./slices/travelRouteSlice";
import statementSlice from './slices/statementSlice'
import detailReducer from "./slices/detailSlice";
import { paymentReducer } from "./slices/paymentSlice";
import { homeReducer } from "./slices/homeSlice";

export const store=configureStore({
    reducer:{
        home:homeReducer,
        payment:paymentReducer,
        detail:detailReducer,
        statement:statementSlice,
       auth:authSlice,
       travelRoute:travelRouteSlice
    }

})
