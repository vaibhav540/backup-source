import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  IconButton,
  Container,
  Typography,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import chatService from "../services/chat.service";
import useChat from "../hooks/useChat";
import { setIsFirstLoading, setSessionID } from "../redux/actions";
import ChatManager from "./shared/ChatManager";

const ChatInterface = () => {
  const isSidebarOpen = useSelector((state) => state.account.isSidebarOpen);
  const accountDetails = useSelector((state) => state.account.accountDetails);
  const sessionID = useSelector((state) => state.chat.session_id);
  const messages = useSelector((state) => state.chat.chat);
  const isFirstLoad = useSelector((state) => state.account.isFirstLoading);
  const dispatch = useDispatch();
  const { addMessage, addMessageToChat } = useChat();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    setLoading(true);
    if (input.trim() === "") return;
    dispatch(setIsFirstLoading(false));
    const inputPrompt = input.trim();
    const tempMessages = [...messages];
    const structuredMessage = {
      input_prompt: inputPrompt,
      text: undefined,
      images: [],
    };
    addMessage([...messages, structuredMessage]);
    try {
      const payload = sessionID
        ? {
            question: inputPrompt,
            session_id: sessionID,
            "sub-segment":"LCV",
          }
        : {
            texts: [inputPrompt],
          };
      const response = await chatService.sendMessage(payload);
      // let response = sampleResponse;
      console.log("response", response);
      const structuredMessage = {
        input_prompt: inputPrompt,
        text: response?.responses[1].Structured_response,
        session_id: response?.session_id,
        created_on: new Date().toISOString(),
        segment:lcv,
        sub_segment:service-manual,
        images: (response?.citations?.length > 0 && response?.citations) || [],
      };
      dispatch(setSessionID(response?.session_id));
      addMessage([...tempMessages, structuredMessage]);
      addMessageToChat(structuredMessage);
      setLoading(false);
      setInput("");
    } catch (error) {
      console.log(error);
      setLoading(false);
      const structuredMessage = {
        input_prompt: inputPrompt,
        text: "Something Went Wrong",
        images: [],
      };
      const newMessages = [...tempMessages, structuredMessage];
      addMessage(newMessages);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        width: "90%",
        height: isFirstLoad ? "70vh" : "auto",
        display: "flex",
        overflow: "visible",
        flexDirection: "column",
        position: "relative",
        mx: "auto",
        px: 4,
      }}
    >
      <AnimatePresence>
        {!isFirstLoad && <ChatManager messages={messages} />}
      </AnimatePresence>
      <Box
        component={motion.div}
        layout
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          padding: "12px 6px",
          pb: 3,
          backgroundColor: "background.default",
          ...(isFirstLoad
            ? {
                position: "absolute",
                top: "30%",
                left: 0,
                boxShadow: "none",
                background: "background.default",
              }
            : {
                position: "fixed",
                bottom: 0,
                right: 0,
                zIndex: 10,
                width: "100%",
                background: "background.default",
              }),
        }}
      >
        <Box
          sx={{
            width: "100%",
            pl: isSidebarOpen && !isFirstLoad ? "280px" : 0,
            margin: "0 50px",
            position: "relative",
          }}
        >
          {isFirstLoad && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                paddingBottom: "30px",
                mb: 3,
              }}
            >
              <Typography
                variant="h4"
                gutterBottom
                fontWeight="bold"
                className="gradient-text "
                color="primary"
                sx={{ display: "flex", alignItems: "center", gap: 2 }}
              >
                <Typography
                  variant="h4"
                  className="gradient-text"
                  sx={{ m: 0, p: 0, color: "text.main_title", fontWeight: 700 }}
                >
                  Hello,
                </Typography>
                User
              </Typography>
            </Box>
          )}

          <TextField
            fullWidth
            maxRows={3}
            multiline
            variant="outlined"
            placeholder="Start a conversation..."
            value={input}
            disabled={loading}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            inputRef={inputRef}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "24px",
                backgroundColor: "background.paper",
                p: 2,
                pr: "60px",
                height: "auto",
                boxShadow: "0 6px 10px rgba(0, 0, 0, 0.2)",
              },
              width: "100%",
            }}
          />
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              position: "absolute",
              right: "8px",
              bottom: 8,
            }}
          >
            {loading ? (
              <CircularProgress
                size="28px"
                thickness={8}
                color="inherit"
                sx={{
                  p: "5px",
                }}
              />
            ) : (
              <IconButton
                onClick={handleSend}
                color="primary"
                disabled={input.trim() === "" || loading}
                sx={{
                  p: "10px",
                }}
              >
                <SendIcon />
              </IconButton>
            )}
          </motion.div>
        </Box>
      </Box>
      <div ref={messagesEndRef} />
    </Container>
  );
};

export default ChatInterface;
