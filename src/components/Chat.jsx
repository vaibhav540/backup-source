// import React, { useState, useRef, useEffect } from "react";
// import {
//   Box,
//   TextField,
//   IconButton,
//   Container,
//   Typography,
//   CircularProgress,
//   Button,
//   Modal
// } from "@mui/material";
// import SendIcon from "@mui/icons-material/Send";
// import MicIcon from "@mui/icons-material/Mic";
// import { motion, AnimatePresence } from "framer-motion";
// import { useDispatch, useSelector } from "react-redux";
// import chatService from "../services/chat.service";
// import { useTheme } from "../context/ThemeContext";
// import useChat from "../hooks/useChat";
// import { setIsFirstLoading, setSegment, setSessionID } from "../redux/actions";
// import ChatManager from "./shared/ChatManager";
// import { useLocation } from "react-router-dom";

// const ChatInterface = () => {
//   const isSidebarOpen = useSelector((state) => state.account.isSidebarOpen);
//   const accountDetails = useSelector((state) => state.account.accountDetails);
//   const sessionID = useSelector((state) => state.chat.session_id);
//   const messages = useSelector((state) => state.chat.chat);
//   const isFirstLoad = useSelector((state) => state.account.isFirstLoading);
//   const { isDarkMode } = useTheme();
//   const dispatch = useDispatch();
//   const { addMessage, addMessageToChat, startNewChat } = useChat();
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [selectedTab, setSelectedTab] = useState(null);
//   const [showVariantModal, setShowVariantModal] = useState(true);
//   const [isListening, setIsListening] = useState(false);
//   const messagesEndRef = useRef(null);
//   const inputRef = useRef(null);
//   const recognitionRef = useRef(null);
// const location = useLocation();
//   const segment = useSelector((state) => state.chat.segment);
//   const previousTabRef = useRef();

//   useEffect(() => {
//     let newSegment = "";
//     if (location.pathname === "/main/service-manual") {
//       newSegment = "service_manual";
//     } else if (location.pathname === "/main/operator-handbook") {
//       newSegment = "operator_handbook";
//     }
//     if (newSegment !== segment) {
//       dispatch(setSegment(newSegment)); // ✅ Now using the correctly imported action
//     }
//   }, [location.pathname, segment, dispatch]);

//   console.log("segment is here", segment);

//   // Initialize speech recognition
//   useEffect(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       console.warn("Speech recognition not supported in this browser");
//       return;
//     }

//     recognitionRef.current = new SpeechRecognition();
//     recognitionRef.current.continuous = false;
//     recognitionRef.current.interimResults = true;
//     recognitionRef.current.lang = 'en-IN';

//     recognitionRef.current.onresult = (event) => {
//       const transcript = Array.from(event.results)
//         .map(result => result[0])
//         .map(result => result.transcript)
//         .join('');
//       setInput(transcript);
//     };

//     recognitionRef.current.onerror = (event) => {
//       console.error("Speech recognition error", event.error);
//       setIsListening(false);
//     };

//     recognitionRef.current.onend = () => {
//       if (isListening) {
//         recognitionRef.current.start();
//       }
//     };

//     return () => {
//       if (recognitionRef.current) {
//         recognitionRef.current.stop();
//       }
//     };
//   }, [isListening]);

