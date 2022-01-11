import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Chat.style.scss";
import ChatAppBar from "./components/ChatAppBar/ChatAppBar";
import NewMessage from "./components/NewMessage/NewMessage";
import ChatBuble from "./components/ChatBuble/ChatBuble";
import SigninModal from "./components/SigninModal";
import { v4 as uuidv4 } from "uuid";

import { setUser, setMessages, insertMessage, 
  getMessagesWithPagination, decreaseCurrentPage, goToLastPage } from "../../redux/reducers/ChatReducer";
import { MESSAGES, PAGE_SIZE } from "../../Constants";
import useScrollPosition from '../../hooks/userScrollPosition';
import { IconButton, Button } from '@mui/material';
import { ArrowDownward } from "@mui/icons-material";

const Chat = () => {
  const dispatch = useDispatch();
  const { user, messages, currentPage, total } = useSelector((s) => s.chat);

  const [containerHasOverflow, setContainerHasOverflow] = useState(false);
  const [signInVisible, setSignInVisible] = useState(false);
  const [isScrollAtTheStop, setIsScrollAtTheStop] = useState(false);
  

  const container = useRef(null);

  const _scrollToBottom = () => {
    setTimeout(() => {
      if (container.current) {
        // container.current.scrollTop = container.current.scrollHeight;
        container.current.scrollTo({
          top: container.current.scrollHeight,
          left: 0,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const _sendMessage = async (message) => {
    if (!message) {
      return;
    }

    try {
      const newMessage = {
        id: uuidv4(),
        user,
        message,
        createDate: new Date().toString(),
      };

      // dispatch(setMessages(newMessage));
      dispatch(insertMessage(newMessage));
    } catch (err) {
      console.error(err);
    }
  };

  const _checkWindowSizeAndSetContainer = useCallback(() => {
    const windowWidth = document.getElementById("root").offsetHeight;
    const headerAndFooterHeight =
      document.querySelector(".chat-header").offsetHeight +
      document.querySelector(".chat-footer").offsetHeight;

    const containerHeight = container.current.offsetHeight;

    if (containerHeight >= windowWidth - headerAndFooterHeight) {
      if (!containerHasOverflow) {
        setContainerHasOverflow(true);
        return;
      }
    }
    setContainerHasOverflow(false);
  }, [containerHasOverflow]);


  const _openSignInModal = () => {
    setSignInVisible(true);
  };

  const _closeSignInModal = () => {
    setSignInVisible(false);
  };

  const _onSignIn = (userName) => {
    if (userName) {
      dispatch(setUser(userName));
      _closeSignInModal();
    }
  };


  const _onStorageUpdate = (e) => {
    const { key, newValue } = e;
    if (key === MESSAGES) {
      const messagesFromStorage = JSON.parse(newValue);
      const lastItem = messagesFromStorage[messagesFromStorage.length - 1];
      dispatch(setMessages([...messages, lastItem]));
      dispatch(getMessagesWithPagination());
      _scrollToBottom();
    }
  };

  const {scrollPosition, scrollHeight} = useScrollPosition(container.current);

  useEffect(() => {
        setIsScrollAtTheStop(scrollPosition === 0);
  }, [scrollPosition, scrollHeight]);

  // Load messages from storage for component mount
  useEffect(() => {
    dispatch(getMessagesWithPagination(true));
  } , [dispatch]);


  // Load messages from storage for every page change
  useEffect(() => {
    dispatch(getMessagesWithPagination(false));
  } , [dispatch, currentPage]);

  // Scroll to bottom when new message added
  useEffect(() => {

    // console.log("isScrollAtTheStop => ", isScrollAtTheStop);
    // console.log("total, page size => ", total, PAGE_SIZE );
    
    if(isScrollAtTheStop === false || total < PAGE_SIZE) {      
      _scrollToBottom();
      
    }
    _checkWindowSizeAndSetContainer();
    
    
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  useEffect(() => {
    if (!user) {
      _openSignInModal();
    }
  }, [user]);

  useEffect(() => {
    window.addEventListener("storage", _onStorageUpdate);
    return () => {
      window.removeEventListener("storage", _onStorageUpdate);
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  // console.log("messages", messages);



  return (
    <div className="chat">
      <SigninModal open={signInVisible} onSubmit={(name) => _onSignIn(name)} />
      <ChatAppBar user={user} />
      <div
        ref={container}
        className="conversation"
        id="conversation"
        style={{
          overflowY: containerHasOverflow ? "scroll" : "notset",
        }}
      >
        {isScrollAtTheStop && total >= PAGE_SIZE  &&(
          <>
           {currentPage !== 1 && 
            <Button className="btn-load-more" onClick={() => dispatch(decreaseCurrentPage())}>Load More</Button>
            }
            <IconButton 
              color="primary" 
              className="btn-go-bottom" 
              onClick={() => {
                dispatch(goToLastPage())
                _scrollToBottom();
              }}>
                <ArrowDownward />
              </IconButton>
          </>
        )}

        <ul className="simple-lister vertical">
          {messages.map((i) => {
            return (
              <li key={i.id}>
                {" "}
                <ChatBuble
                  message={i.message}
                  user={i.user}
                  createDate={i.createDate}
                  isOwner={i.user === user}
                />
              </li>
            );
          })}
        </ul>
      </div>
      <NewMessage
        placeHolder="Sorunuzu buraya yazınız..."
        onEnterMessage={(val) => _sendMessage(val)}
      />
    </div>
  );
};

export default Chat;
