// ChatManager.jsx
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Paper,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";

import heroMotorLogo from "../../assets/logos/heroMotorLogo.png";

const ChatManager = () => {
  const messages = useSelector((state) => state.chat.chat);
  console.log(messages,"here is your messages")
  const messagesEndRef = useRef(null);

  // Auto‑scroll to the newest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        flexGrow: 1,
        overflowY: "auto",
        padding: "10px 0",
        paddingBottom: "70px",
      }}
    >
{messages.map((message, index) => (
  <Box key={`message-wrapper-${index}`}>
    {/* ---------- USER PROMPT ---------- */}
    <motion.div
      key={`user-${index}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      style={{
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: "12px",
        marginTop:"80px",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          px: 2.5,
          py: 1.5,
          maxWidth: "75%",
          borderRadius: "16px 0px 16px 16px",       // chat‑bubble tail
          background: "linear-gradient(130deg, #ee2326, black)", // red → black
          color: "#ffffff",
          textShadow: "1px 1px 2px rgba(0,0,0,0.4)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          fontSize: 16,
          lineHeight: 1.5,
        }}
      >
        <Typography variant="body1">{message.input_prompt}</Typography>
      </Paper>
    </motion.div>

    {/* ---------- BOT REPLY ---------- */}
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
      {/* Loader or static logo */}
      {message.text === undefined ? (
        <Box className="loader-container" sx={{ mt: 0.5 }}>
          <Box className="loader" />
          <img src={heroMotorLogo} alt="Logo" className="loader-logo" />
        </Box>
      ) : (
        <Box sx={{ mt: 0.8 }}>
          <img
            src={heroMotorLogo}
            alt="Logo"
            style={{ width: 28, borderRadius: "50%" }}
          />
        </Box>
      )}

      <motion.div
        key={`bot-${index}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "12px",
          width: "100%",
        }}
      >
        <Paper
          elevation={2}
          sx={{
                  px: 2,
                  py: 1,
                  maxWidth: "100%",
                  borderRadius: "18px",
                  backgroundColor: "background.ai_prompt",
                  color: "text.primary",
                  boxShadow: "none",
                }}
        >
          <Typography variant="body1" sx={{ mt: message.text ? 0 : 1 }}>
            {message.text !== undefined ? message.text : "Loading..."}
          </Typography>
        </Paper>
      </motion.div>
    </Box>
  </Box>
))}



      <div ref={messagesEndRef} />
    </motion.div>
  );
};

export default ChatManager;
