import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/cartSlice";
import { Api } from "./api";
import { setupListeners } from '@reduxjs/toolkit/query'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    [Api.reducerPath]: Api.reducer,
  },
 
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(Api.middleware),
});


setupListeners(store.dispatch);