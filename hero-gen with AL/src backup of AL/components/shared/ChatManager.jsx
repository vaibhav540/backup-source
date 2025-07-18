import React, { useState, useEffect, useRef } from "react";
import TypingEffect from "./TypingEffect";
import { backIn, motion } from "framer-motion";
import CombinedTypingEffect from "../FinalChat.jsx";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Button,
  Grow,
  Grid,
  CircularProgress,
} from "@mui/material";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import alLogo from "../../assets/logos/al-small-logo.svg";
import { LuCopy, LuCopyCheck } from "react-icons/lu";
import { FaRegThumbsUp, FaRegThumbsDown } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp, IoIosArrowBack, IoIosArrowForward, IoIosCheckmarkCircleOutline } from "react-icons/io";
import { FaFilePdf } from "react-icons/fa";
import ImageViewer from "../ImageViewer.jsx";
import { useSelector } from "react-redux";
import chatService from "../../services/chat.service.js";
import useChat from "../../hooks/useChat.jsx";
import { useDispatch } from "react-redux";
import { setIsFirstLoading,setSessionID } from "../../redux/actions.js";
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';

const ChatManager = ({selectedTab, segment, reconstructedQuestion}) => {


  const messages = useSelector((state) => state.chat.chat);
  const messagesEndRef = useRef(null);
  const [activeTypingIndex, setActiveTypingIndex] = useState(null);
  const processedMessages = useRef(new Set()).current;
  const [imageDisplayIndex, setImageDisplayIndex] = useState([]);
  // const [feedbacks, setFeedbacks] = useState({});
  // const [copyStatus, setCopyStatus] = useState({});
  const [keywordTypeSelect, setKeywordTypeSelect] = useState({});
  const [tabPages, setTabPages] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState(null);
  const [selectedMessageIndex, setSelectedMessageIndex] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [carouselStartIndices, setCarouselStartIndices] = useState({});
    const [descriptionTyped, setDescriptionTyped] = useState({});

  const imagesPerPage = 4;
  const sessionID = useSelector((state) => state.chat.session_id);
  const [voices, setVoices] = useState([]);
  const [currentSpeakingIndex, setCurrentSpeakingIndex] = useState(null);
  const [ttsState, setTtsState] = useState('idle');
  const speechSynth = useRef(null);
  const currentUtterance = useRef(null);
  const isSSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  console.log("messages:", messages);
    const dispatch = useDispatch();
    const { addMessage, addMessageToChat } = useChat();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynth.current = window.speechSynthesis;
    }
    return () => {
      if (speechSynth.current) {
        speechSynth.current.cancel();
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const isPDF = (url) => url?.toLowerCase()?.endsWith('.pdf');

  const handleItemClick = (messageIndex, itemIndex) => {
    if (messages[messageIndex]?.images?.[itemIndex]) {
      const item = messages[messageIndex].images[itemIndex];
      const itemLink = item.imageLink;
      setSelectedItem(itemLink);
      setSelectedItemType(isPDF(itemLink) ? 'pdf' : 'image');
      setSelectedMessageIndex(messageIndex);
      setSelectedItemIndex(itemIndex);
    }
  };

  const handleLightboxClose = () => {
    setSelectedItem(null);
    setSelectedItemType(null);
    setSelectedMessageIndex(null);
    setSelectedItemIndex(null);
  };

  const handlePrevItem = () => {
    if (selectedMessageIndex !== null && messages[selectedMessageIndex]?.images) {
      const totalItems = messages[selectedMessageIndex].images.length;
      const newIndex = (selectedItemIndex - 1 + totalItems) % totalItems;
      setSelectedItemIndex(newIndex);
      const newItem = messages[selectedMessageIndex].images[newIndex].imageLink;
      setSelectedItem(newItem);
      setSelectedItemType(isPDF(newItem) ? 'pdf' : 'image');
    }
  };

  const handleNextItem = () => {
    if (selectedMessageIndex !== null && messages[selectedMessageIndex]?.images) {
      const totalItems = messages[selectedMessageIndex].images.length;
      const newIndex = (selectedItemIndex + 1) % totalItems;
      setSelectedItemIndex(newIndex);
      const newItem = messages[selectedMessageIndex].images[newIndex].imageLink;
      setSelectedItem(newItem);
      setSelectedItemType(isPDF(newItem) ? 'pdf' : 'image');
    }
  };

  useEffect(() => {
    if (messages.length > 0 && activeTypingIndex === null) {
      let nextIndex = -1;
      messages.forEach((msg, idx) => {
        if (msg.text && msg.text !== "No keywords found" || msg.text === "Something Went Wrong" && !processedMessages.has(idx)) {
          processedMessages.add(idx);
        }
      });
      nextIndex = messages.findIndex(
        (msg, idx) => (msg.text === "No keywords found" || msg.text === "Something Went Wrong") &&
        !processedMessages.has(idx)
      );
      if (nextIndex !== -1) {
        setActiveTypingIndex(nextIndex);
      } else {
        setActiveTypingIndex(null);
      }
    }
  }, [messages, activeTypingIndex, processedMessages]);

  const handleTypingComplete = (messageId) => {
    if (activeTypingIndex !== null) {
      processedMessages.add(activeTypingIndex);
      const nextIndex = messages.findIndex(
        (msg, idx) => msg.text === "No keywords found" || msg.text === "Something Went Wrong" &&
        !processedMessages.has(idx) && idx > activeTypingIndex
      );
      if (nextIndex !== -1) {
        setActiveTypingIndex(nextIndex);
      } else {
        setActiveTypingIndex(null);
      }
    }
  };

  // const handleThumbUp = (index) => {
  //   setFeedbacks({
  //     ...feedbacks,
  //     [index]: "liked",
  //   });
  // };

  // const handleThumbDown = (index) => {
  //   setFeedbacks({
  //     ...feedbacks,
  //     [index]: "disliked",
  //   });
  // };

  // const handleCopy = (index, text) => {
  //   navigator.clipboard.writeText(text)
  //     .then(() => {
  //       setCopyStatus({ ...copyStatus, [index]: true });
  //       setTimeout(() => {
  //         setCopyStatus((prev) => ({ ...prev, [index]: false }));
  //       }, 3000);
  //     })
  //     .catch(console.error);
  // };

  const handleTabSelect = async(messageIndex, tabText) => {
    setKeywordTypeSelect(prev => ({
      ...prev,
      [messageIndex]: tabText
    }));
  };

  const handleNextCarouselPage = (messageIndex) => {
    setCarouselStartIndices((prev) => ({
      ...prev,
      [messageIndex]: Math.min(
        (prev[messageIndex] || 0) + imagesPerPage,
        messages[messageIndex].images.length - imagesPerPage
      )
    }));
  };

  const handlePrevCarouselPage = (messageIndex) => {
    setCarouselStartIndices((prev) => ({
      ...prev,
      [messageIndex]: Math.max((prev[messageIndex] || 0) - imagesPerPage, 0)
    }));
  };

  useEffect(() => {
    messages.forEach((message, index) => {
      if (message.images?.length > 0 && carouselStartIndices[index] === undefined) {
        setCarouselStartIndices((prev) => ({ ...prev, [index]: 0 }));
      }
    });
  }, [messages, carouselStartIndices]);

  const handleTTS = (messageId, action, utterances) => {
    if (!speechSynth.current) return;

    if (action === 'play') {
      // Guard: utterances must be a non-empty array
      if (!Array.isArray(utterances) || utterances.length === 0) return;
      // If another instance is speaking, stop it first
      if (currentSpeakingIndex !== null) {
        speechSynth.current.cancel();
      }

      setCurrentSpeakingIndex(messageId);
      setTtsState('playing');

      // Sequentially play each utterance
      utterances.forEach((utterance, index) => {
        if (index > 0) {
          utterances[index-1].addEventListener('end', () => {
            speechSynth.current.speak(utterance);
          });
        }
      });

      // Start the first utterance
      speechSynth.current.speak(utterances[0]);

      // Set state to idle after the last utterance
      utterances[utterances.length-1].addEventListener('end', () => {
        setTtsState('idle');
        setCurrentSpeakingIndex(null);
      });
    } else if (action === 'stop') {
      speechSynth.current.cancel();
      setTtsState('idle');
      setCurrentSpeakingIndex(null);
    }
  };

 const renderMessageContent = (message, index) => {
    const handleQuestionChange = async (q) => {
      if (!selectedTab) return;
      if (q.trim() === '') return;
      dispatch(setIsFirstLoading(false));
      // Use reconstructedQuestion if present
      const inputPrompt = reconstructedQuestion || q.trim();
      const tempMessages = [...messages];

      // show loading placeholder
      addMessage([...messages, { input_prompt: q.trim(), text: undefined, images: [], description: undefined }]);

      try {
        const payload = {
          question: inputPrompt,
          'sub-segment': selectedTab,
          session_id: sessionID || ''
        };

        let response;
        if (segment === 'service_manual') {
          response = await chatService.sendMessageServiceManual(payload);
        } else if (segment === 'operator_handbook') {
          response = await chatService.sendMessageOperatorHandbook(payload);
        }

        const newStructured = {
          input_prompt: q.trim(),
          text: response?.[segment]?.Type?.join('\n') || 'No keywords found',
          session_id: response?.session_id,
          created_on: new Date().toISOString(),
          images: [],
          description: response?.response
        };

        if (response?.session_id) {
          dispatch(setSessionID(response.session_id));
        }

        addMessage([...tempMessages, newStructured]);
        addMessageToChat(newStructured);
      } catch (error) {
        console.error(error);
        const errorMessage = {
          input_prompt: q.trim(),
          text: 'Something Went Wrong',
          images: [],
          description: undefined
        };
        addMessage([...tempMessages, errorMessage]);
      }
    };

    if (message.text === undefined) {
      return (
        <Typography variant="body1" sx={{ mt: 1 }}>
          Loading...
        </Typography>
      );
    }

    const lines = message.text?.split('\n') || [];
    const totalPages = Math.ceil(lines.length / 10);
    const currentPage = tabPages[index] || 0;

    // First check if description exists and is not null
    const hasDescription = message.description != "null";

    // Show description if it exists and either message.text is non-empty or it's a special case
    const shouldShowDescription = hasDescription && (
      message.text !== 'No keywords found' && 
      message.text !== 'Something Went Wrong' && 
      message.text?.trim() !== ''
    );

    // When no keywords found or error, show combined typing
    if (message.text === 'No keywords found' || message.text === 'Something Went Wrong') {
      return (
        <>
          {hasDescription && (
            <Box sx={{ mb: 3 }}>
              <TypingEffect
                text={message.description}
                speed={0.001}
                isActive={true}
                onComplete={() =>
                  setDescriptionTyped(prev => ({ ...prev, [index]: true }))
                }
                sx={{
                  fontSize: '1.1rem',
                  lineHeight: 1.4,
                  color: 'text.primary',
                  py: 1.5,
                  fontWeight: 500,
                }}
              />
            </Box>
          )}
          <CombinedTypingEffect
            question={messages[index].input_prompt}
            selectedTab={selectedTab}
            keyword={''}
            session_id={sessionID}
            messageId={index}
            onComplete={handleTypingComplete}
            onSuggestionClick={handleQuestionChange}
            segment={segment}
            onTextUpdate={scrollToBottom}
            currentSpeakingIndex={currentSpeakingIndex}
            ttsState={ttsState}
            onTTS={handleTTS}
            reconstructedQuestion={reconstructedQuestion}
          />
        </>
      );
    }

    return (
    <Box>
  {/* 1. Enhanced Description */}
  {shouldShowDescription && (
    <Box sx={{ mb: 3, px: 1 }}>
      <TypingEffect
        text={message.description}
        speed={0.001}
        isActive={true}
        onComplete={() =>
          setDescriptionTyped(prev => ({ ...prev, [index]: true }))
        }
        sx={{
          fontSize: '1.1rem',
          lineHeight: 1.4,
          color: 'text.primary',
          py: 1.5,
          fontWeight: 500,
        }}
      />
      {descriptionTyped[index] && (
        <Box sx={{ mt: 1 }}>
          <TypingEffect
            text="Please select your variant"
            speed={0.003}
            isActive={true}
            sx={{
              fontSize: '1rem',
              lineHeight: 1.4,
              fontStyle: 'italic',
              color: 'primary.gray',
              py: 1,
            }}
          />
        </Box>
      )}
    </Box>
  )}

  {/* 2. Improved Tabs Grid (left-aligned) */}
  {(!message.description || descriptionTyped[index]) && (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
        py: 1,
        width: '100%',
        justifyContent: 'flex-start',
      }}
    >
      {/* Keyword suggestion buttons */}
      {lines.map((line, i) => (
        <Button
          key={i}
          variant="outlined"
          onClick={() => handleTabSelect(index, line)}
          sx={{
            textTransform: 'none',
            borderRadius: '10px',
            border: '2px solid',
            borderColor:
              keywordTypeSelect[index] === line ? 'primary.main' : 'divider',
            color:
              keywordTypeSelect[index] === line ? 'primary.main' : 'text.secondary',
            backgroundColor:
              keywordTypeSelect[index] === line ? '#0089cf' : 'background.paper',
            minWidth: 'auto',
            padding: '6px 16px',
            transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              borderColor: 'primary.main',
              backgroundColor: '#0089cf',
              boxShadow: 2,
            },
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontWeight: 500,
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'start',
              gap: 0.5,
            }}
          >
            {keywordTypeSelect[index] === line && (
              <IoIosCheckmarkCircleOutline fontSize="1.2rem" />
            )}
            {line}
          </Typography>
        </Button>
      ))}

      {/* "None of these" button */}
      {lines.length > 0 && (
        <Button
          variant="outlined"
          onClick={() => handleTabSelect(index, '')}
          sx={{
            textTransform: 'none',
            borderRadius: '10px',
            border: '2px dashed',
            borderColor:
              keywordTypeSelect[index] === '' ? 'primary.main' : 'divider',
            color:
              keywordTypeSelect[index] === '' ? 'primary.main' : 'text.secondary',
            backgroundColor:
              keywordTypeSelect[index] === '' ? '#0089cf' : 'background.paper',
            minWidth: 'auto',
            padding: '6px 16px',
            transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              borderColor: 'primary.main',
              backgroundColor: '#0089cf',
              boxShadow: 2,
            },
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontWeight: 500,
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'start',
              gap: 0.5,
            }}
          >
            {keywordTypeSelect[index] === '' && (
              <IoIosCheckmarkCircleOutline fontSize="1.2rem" />
            )}
            None of these
          </Typography>
        </Button>
      )}
    </Box>
  )}

  {/* 3. Combined Typing Effect */}
  {keywordTypeSelect[index] !== undefined && (
    <Box
      sx={{
        mt: 3,
        p: 2,
        borderRadius: 1,
        bgcolor: 'background.default',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      }}
    >
      <CombinedTypingEffect
        question={messages[index].input_prompt}
        selectedTab={selectedTab}
        keyword={keywordTypeSelect[index]}
        session_id={sessionID}
        messageId={index}
        onComplete={handleTypingComplete}
        onSuggestionClick={handleQuestionChange}
        segment={segment}
        onTextUpdate={scrollToBottom}
        currentSpeakingIndex={currentSpeakingIndex}
        ttsState={ttsState}
        onTTS={handleTTS}
        reconstructedQuestion={reconstructedQuestion}
      />
    </Box>
  )}
