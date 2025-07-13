// hooks/useChat.js
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setAllChat,
  setChat,
  setIsFirstLoading,
  setSessionID,
      deleteSession
} from "../redux/actions";
import { v4 as uuidv4 } from 'uuid';

const useChat = () => {
  const dispatch = useDispatch();
  const allChatData = useSelector((state) => state.chat.allChat);
  const currentChat = useSelector((state) => state.chat.chat);
  const currentSessionId = useSelector((state) => state.chat.session_id);

  const addMessage = (messages) => {
    dispatch(setChat(messages));
  };

  const addMessageToChat = (message) => {
    const messageWithSession = { 
      ...message,
      session_id: currentSessionId,
      created_on: new Date().toISOString()
    };
    console.log("Adding message to chat:", messageWithSession);
    console.log("All Chat Data before adding:", allChatData);
    // Check for duplicates before adding
    const isDuplicate = allChatData.some(msg => msg.input_prompt === messageWithSession.input_prompt && msg.session_id === messageWithSession.session_id);
    if (!isDuplicate) {
      dispatch(setAllChat([...allChatData, messageWithSession]));
      console.log("All Chat Data after adding:", [...allChatData, messageWithSession]);
    } else {
      console.log("Duplicate message detected, not adding to chat data.");
    }
  };

  const deleteSessionAction = (sessionId) => {
    dispatch(deleteSessionAction(sessionId));
    if (sessionId === currentSessionId) {
      startNewChat();
    }
  };

  const clearMessages = () => {
    dispatch(setChat([]));
  };

  const startNewChat = () => {
    if (currentChat.length > 0) {
      const sessionMessages = currentChat.map(msg => ({
        ...msg,
        session_id: currentSessionId
      }));
      dispatch(setAllChat([...allChatData, ...sessionMessages]));
    }
    
    clearMessages();
    dispatch(setSessionID(uuidv4()));
    dispatch(setIsFirstLoading(true));
  };

  return {
    addMessage,
    addMessageToChat,
    clearMessages,
    startNewChat,
    deleteSessionAction,
  };
};

export default useChat;
