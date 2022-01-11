import { MESSAGES, USER, PAGE_SIZE } from "../../Constants";
import { createSlice } from "@reduxjs/toolkit";

const sessionUser = JSON.parse(window.sessionStorage.getItem(USER));

const initialState = {
  user: sessionUser || null,
  messages: [],
  pageSize: PAGE_SIZE,
  currentPage: 1,
  total: 0,
};

const chat = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      window.sessionStorage.setItem(USER, JSON.stringify(action.payload));
    },
    setMessages: (state, action) => {
      // state.messag
      state.messages = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setTotal: (state, action) => {
      state.total = action.payload;
    }
  },
});

export const { setUser, setMessages, setCurrentPage, setTotal } = chat.actions;

export const insertMessage = (message) => (dispatch, getState) => {
  const { messages } = getState().chat;
  try {
    const meesagesFromStorageStr = JSON.parse(
      window.localStorage.getItem(MESSAGES)
    );

    if (meesagesFromStorageStr) {
      // console.log("meesagesFromStorageStr", meesagesFromStorageStr);

      const meesagesFromStorage = JSON.parse(
        window.localStorage.getItem(MESSAGES)
      );
      const foundMsg = meesagesFromStorage.find((msg) => msg.id === message.id);

      if (!foundMsg) {
        meesagesFromStorage.push(message);
        window.localStorage.setItem(
          MESSAGES,
          JSON.stringify(meesagesFromStorage)
        );
      }
    } else {
      // Set initial storage values
      // window.localStorage.setItem(MESSAGES, JSON.stringify(state.messages));
      window.localStorage.setItem(MESSAGES, JSON.stringify([message]));
    }

    dispatch(setMessages([...messages, message]));
    dispatch(setTotal(messages.length + 1));
  } catch (err) {
    console.error("storage parse err:", err);
  }
};

export const getMessagesWithPagination = (isInitialLoad) => (dispatch, getState) => {
  let { pageSize, currentPage, total } = getState().chat;
  const storedMessagesAsString = window.localStorage.getItem(MESSAGES);
  

  if (storedMessagesAsString) {
    const storedMessages = JSON.parse(window.localStorage.getItem(MESSAGES));
    dispatch(setTotal(storedMessages.length));
    const lastPage = Math.ceil(storedMessages.length / pageSize);

    if (isInitialLoad) {
      dispatch(goToLastPage());
    }

    // console.log("state", getState())
  

    let start = (currentPage - 1) * pageSize;
    let end = start + pageSize;

    // Show at least 25 items for in case of last page or first page
    if(currentPage === lastPage && total > PAGE_SIZE){
      start = storedMessages.length - pageSize;
      end = storedMessages.length;
    }else if(currentPage === 1){
      start = 0;
      end = pageSize;
    }

    const slicedMessages = storedMessages.slice(start, end);
    console.log("slicedMessages", slicedMessages, storedMessages);
    console.log("cur last", currentPage, lastPage);
    console.log("start end", start, end);
    dispatch(setMessages(slicedMessages));
  }
};


export const decreaseCurrentPage = () => (dispatch, getState) => {
  const { currentPage } = getState().chat;
  if(currentPage > -1){
    dispatch(setCurrentPage(currentPage - 1));
  }
}

export const goToLastPage = () => (dispatch, getState) => {
  const { total, pageSize } = getState().chat;
  const lastPage = Math.ceil(total / pageSize);
  dispatch(setCurrentPage(lastPage));
}

export default chat.reducer;
