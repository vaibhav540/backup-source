import { v4 as uuidv4 } from 'uuid';


export const setAccountDetails = (account) => {
  return {
    type: "SET_ACCOUNT_DETAILS",
    payload: account,
  };
};
export const DELETE_SESSION = 'DELETE_SESSION';

export const deleteSession = (sessionId) => ({
  type: DELETE_SESSION,
  payload: sessionId
});

export const setIsSidebarOpen = (isSidebarOpen) => {
  return {
    type: "SET_IS_SIDEBAR_OPEN",
    payload: isSidebarOpen,
  };
};
export const setIsFirstLoading = (isFirstLoading) => {
  return {
    type: "SET_IS_FIRST_LOADING",
    payload: isFirstLoading,
  };
};
export const setSessionID = (sessionID) => ({
  type: "SET_SESSION_ID",
  payload: sessionID || uuidv4() // Generate new ID if none provided
});

export const setSegment = (segment) => {
  return {
    type: "SET_SEGMENT",
    payload: segment,
  };
};

export const setChat = (chat) => {
  return {
    type: "SET_CHAT",
    payload: chat,
  };
};

export const setAllChat = (allChat) => {
  return {
    type: "SET_ALL_CHAT",
    payload: allChat,
  };
};
export const setLogout = () => {
  return {
    type: "SET_LOGOUT",
  };
};
export const setChatLogout = () => {
  return {
    type: "SET_CHAT_LOGOUT",
  };
};

export const setEnvironment = (environment) => {
  return {
    type: "SET_ENVIRONMENT",
    payload: environment,
  };
 };
 export const setUploadedImage=(image)=>{
    return{
      type: "SET_UPLOADED_IMAGE",
      payload: image
    }
  };
  export const clearUploadedImage = () => {
    return {
      type: "CLEAR_UPLOADED_IMAGE",
    };
  };
