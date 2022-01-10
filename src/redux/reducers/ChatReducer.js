import { MESSAGES, USER } from '../../Constants';
import { createSlice } from "@reduxjs/toolkit";

const storedMessages = JSON.parse(window.localStorage.getItem(MESSAGES));
const sessionUser =  JSON.parse(window.sessionStorage.getItem(USER));
const initialState = {
    user: sessionUser || null,
    messages: storedMessages || [],
    messagesFromClients: [],
}

const chat = createSlice({
    name: "chat",
    initialState,
    reducers: {
      setUser: (
        state,
        action
      ) => void (state.user = action.payload),
      setMessages: (state, action) => {
        state.messages = [...(state.messages || []), action.payload];
      },
      setMessagesFromClients: (state, action) => {
        state.messagesFromClients = [...(state.messagesFromClients || []), action.payload];
      }

    }
});


export const {
    setUser,
    setMessages,
    setMessagesFromClients
} = chat.actions;

export default chat.reducer;