//   const toggleSpeechRecognition = () => {
//     if (isListening) {
//       recognitionRef.current.stop();
//       setIsListening(false);
//     } else {
//       try {
//         recognitionRef.current.start();
//         setIsListening(true);
//       } catch (error) {
//         console.error("Error starting speech recognition:", error);
//       }
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   useEffect(() => {
//     if (selectedTab) {
//       inputRef.current?.focus();
//     }
//   }, [selectedTab]);

//   const handleVariantSelect = (variant) => {
//     setSelectedTab(variant);
//     setShowVariantModal(false);
//   };

//   const handleSend = async () => {
//   if (!selectedTab) return;
//   setLoading(true);
//   if (input.trim() === "") return;
//   dispatch(setIsFirstLoading(false));
//   const inputPrompt = input.trim();
//   const tempMessages = [...messages];
  
//   const structuredMessage = {
//     input_prompt: inputPrompt,
//     text: undefined,
//     images: [],
//     description: undefined,
//   };
  
//   addMessage([...messages, structuredMessage]);

//   try {
//     const payload = {
//       question: inputPrompt,
//       "sub-segment": selectedTab,
//       session_id: sessionID || ""
//     };

//     // Modified service call based on segment
//     let response;
//     if (segment === 'service_manual') {
//       response = await chatService.sendMessageServiceManual(payload);
//     } else if (segment === 'operator_handbook') {
//       response = await chatService.sendMessageOperatorHandbook(payload);
//     }
    

//     console.log("response:", response);
//     const structuredMessage = {
//       input_prompt: inputPrompt,
//       text: response?.[segment]?.Type?.join('\n') || 'No keywords found',
//       description: response?.response,
//       session_id: response?.session_id,
//       created_on: new Date().toISOString(),
//       images: [],
//     };

//     if (response?.session_id) {
//       dispatch(setSessionID(response.session_id));
//     }
    
//     addMessage([...tempMessages, structuredMessage]);
//     addMessageToChat(structuredMessage);
//     setLoading(false);
//     setInput("");
//   } catch (error) {
//     console.log(error);
//     setLoading(false);
//     const structuredMessage = {
//       input_prompt: inputPrompt,
//       text: "Something Went Wrong",
//       images: [],
//     };
//     const newMessages = [...tempMessages, structuredMessage];
//     addMessage(newMessages);
//   }
// };
//   const handleInputChange = (e) => {
//     setInput(e.target.value);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey && selectedTab) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   useEffect(() => {
//     if (selectedTab && previousTabRef.current !== selectedTab) {
//       startNewChat();
//       previousTabRef.current = selectedTab;
//     }
//   }, [selectedTab, startNewChat]);

//   return (
//     <Container
//       maxWidth={false}
//       sx={{
//         width: "90%",
//         height: isFirstLoad ? "70vh" : "auto",
//         display: "flex",
//         overflow: "visible",
//         flexDirection: "column",
//         position: "relative",
//         mx: "auto",
//         px: 4,
//       }}
//     >
//       {/* Variant Selection Modal */}
//       <Modal
//         open={showVariantModal}
//         onClose={() => {}}
//         aria-labelledby="variant-selection-modal"
//         sx={{
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}
//       >
//         <Box
//           sx={{
//             backgroundColor: 'background.paper',
//             borderRadius: '16px',
//             p: 4,
//             minWidth: 400,
//             textAlign: 'center',
//             outline: 'none'
//           }}
//         >
//           <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
//             Please select your variant
//           </Typography>
//           <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
//             <Button
//               variant="contained"
//               onClick={() => handleVariantSelect('LCV')}
//               sx={{
//                 minWidth: 120,
//                 textTransform: 'none',
//                 fontWeight: 'bold',
//                 fontSize: '1.1rem'
//               }}
//             >
//               LCV
//             </Button>
//             <Button
//               variant="contained"
//               onClick={() => handleVariantSelect('MHCV')}
//               sx={{
//                 minWidth: 120,
//                 textTransform: 'none',
//                 fontWeight: 'bold',
//                 fontSize: '1.1rem'
//               }}
//             >
//               MHCV
//             </Button>
//           </Box>
//         </Box>
//       </Modal>

//       {/* Selected Variant Indicator */}
//       {selectedTab && (
//         // <Box sx={{ 
//         //   position: 'absolute', 
//         //   // left: 0,
//         //   top: 0,
//         //   position: 'sticky',
//         //   zIndex: 1000,
//         //   display: 'flex',
//         //   gap: 1
//         // }}>
//         //   <Button 
//         //     variant={selectedTab === 'LCV' ? 'contained' : 'outlined'}
//         //     onClick={() => setSelectedTab('LCV')}
//         //     sx={{
//         //       minWidth: 100,
//         //       textTransform: 'none',
//         //       fontWeight: 'bold',
//         //       borderRadius: '8px',
//         //       backgroundColor: selectedTab === 'LCV' ? (isDarkMode ? 'red' : 'blue') : 'inherit',
//         //       color: selectedTab === 'LCV' ? 'red' : 'inherit'
//         //     }}
//         //   >
//         //     LCV
//         //   </Button>
//         //   <Button
//         //     variant={selectedTab === 'MHCV' ? 'contained' : 'outlined'}
//         //     onClick={() => setSelectedTab('MHCV')}
//         //     sx={{
//         //       minWidth: 100,
//         //       textTransform: 'none',
//         //       fontWeight: 'bold',
//         //       borderRadius: '8px',
//         //       backgroundColor: selectedTab === 'MHCV' ? (isDarkMode ? '#3f51b5' : '#1976d2') : 'inherit',
//         //       color: selectedTab === 'MHCV' ? 'white' : 'inherit'
//         //     }}
//         //   >
//         //     MHCV
//         //   </Button>
//         // </Box>

//         <Box
//   sx={{
//     position: 'sticky',
//     top: 0,
//     zIndex: 1000,
//     display: 'flex',
//     gap: 1,
//   }}
// >
//   {['LCV', 'MHCV'].map((tab) => {
//     const selected = selectedTab === tab;
//     const bg = selected
//       ? isDarkMode
//         ? '#ffffff' // active on dark → white
//         : '#000000' // active on light → black
//       : isDarkMode
//       ? '#000000'   // idle on dark → black
//       : '#ffffff';  // idle on light → white
//     const fg = selected
//       ? isDarkMode
//         ? '#000000' // active on dark → black text
//         : '#ffffff' // active on light → white text
//       : isDarkMode
//       ? '#ffffff'   // idle on dark → white text
//       : '#000000';  // idle on light → black text

//     return (
//       <Button
//         key={tab}
//         onClick={() => setSelectedTab(tab)}
//         variant="outlined"
//         sx={{
//           minWidth: 100,
//           textTransform: 'none',
//           fontWeight: 'bold',
//           borderRadius: '8px',
//           backgroundColor: bg,
//           color: fg,
//           borderColor: fg,        // keep border in the same text color
//           '&:hover': {
//             backgroundColor: selected
//               ? bg                // keep same if already selected
//               : isDarkMode
//               ? '#333333'         // a dark hover when idle in dark
//               : '#eeeeee',        // a light hover when idle in light
//           },
//         }}
//       >
//         {tab}
//       </Button>
//     );
//   })}
// </Box>

//       )}

//       <AnimatePresence>
//         {!isFirstLoad && <ChatManager messages={messages} selectedTab={selectedTab} segment={segment}/>}
//       </AnimatePresence>

//       <Box
//         component={motion.div}
//         layout
//         sx={{
//           width: "100%",
//           display: "flex",
//           alignItems: "center",
//           padding: "12px 6px",
//           pb: 3,
//           backgroundColor: "background.default",
//           ...(isFirstLoad
//             ? {
//                 position: "absolute",
//                 top: "30%",
//                 left: 0,
//                 boxShadow: "none",
//                 background: "background.default",
//               }
//             : {
//                 position: "fixed",
//                 bottom: 0,
//                 right: 0,
//                 zIndex: 10,
//                 width: "100%",
//                 background: "background.default",
//               }),
//         }}
//       >
//         <Box
//           sx={{
//             width: "100%",
//             pl: isSidebarOpen && !isFirstLoad ? "280px" : 0,
//             margin: "0 50px",
//             position: "relative",
//           }}
//         >
//           {isFirstLoad && (
//             <Box
//               sx={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 textAlign: "center",
//                 paddingBottom: "30px",
//                 mb: 3,
//               }}
//             >
//               <Typography
//                 variant="h4"
//                 gutterBottom
//                 fontWeight="bold"
//                 className="gradient-text "
//                 color="primary"
//                 sx={{ display: "flex", alignItems: "center", gap: 2 }}
//               >
//                 <Typography
//                   variant="h4"
//                   className="gradient-text"
//                   sx={{ m: 0, p: 0, color: "text.main_title", fontWeight: 700 }}
//                 >
//                   Hello,
//                 </Typography>
//                 {accountDetails.name}
//               </Typography>
//             </Box>
//           )}

//           <TextField
//             fullWidth
//             maxRows={3}
//             multiline
//             variant="outlined"
//             placeholder="Start a conversation..."
//             value={input}
//             disabled={loading || !selectedTab}
//             onChange={handleInputChange}
//             onKeyPress={handleKeyPress}
//             inputRef={inputRef}
//             sx={{
//               "& .MuiOutlinedInput-root": {
//                 borderRadius: "24px",
//                 backgroundColor: "background.paper",
//                 p: 2,
//                 pr: "120px", // Increased to accommodate both buttons
//                 height: "auto",
//                 boxShadow: "0 6px 10px rgba(0, 0, 0, 0.2)",
//               },
//               width: "100%",
//             }}
//           />
          
//           {/* Microphone Button */}
//           <motion.div
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             style={{
//               position: "absolute",
//               right: "48px", // Positioned to the left of the send button
//               bottom: 8,
//             }}
//           >
//             <IconButton
//               onClick={toggleSpeechRecognition}
//               color={isListening ? "error" : "default"}
//               disabled={!selectedTab}
//               sx={{
//                 p: "10px",
//                 backgroundColor: isListening ? 'rgba(255, 0, 0, 0.1)' : 'transparent',
//               }}
//             >
//               <MicIcon />
//             </IconButton>
//           </motion.div>
          
//           {/* Send Button */}
//           <motion.div
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             style={{
//               position: "absolute",
//               right: "8px",
//               bottom: 8,
//             }}
//           >
//             {loading ? (
//               <CircularProgress
//                 size="28px"
//                 thickness={8}
//                 color="inherit"
//                 sx={{
//                   p: "5px",
//                 }}
//               />
//             ) : (
//               <IconButton
//                 onClick={handleSend}
//                 color="primary"
//                 disabled={input.trim() === "" || loading || !selectedTab}
//                 sx={{
//                   p: "10px",
//                 }}
//               >
//                 <SendIcon />
//               </IconButton>
//             )}
//           </motion.div>
//         </Box>
//       </Box>
//     </Container>
//   );
// };

// export default ChatInterface;




import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  IconButton,
  Container,
  Typography,
  CircularProgress,
  Button,
  Modal
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import chatService from "../services/chat.service";
import { useTheme } from "../context/ThemeContext";
import useChat from "../hooks/useChat";
import { setIsFirstLoading, setSegment, setSessionID, setUploadedImage, clearUploadedImage } from "../redux/actions";
import ChatManager from "./shared/ChatManager";
import { useLocation } from "react-router-dom";
import axios from "axios";

const ChatInterface = () => {
  const isSidebarOpen = useSelector((state) => state.account.isSidebarOpen);
  const accountDetails = useSelector((state) => state.account.accountDetails);
  const sessionID = useSelector((state) => state.chat.session_id);
  const messages = useSelector((state) => state.chat.chat);
  const isFirstLoad = useSelector((state) => state.account.isFirstLoading);
  const uploadedImage = useSelector((state) => state.chat.uploadedImage);
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const { addMessage, addMessageToChat, startNewChat } = useChat();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(null);
  const [showVariantModal, setShowVariantModal] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const location = useLocation();
  const segment = useSelector((state) => state.chat.segment);
  const previousTabRef = useRef();

  // Speech recording state
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptLoading, setTranscriptLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Image upload state
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Add this state to track if a pending image message is in chat
  const [pendingImageMessageId, setPendingImageMessageId] = useState(null);

  useEffect(() => {
    let newSegment = "";
    if (location.pathname === "/main/service-manual") {
      newSegment = "service_manual";
    } else if (location.pathname === "/main/operator-handbook") {
      newSegment = "operator_handbook";
    }
    if (newSegment !== segment) {
      dispatch(setSegment(newSegment));
    }
  }, [location.pathname, segment, dispatch]);

  useEffect(() => {
    setInput("");
    dispatch(clearUploadedImage());
  }, [sessionID, dispatch]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudio(audioBlob);
        audioChunksRef.current = [];
        const tracks = mediaRecorderRef.current.stream.getTracks();
        tracks.forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob) => {
    setTranscriptLoading(true);
    const reader = new FileReader();
    
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      const base64data = reader.result.split(',')[1];
      
      try {
        const config = {
          method: 'post',
          url: accountDetails?.environment === "production" ? "https://al-prod-genai-api-82ww2seo.uc.gateway.dev/phase2/stt" : 'https://al-genai-api-v1-gateway-a8d67j5q.uc.gateway.dev/user/question',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': accountDetails?.environment === "production" ? "AIzaSyARNFW5hKMLSJG5TAlhXTRZ6Fb2OtJkLWg" : 'AIzaSyC9s3SJxJNLgWdRotkB52UTHzEsfuU3mWo',
          },
          data: { audio_base_64: base64data }
        };

        const response = await axios(config);
        if (response.data?.transcribed_question) {
          setInput(response.data.transcribed_question);
        }
      } catch (error) {
        console.error("Speech to text error:", error);
      } finally {
        setTranscriptLoading(false);
      }
    };
  };

  const handleMicrophoneClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Image upload functions
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(',')[1]; // Remove data:image/...;base64, prefix
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Remove any pending messages before adding a new one
    addMessage(messages.filter((msg) => !msg.pending));

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size should be less than 10MB');
      return;
    }

    setImageUploadLoading(true);
    try {
      const base64 = await convertFileToBase64(file);
      const preview = URL.createObjectURL(file);
      dispatch(setUploadedImage({
        file: file,
        base64: base64,
        preview: preview
      }));
      // Add a chat message for the image only
      const imageMsgId = Date.now();
      setPendingImageMessageId(imageMsgId);
      addMessage([
        ...messages.filter((msg) => !msg.pending),
        {
          type: 'image',
          images: [{ imageLink: preview, title: file.name }],
          pending: true,
          id: imageMsgId,
        },
      ]);
    } catch (error) {
      console.error('Error converting image to base64:', error);
      alert('Error processing image. Please try again.');
    } finally {
      setImageUploadLoading(false);
    }
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const removeUploadedImage = () => {
    dispatch(clearUploadedImage());
    // Remove any pending image and pending question messages from the chat
    addMessage(messages.filter((msg) => !msg.pending));
    setPendingImageMessageId(null);
    // Reset file input value so the same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Remove pending message utility
  const removePendingImageMessage = () => {
    if (pendingImageMessageId) {
      addMessage(messages.filter((msg) => msg.id !== pendingImageMessageId));
      setPendingImageMessageId(null);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedTab) {
      inputRef.current?.focus();
    }
  }, [selectedTab]);

  const handleVariantSelect = (variant) => {
    setSelectedTab(variant);
    setShowVariantModal(false);
    setInput("");
    dispatch(clearUploadedImage());
  };

  const handleSend = async () => {
    if (!selectedTab) return;
    setLoading(true);
    if (input.trim() === "") return;
    dispatch(setIsFirstLoading(false));

    // Remove pending image message if present
    removePendingImageMessage();

    let finalInputPrompt = input.trim();
    const tempMessages = [...messages].filter((msg) => !msg.pending);

    // If there's an uploaded image, process it first
    if (uploadedImage) {
      try {
        const imagePayload = {
          base64: uploadedImage.base64,
          user_query: input.trim(),
        };
        // Always use development environment for image upload
        const imageResponse = await chatService.uploadImage(imagePayload, "development");
        finalInputPrompt = imageResponse.reconstructed_user_query || input.trim();
        dispatch(clearUploadedImage());
      } catch (error) {
        console.error('Error processing image:', error);
        finalInputPrompt = input.trim();
        dispatch(clearUploadedImage());
      }
    }

    // UI should always show the original question, and show uploaded image preview if present
    const structuredMessage = {
      input_prompt: input.trim(), // Always show the original user-typed question
      text: undefined,
      images: uploadedImage ? [{ imageLink: uploadedImage.preview, title: uploadedImage.file.name }] : [],
      description: undefined,
    };

    addMessage([...tempMessages, structuredMessage]);

    try {
      const payload = {
        question: finalInputPrompt, // Use reconstructed for API, original for UI
        "sub-segment": selectedTab,
        session_id: sessionID || "",
      };
      let response;
      if (segment === 'service_manual') {
        response = await chatService.sendMessageServiceManual(payload, accountDetails?.environment);
      } else if (segment === 'operator_handbook') {
        response = await chatService.sendMessageOperatorHandbook(payload, accountDetails?.environment);
      }
      const structuredMessage = {
        input_prompt: input.trim(), // Always show the original user-typed question
        text: response?.[segment]?.Type?.join('\n') || 'No keywords found',
        description: response?.response,
        session_id: response?.session_id,
        created_on: new Date().toISOString(),
        images: response?.images || (uploadedImage ? [{ imageLink: uploadedImage.preview, title: uploadedImage.file.name }] : []),
      };
      if (response?.session_id) {
        dispatch(setSessionID(response.session_id));
      }
      addMessage([...tempMessages, structuredMessage]);
      addMessageToChat(structuredMessage);
      setLoading(false);
      setInput("");
    } catch (error) {
      setLoading(false);
      const structuredMessage = {
        input_prompt: input.trim(), // Always show the original user-typed question
        text: "Something Went Wrong",
        images: uploadedImage ? [{ imageLink: uploadedImage.preview, title: uploadedImage.file.name }] : [],
      };
      const newMessages = [...tempMessages, structuredMessage];
      addMessage(newMessages);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && selectedTab) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (selectedTab && previousTabRef.current !== selectedTab) {
      startNewChat();
      setInput("");
      dispatch(clearUploadedImage());
      previousTabRef.current = selectedTab;
    }
  }, [selectedTab, startNewChat, dispatch]);

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
      <Modal
        open={showVariantModal}
        onClose={() => {}}
        aria-labelledby="variant-selection-modal"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            backgroundColor: 'background.paper',
            borderRadius: '16px',
            p: 4,
            minWidth: 400,
            textAlign: 'center',
            outline: 'none'
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Please select your variant
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={() => handleVariantSelect('LCV')}
              sx={{
                minWidth: 120,
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '1.1rem'
              }}
            >
              LCV
            </Button>
            <Button
              variant="contained"
              onClick={() => handleVariantSelect('MHCV')}
              sx={{
                minWidth: 120,
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '1.1rem'
              }}
            >
              MHCV
            </Button>
          </Box>
        </Box>
      </Modal>

      {selectedTab && (
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            display: 'flex',
            gap: 1,
          }}
        >
          {['LCV', 'MHCV'].map((tab) => {
            const selected = selectedTab === tab;
            const bg = selected
              ? isDarkMode
                ? '#ffffff'
                : '#000000'
              : isDarkMode
              ? '#000000'
              : '#ffffff';
            const fg = selected
              ? isDarkMode
                ? '#000000'
                : '#ffffff'
              : isDarkMode
              ? '#ffffff'
              : '#000000';

            return (
              <Button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                variant="outlined"
                sx={{
                  minWidth: 100,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  backgroundColor: bg,
                  color: fg,
                  borderColor: fg,
                  '&:hover': {
                    backgroundColor: selected
                      ? bg
                      : isDarkMode
                      ? '#333333'
                      : '#eeeeee',
                  },
                }}
              >
                {tab}
              </Button>
            );
          })}
        </Box>
      )}

      <AnimatePresence>
        {!isFirstLoad && <ChatManager messages={messages} selectedTab={selectedTab} segment={segment}/>}
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
                {/* {accountDetails.name} */} User
              </Typography>
            </Box>
          )}

          {/* Hidden file input for image upload */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />

          {/* Image preview section */}
          {uploadedImage && (
          <Box
  sx={{
    mb: 2,
    p: 2,
    border: `2px solid ${isDarkMode ? '#333' : '#e0e0e0'}`,
    borderRadius: 2,
    backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
    width: 'fit-content',
  }}
>
  <Box sx={{ position: 'relative', display: 'inline-block' }}>
    <img
      src={uploadedImage.preview}
      alt="Uploaded"
      style={{
        height: "150px",
        objectFit: 'cover',
        borderRadius: 8,
        display: 'block',
      }}
    />
    <IconButton
      onClick={removeUploadedImage}
      size="small"
      sx={{
        color: 'error.main',
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'white',
        '&:hover': {
          backgroundColor: '#f0f0f0',
        },
      }}
    >
      ×
    </IconButton>
  </Box>
</Box>

          )}

          <TextField
            fullWidth
            maxRows={3}
            multiline
            variant="outlined"
            placeholder="Start a conversation..."
            value={input}
            disabled={loading || !selectedTab}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            inputRef={inputRef}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "24px",
                backgroundColor: "background.paper",
                p: 2,
                pr: "160px",
                height: "auto",
                boxShadow: "0 6px 10px rgba(0, 0, 0, 0.2)",
              },
              width: "100%",
            }}
          />
          
          {/* Image Upload Button */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              position: "absolute",
              right: "88px",
              bottom: 8,
            }}
          >
            <IconButton
              onClick={handleImageUploadClick}
              color="default"
              disabled={!selectedTab || imageUploadLoading}
              sx={{
                p: "10px",
                backgroundColor: imageUploadLoading ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
              }}
            >
              {imageUploadLoading ? (
                <CircularProgress size={24} />
              ) : (
                <AddPhotoAlternateIcon />
              )}
            </IconButton>
          </motion.div>
          
          {/* Microphone Button */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              position: "absolute",
              right: "48px",
              bottom: 8,
            }}
          >
            <IconButton
              onClick={handleMicrophoneClick}
              color={isRecording ? "error" : "default"}
              disabled={!selectedTab || transcriptLoading}
              sx={{
                p: "10px",
                backgroundColor: isRecording ? 'rgba(255, 0, 0, 0.1)' : 'transparent',
              }}
            >
              {transcriptLoading ? (
                <CircularProgress size={24} />
              ) : (
                <MicIcon />
              )}
            </IconButton>
          </motion.div>
          
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
                disabled={input.trim() === "" || loading || !selectedTab}
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
    </Container>
  );
};

export default ChatInterface;