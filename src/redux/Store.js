import { configureStore } from "@reduxjs/toolkit";
import ChatReducer from "./reducers/ChatReducer";


const reducers = {
    chat: ChatReducer,
};


const store = configureStore({
  reducer: reducers,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: false,
    }),
});


export default store;
