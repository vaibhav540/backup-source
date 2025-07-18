const initialState = {
  accountDetails: {},
  isSidebarOpen: true,
  isFirstLoading: true,
  environment: 'development',
};

const chatInitialState = {
  chat: [],
  allChat: [],
  session_id: uuidv4(),
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_ACCOUNT_DETAILS":
      return {
        ...state,
        accountDetails: action.payload,
      };
    case "SET_IS_SIDEBAR_OPEN":
      return {
        ...state,
        isSidebarOpen: action.payload,
      };
    case "SET_IS_FIRST_LOADING":
      return {
        ...state,
        isFirstLoading: action.payload,
      };
    case "SET_ENVIRONMENT":
      return {
        ...state,
        environment: action.payload,
      };
    case "SET_LOGOUT":
      return {
        ...state,
        accountDetails: null,
        isFirstLoading: true
      };

    default:
      return state;
  }
};

// export const chatReducer = (state = chatInitialState, action) => {
//   switch (action.type) {
//     case "SET_SESSION_ID":
//       return {
//         ...state,
//         session_id: action.payload,
//       };
//     case "SET_CHAT":
//       return {
//         ...state,
//         chat: action.payload,
//       };
//     case "SET_ALL_CHAT":
//       return {
//         ...state,
//         allChat: action.payload,
//       };
//     case "SET_CHAT_LOGOUT":
//       return {
//         ...chatInitialState,
//       };
//     default:
//       return state;
//   }
// };
import { v4 as uuidv4 } from 'uuid';

export const chatReducer = (state = chatInitialState, action) => {
  switch (action.type) {
    case "SET_SESSION_ID":
      return {
        ...state,
        session_id: action.payload || uuidv4(),
      };
       case "DELETE_SESSION":
      return {
        ...state,
        allChat: state.allChat.filter(msg => msg.session_id !== action.payload),
        chat: state.chat[0]?.session_id === action.payload ? [] : state.chat
      };
    case "SET_CHAT":
      return {
        ...state,
        chat: action.payload,
      };
    case "SET_ALL_CHAT":
      return {
        ...state,
        allChat: action.payload,
      };
    case "SET_CHAT_LOGOUT":
      return {
        ...chatInitialState,
        session_id: uuidv4(),
      };
      case "SET_SEGMENT":
  return {
    ...state,
    segment: action.payload
  };
    default:
      return state;
  }
};
