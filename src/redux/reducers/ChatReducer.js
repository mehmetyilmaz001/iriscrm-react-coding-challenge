import { MESSAGES, USER } from '../../Constants';
import { createSlice } from "@reduxjs/toolkit";

const storedMessages = JSON.parse(window.localStorage.getItem(MESSAGES));
const sessionUser =  JSON.parse(window.sessionStorage.getItem(USER));

const initialState = {
    user: sessionUser || null,
    messages: storedMessages || [],
}

const chat = createSlice({
    name: "chat",
    initialState,
    reducers: {
      setUser: (
        state,
        action
      ) => {
         state.user = action.payload;
         window.sessionStorage.setItem(USER, JSON.stringify(action.payload));

      },
      setMessages: (state, action) => {
        state.messages = [...(state.messages || []), action.payload];

        try{
        const meesagesFromStorageStr = JSON.parse(window.localStorage.getItem(MESSAGES));
        
        if(meesagesFromStorageStr) {
          console.log("meesagesFromStorageStr", meesagesFromStorageStr);
          
          const meesagesFromStorage = JSON.parse(window.localStorage.getItem(MESSAGES));
          const foundMsg = meesagesFromStorage.find(msg => msg.id === action.payload.id);
          
          if(!foundMsg) {
            meesagesFromStorage.push(action.payload);
            window.localStorage.setItem(MESSAGES, JSON.stringify(meesagesFromStorage));
          }
        }else{
          // Set initial storage values
          window.localStorage.setItem(MESSAGES, JSON.stringify(state.messages));          
        }
      } catch(err) {
        console.error("storage parse err:", err);
      }
      }

    }
});


export const {
    setUser,
    setMessages,
} = chat.actions;

export default chat.reducer;