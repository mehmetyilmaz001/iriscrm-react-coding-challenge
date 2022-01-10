import { MESSAGES, USER } from '../Constants';
import '../prototypes';

export const saveState = (state) => {
  
    try {
      const messagesStr = JSON.stringify(state.chat.messages);
      const user = JSON.stringify(state.chat.user);
      localStorage.setItem(MESSAGES, messagesStr);
      sessionStorage.setItem(USER, user);
    } catch (err) {
      console.log(
        "Redux was not able to persist the state into the localstorage"
      );
    }
  };

  // export const loadState = () => {
  //   try {
  //     const serializableState = localStorage.getItem("globalState");
  //     return serializableState !== null || serializableState === undefined
  //       ? JSON.parse(serializableState)
  //       : undefined;
  //   } catch (error) {
  //     return undefined;
  //   }
  // };