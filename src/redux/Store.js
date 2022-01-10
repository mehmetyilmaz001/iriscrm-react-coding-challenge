import { configureStore } from "@reduxjs/toolkit";
import ChatReducer from "./reducers/ChatReducer";
import { saveState} from './Store.helpers'


const reducers = {
    chat: ChatReducer,
};


const store = configureStore({
  reducer: reducers,
  devTools: process.env.NODE_ENV !== "production",
  // preloadedState: loadState(), //call loadstate method to initiate store from localstorage
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: false,
    }),
});


// handle state update event. Whenever the state will change, 
//this subscriber will call the saveState methode to update and persist the state into the store
// store.subscribe(
//   throttle(() => {
//     saveState(store.getState());
//   }, 1000)
// );
store.subscribe(
  () => {
    saveState(store.getState());
  }
);

export default store;
