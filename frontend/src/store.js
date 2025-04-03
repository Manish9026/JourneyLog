import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";travelRouteSlice
import travelRouteSlice from "./slices/travelRouteSlice";
import statementSlice from './slices/statementSlice'
import detailReducer from "./slices/detailSlice";
import { paymentReducer } from "./slices/paymentSlice";
import { homeReducer } from "./slices/homeSlice";
import {setupListeners} from '@reduxjs/toolkit/query'
import { dealerApi } from "./services/dealer";
export const store=configureStore({
    reducer:{
        home:homeReducer,
        payment:paymentReducer,
        detail:detailReducer,
        statement:statementSlice,
       auth:authSlice,
       travelRoute:travelRouteSlice,
       [dealerApi.reducerPath]:dealerApi.reducer
    },


    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false, // ✅ Keep this
        }).concat(dealerApi.middleware),
  


})


setupListeners(store.dispatch)