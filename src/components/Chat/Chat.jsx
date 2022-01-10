import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Chat.style.scss";
import ChatAppBar from "./components/ChatAppBar";
import NewMessage from "./components/NewMessage";
import ChatBuble from "./components/ChatBuble/ChatBuble";
import SigninModal from "./components/SigninModal";
import { v4 as uuidv4 } from 'uuid';


import { setUser, setMessages } from '../../redux/reducers/ChatReducer';
import {MESSAGES } from '../../Constants';
import useLocalStorage from "../../hooks/useStorage";

const Chat = () => {
  const dispatch = useDispatch();
  const { user, messages } = useSelector(s => s.chat)

  const [ _messages, _setMessages ] = useState(messages);
  const [containerHasOverflow, setContainerHasOverflow] = useState(false);
  const [signInVisible, setSignInVisible] = useState(false);
  const container = useRef(null);

 

  const _scrollToBottom = () => {
    setTimeout(() => {
      if (container.current) {
        container.current.scrollTop = container.current.scrollHeight;
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

      dispatch(setMessages(newMessage))
      _checkWindowSizeAndSetContainer();
      _scrollToBottom();
    } catch (err) {
      console.error(err);
    }
  };

  const _checkWindowSizeAndSetContainer = useCallback( () => {
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

  // console.log(chatRecords);

  const _openSignInModal = () => {
    setSignInVisible(true);
  }

  const _closeSignInModal = () => {
    setSignInVisible(false);
  }

  const _onSignIn = (userName) => {
    if(userName){
      dispatch(setUser(userName));
      _closeSignInModal();
    }
  }

  useEffect(() => {
    _checkWindowSizeAndSetContainer();
     _setMessages(messages);
     _scrollToBottom();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages])

  useEffect(() => {
    if(!user){
      _openSignInModal();
    }
  }, [user]);


  //Listen for new messages from other clients
  const { on, off, get } = useLocalStorage("local");
  useEffect(() => {
    const callBack = (key) => {
      console.log("storage listen callback", key);
      
      if(key === MESSAGES){
        const messagesFromStorage = JSON.parse(get(MESSAGES));
        const lastItem = messagesFromStorage[messagesFromStorage.length - 1];
        _setMessages((prevState) => [...prevState, lastItem]);
        _scrollToBottom();
      }
    }

    on("set", callBack);

    return () => off("set", callBack);
  } , [get, on, off]);

  
  return (
    <div className="chat">
      <SigninModal 
        open={signInVisible} 
        onSubmit={(name) => _onSignIn(name)} />
      <ChatAppBar user={user} />
      <div
        ref={container}
        className="conversation"
        id="conversation"
        style={{
          overflowY: containerHasOverflow ? "scroll" : "notset",
        }}
      >
        <ul className="simple-lister vertical">
          {_messages.map((i) => {
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
