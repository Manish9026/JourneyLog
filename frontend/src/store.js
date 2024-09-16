import { configureStore } from "@reduxjs/toolkit";
import singleMoviPageSlice from "./slices/singleMoviPageSlice";
import buyticketSlice from "./slices/buyticketSlice";
import authSlice from "./slices/authSlice";

export const store=configureStore({
    reducer:{
       singleMoviPage:singleMoviPageSlice,
       buyTicket:buyticketSlice,
       auth:authSlice
    }

})
