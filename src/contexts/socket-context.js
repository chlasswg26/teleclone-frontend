import { useReducer, createContext } from "react";
import {
  readProfile,
  updateProfile,
  findContact,
  readContact,
  addContact,
  deleteContact,
  readChat,
  sendChat,
  deleteChat
} from "./types/socket";

export const SocketContext = createContext();

const initialState = {
  profile: {
    read: {
      data: {},
      errorMessage: ''
    },
    update: {
      info: '',
      errorMessage: ''
    }
  },
  contact: {
    find: {
      data: {},
      errorMessage: ''
    },
    read: {
      data: {},
      errorMessage: ''
    },
    add: {
      info: '',
      errorMessage: ''
    },
    delete: {
      info: '',
      errorMessage: ''
    }
  },
  chat: {
    read: {
      data: [],
      errorMessage: ''
    },
    send: {
      errorMessage: ''
    },
    delete: {
      info: '',
      errorMessage: ''
    }
  }
};

const reducer = (state, action) => {
  switch (action.type) {
      case readProfile:
        return {
          profile: {
            read: action.payload
          }
        }
      case updateProfile:
        return {
          profile: {
            update: action.payload
          }
        }
      case findContact:
        return {
          contact: {
            find: action.payload
          }
        }
      case readContact:
        return {
          contact: {
            read: action.payload
          }
        }
      case addContact:
        return {
          contact: {
            add: action.payload
          }
        }
      case deleteContact:
        return {
          contact: {
            delete: action.payload
          }
        }
      case readChat:
        return {
          chat: {
            read: action.payload
          }
        }
      case sendChat:
        return {
          chat: {
            send: action.payload
          }
        }
      case deleteChat:
        return {
          chat: {
            delete: action.payload
          }
        }
    default:
      return state
  }
};

export const SocketContextProvider = props => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <SocketContext.Provider value={[state, dispatch]}>
      {props.children}
    </SocketContext.Provider>
  );
};
