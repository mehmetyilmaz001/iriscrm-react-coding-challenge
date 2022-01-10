import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Chat.style.scss";
import ChatAppBar from "./components/ChatAppBar";
import NewMessage from "./components/NewMessage";
import ChatBuble from "./components/ChatBuble/ChatBuble";
import SigninModal from "./components/SigninModal";

import { setUser, setMessages, setMessagesFromClients } from '../../redux/reducers/ChatReducer';
import {MESSAGES } from '../../Constants';

const Chat = () => {
  const dispatch = useDispatch();
  const { user, messages, messagesFromClients } = useSelector(s => s.chat)

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
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if(!user){
      _openSignInModal();
    }
  }, [user]);

  useEffect(() => {
    window.addEventListener("localstorage", e => {
      if(e.detail.key === MESSAGES) {
        console.log("store listen", e.detail);
        // const messagesFromClients = JSON.parse(e.detail.newValue);
        // dispatch(setMessagesFromClients(messagesFromClients));
      }
    });


    // return () => {
    //   // window.removeEventListener("localstorage", () => {});
    // }
  }, [])


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
          {messages.map((i) => {
            return (
              <li key={new Date().getTime}>
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