</Box>

    );
  };
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
        <Box key={`message-box-${index}`} style={{ maxWidth:'100%', }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "16px",
            }}
          >
            <Paper
              elevation={1}
              sx={{
                px: 2,
                py: 1,
                maxWidth: "90%",
                borderRadius: "18px",
                backgroundColor: "background.user_prompt",
                color: "text.user_prompt",
              }}
              
            >
              {/* Render image preview for pending or sent messages FIRST */}
              {message.images && message.images.length > 0 && (
                <Box sx={{ mt: 1, mb: 1 }} >
                  {message.images.map((img, i) => (
                    <img
                      key={i}
                      src={img.imageLink}
                      alt={img.title || `Image ${i+1}`}
                      style={{
                        maxWidth: 200,
                        maxHeight: 200,
                        borderRadius: 8,
                        marginRight: 8,
                        marginBottom: 4,
                        border: '1px solid #eee',
                        objectFit: 'cover',
                      }}
                    />
                  ))}
                </Box>
              )}
              {/* Then render the question text */}
              <Typography variant="body1">{message.input_prompt}</Typography>
              {/* Show spinner for pending messages */}
              {message.pending && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={18} />
                  <Typography variant="caption" color="text.secondary">Sending...</Typography>
                </Box>
              )}
            </Paper>
          </motion.div>

          <Box sx={{ display: "flex", alignItems: "top" }}>
            {message.text === undefined ? (
              <Box className="loader-container" sx={{ mt: 1.4 }}>
                <Box className="loader" />
                <img src={alLogo} alt="Logo" className="loader-logo" />
              </Box>
            ) : (
              <Box sx={{ mt: 1.5 }}>
                <img src={alLogo} alt="Logo" style={{ width: "24px" }} />
              </Box>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                marginBottom: "16px",
                width: "90%",
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  px: 2,
                  py: 1,
                  maxWidth: "100%",
                  borderRadius: "18px",
                  backgroundColor: "background.ai_prompt",
                  backgroundImage: "none",
                  color: "text.primary",
                  boxShadow: "none",
                }}
              >
                {renderMessageContent(message, index)}
              </Paper>

              {/* {message.text !== undefined && processedMessages.has(index) && (
                <Box sx={{ mt: 0.5, ml: 1 }}>
                  // Show backend images as a simple grid (no show/hide, no carousel)
                  {message.images && message.images.length > 0 && message.text !== undefined && (
                    <Box sx={{ width: "100%", mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      {message.images.map((item, itemIndex) => {
                        const isItemPdf = isPDF(item.imageLink);
                        return (
                          <Box
                            key={itemIndex}
                            sx={{
                              display: "flex",
                              flexDirection: 'column',
                              alignItems: "center",
                              justifyContent: "center",
                              height: "180px",
                              width: '180px',
                              border: "1px solid rgba(255, 255, 255, 0.2)",
                              borderRadius: "8px",
                              overflow: "hidden",
                              backgroundColor: "rgba(0, 0, 0, 0.05)",
                              position: "relative",
                              cursor: "pointer",
                            }}
                            onClick={() => handleItemClick(index, itemIndex)}
                          >
                            {isItemPdf ? (
                              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2, width: '100%', height: '100%' }}>
                                <FaFilePdf size={50} color="#e53935" />
                                <Typography variant="caption" sx={{ mt: 1, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                  {item.title || 'PDF Document'}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                                  Click to view
                                </Typography>
                              </Box>
                            ) : (
                              <img
                                src={item.imageLink}
                                alt={item.title || `File ${itemIndex + 1}`}
                                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                              />
                            )}
                            {item.title && !isItemPdf && (
                              <Typography
                                variant="caption"
                                sx={{
                                  position: "absolute",
                                  bottom: 0,
                                  left: 0,
                                  right: 0,
                                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                                  color: "white",
                                  padding: "4px",
                                  textAlign: "center",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {item.title}
                              </Typography>
                            )}
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </Box>
              )} */}
            </motion.div>
          </Box>
        </Box>
      ))}
      <div ref={messagesEndRef} />
    </motion.div>
  );
};

export default ChatManager;