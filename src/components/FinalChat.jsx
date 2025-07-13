import React, { useState, useEffect, useRef } from "react";
import {
  IconButton,
  Tooltip,
  useTheme,
  Pagination,
  styled,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Box,
  Typography,
  Button,
  TextField,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
} from "@mui/material";
import TypingEffect from "./shared/TypingEffect";
import chatService from "../services/chat.service";
import { LuCopy, LuCopyCheck } from "react-icons/lu";
import { FaRegThumbsUp, FaRegThumbsDown } from "react-icons/fa";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useSelector } from "react-redux";
import { processCitations } from "../utils/encryption";
import TranslateIcon from "@mui/icons-material/Translate";
import languages from '../constant/languages.json';
import MarkdownRenderer from './shared/MarkdownRenderer';

let globalAudioRef = null;

const cleanTextForTTS = (text) => {
  if (!text) return "";
  let cleaned = text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "");
  // Keep essential punctuation for pauses
  cleaned = cleaned.replace(/[~`!#%^*()_\\[\]{};"'\/<>|\\]/g, "");
  cleaned = cleaned.replace(/\d+(\.\d+)?/g, (match) => 
    match.split("").map(ch => ch === "." ? "point" : ch).join(" ")
  );
  return cleaned.replace(/\s\s+/g, " ").trim();
};


const Loader = () => (
  <Box
    sx={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "background.default",
      opacity: 0.8,
      zIndex: 1000,
    }}
  >
    <Box
      sx={{
        border: "4px solid #f3f3f3",
        borderTop: "4px solid #3498db",
        borderRadius: "50%",
        width: 40,
        height: 40,
        animation: "spin 1s linear infinite",
      }}
    />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </Box>
);

const AnimatedCard = styled(Card)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: "8px",
  transition: "all 0.3s ease",
  height: 180,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: theme.shadows[2],
    "& img": {
      transform: "scale(1.03)",
    },
  },
}));

const ResponseSection = styled(Card)(({ theme, type }) => ({
  marginBottom: theme.spacing(3),
  borderLeft: `4px solid ${
    type === "official"
      ? theme.palette.primary.main
      : theme.palette.secondary.main
  }`,
  boxShadow: theme.shadows[1],
  transition: "transform 0.2s",
  "&:hover": {
    transform: "translateY(-2px)",
  },
}));

const CitationGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "repeat(2, 1fr)",
  },
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr",
  },
}));

const QuestionChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  padding: theme.spacing(1),
  borderRadius: "8px",
  transition: "all 0.2s",
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
    transform: "scale(1.02)",
  },
}));

const CitationCard = ({ title, actionLink, imageLink }) => {
  const theme = useTheme();

  return (
    <AnimatedCard>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          p: 1.5,
        }}
      >
        {/* Clickable Title Section with Truncation */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 1,
            minWidth: 0, // Needed for text truncation in flex container
            "&:hover": {
              "& a": {
                color: theme.palette.primary.main,
              },
            },
          }}
        >
          <InsertDriveFileIcon fontSize="small" color="action" />
          <a
            href={actionLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
              flexGrow: 1,
              color: theme.palette.text.primary,
              overflow: "hidden",
            }}
          >
            <Typography
              variant="subtitle2"
              noWrap
              sx={{
                transition: "color 0.2s ease",
                textOverflow: "ellipsis",
                overflow: "hidden",
                maxWidth: "100%",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {title}
            </Typography>
          </a>
        </Box>

        {/* Clickable Image Section */}
        {imageLink && (
          <a
            href={imageLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flexGrow: 1,
              display: "block",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "relative",
                height: "100%",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "40%",
                  background:
                    "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 100%)",
                },
              }}
            >
              <img
                src={imageLink}
                alt={title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  minHeight: 120,
                  transition: "transform 0.3s ease",
                }}
              />
            </Box>
          </a>
        )}
      </Box>
    </AnimatedCard>
  );
};

const renderDescription = (description) => {
  if (!description) return null;
  return (
    <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
      {description}
    </Typography>
  );
};

// Utility to remove trailing backslashes from each line
function removeTrailingBackslashes(text) {
  return text.replace(/\\\s*$/gm, "");
}

export default function CombinedTypingEffect({
  question,
  selectedTab,
  keyword,
  messageId,
  segment,
  onComplete = () => {},
  onSuggestionClick = () => {},
  description,
  onTextUpdate = () => {},
  currentSpeakingIndex,
  ttsState,
  onTTS,
  reconstructedQuestion,
}) {
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const itemsPerPage = 3;
  const [officialResponses, setOfficialResponses] = useState([]);
  const [externalResponses, setExternalResponses] = useState([]);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [citations, setCitations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const sessionID = useSelector((state) => state.chat.session_id);
  const speechSynth = useRef(null);
  const utterances = useRef([]);
  const [completedSections, setCompletedSections] = useState({
    official: false,
    external: false,
    citations: false,
  });
  const [copyStatus, setCopyStatus] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showExternalWithoutBox, setShowExternalWithoutBox] = useState(false);
  const [selectedFeedbackOption, setSelectedFeedbackOption] = useState(null);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [feedbackStatus, setFeedbackStatus] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [voices, setVoices] = useState([]);
  const accountDetails = useSelector((state) => state.account.accountDetails);
  const [submittedFeedback, setSubmittedFeedback] = useState(null);
  const [selectedLang, setSelectedLang] = useState('EN');
  const [langMenuAnchor, setLangMenuAnchor] = useState(null);
  const [translatedResponse, setTranslatedResponse] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isFirstDisplay, setIsFirstDisplay] = useState(true);
  const [currentSourceLanguage, setCurrentSourceLanguage] = useState('English');
  const audioRef = useRef(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [localSpeakingIndex, setLocalSpeakingIndex] = useState(null);

  const selectedLangObj = languages.find(l => l.code === selectedLang) || languages.find(l => l.code === 'EN');

  // List of allowed language codes for TTS
  const allowedTTSLangs = ['EN', 'HI', 'BN', 'GU', 'KN', 'ML', 'MR', 'PA', 'TA', 'TE', 'UR'];
  const isTTSAllowed = allowedTTSLangs.includes(selectedLang);

  const fetchMasterData = async () => {
    setIsLoading(true);
    setIsFirstDisplay(true);
    setCurrentSourceLanguage('English'); // Reset source language for new conversation
    setSelectedLang('EN'); // Reset to English for new conversation
    setTranslatedResponse(null); // Clear any previous translations
    const payload = {
      question: reconstructedQuestion || question,
      sub_segment: selectedTab,
      session_id: sessionID,
      keyword: keyword,
      segment: segment,
    };

    try {
      const { data } = await chatService.getFinalResults(
        JSON.stringify(payload),
        accountDetails?.environment
      );
      const resp = data.responses?.[0] || {};
      const citationsData =
        resp.payload_messages?.[0]?.richContent?.[0]?.[0]?.citations || [];
      console.log("official_docs_response", resp.official_docs_responses);
      console.log("citationsData: ", citationsData);
      
      // Process citations with decryption if in production environment
      const processedCitations = await processCitations(citationsData, accountDetails?.environment);
      
      setOfficialResponses(resp.official_docs_responses || []);
      setExternalResponses(resp.external_sources_responses || []);
      setSuggestedQuestions(resp.suggested_questions || []);
      setCitations(processedCitations);
      setResponseData(resp);

      // Check for intent
      if (resp.intent === "Default Welcome Intent") {
        setShowExternalWithoutBox(true);
      } else {
        setShowExternalWithoutBox(false);
      }
    } catch (error) {
      console.error("Error fetching service manual:", error);
      setOfficialResponses([]);
      setExternalResponses([]);
      setSuggestedQuestions([]);
      setCitations([]);
      setResponseData(null);
    } finally {
      setIsLoading(false);
    }
  };

 useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      speechSynth.current = window.speechSynthesis;
      const updateVoices = () => {
        const availableVoices = speechSynth.current.getVoices();
        setVoices(availableVoices);
      };
      speechSynth.current.onvoiceschanged = updateVoices;
      updateVoices();
    }
  }, []);

  useEffect(() => {
    if (keyword != null) {
      fetchMasterData();
    }
  }, [keyword]);

  const official = officialResponses[0] || "";
  const external = externalResponses[0] || "";

  const handleCopy = () => {
    let textToCopy;
    if (selectedLang !== 'EN' && translatedResponse) {
      textToCopy = [translatedResponse.internal, translatedResponse.external].filter(Boolean).join("\n\n");
    } else {
      textToCopy = [official, external].filter(Boolean).join("\n\n");
    }
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopyStatus(true);
        setTimeout(() => setCopyStatus(false), 3000);
      })
      .catch(console.error);
  };

  // Clean up audio on unmount or lang change
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      setAudioUrl(null);
      setIsAudioPlaying(false);
    };
  }, [selectedLang, messageId]);

  // Pause audio if another message is played
  useEffect(() => {
    if (currentSpeakingIndex !== messageId && audioRef.current) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
    }
  }, [currentSpeakingIndex, messageId]);

  const handleSpeak = async () => {
    // Always use backend TTS API for all languages, including EN
    // Stop any previous audio before starting new one (even from other messages)
    if (globalAudioRef && globalAudioRef !== audioRef.current) {
      globalAudioRef.pause();
      globalAudioRef.currentTime = 0;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsAudioPlaying(false);
    }
    if (isAudioPlaying && localSpeakingIndex === messageId) {
      // If clicking the same message while playing, pause/stop
      if (audioRef.current) {
        audioRef.current.pause();
        setIsAudioPlaying(false);
        setLocalSpeakingIndex(null);
        onTTS(messageId, "stop");
      }
      return;
    }
    // Always fetch and play from the start if not currently playing
    setLocalSpeakingIndex(messageId);
    onTTS(messageId, "play");
    setIsAudioLoading(true);
    setAudioUrl(null); // Clear previous audio
    let speakOfficial, speakExternal;
    // Use translatedResponse only for non-EN languages
    if (selectedLang !== 'EN' && translatedResponse) {
      speakOfficial = translatedResponse.internal || '';
      speakExternal = translatedResponse.external || '';
    } else {
      // For EN (including when selected from dropdown), use original responses only
      speakOfficial = official || description || '';
      speakExternal = external || '';
    }
    // Use cleanTextForTTS for both
    speakOfficial = cleanTextForTTS(speakOfficial);
    speakExternal = cleanTextForTTS(speakExternal);
    // Get lang_code from languages.json
    const langObj = languages.find(l => l.code === selectedLang);
    const lang_code = langObj ? langObj.lang_code : (selectedLang === 'EN' ? 'en-IN' : '');

    // NEW LOGIC for welcome intent
    let ttsPayload = {};
    if (responseData?.intent === 'Default Welcome Intent') {
      ttsPayload = {
        welcome_intent_response: speakExternal || '',
        official_response: '',
        external_response: '',
        lang_code,
      };
    } else {
      ttsPayload = {
        welcome_intent_response: '',
        official_response: speakOfficial || '',
        external_response: speakExternal || '',
        lang_code,
      };
    }

    try {
      const ttsRes = await chatService.getTTS(ttsPayload, accountDetails?.environment);
      if (ttsRes && ttsRes.success && ttsRes.audio_url) {
        setAudioUrl(ttsRes.audio_url);
        // Wait for audio element to update src, then play
        setTimeout(() => {
          if (audioRef.current) {
            // Set global ref to this audio
            globalAudioRef = audioRef.current;
            audioRef.current.currentTime = 0;
            audioRef.current.play();
          }
        }, 100);
      }
    } catch (e) {
      // Optionally show error
    } finally {
      setIsAudioLoading(false);
    }
  };

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handlePlay = () => {
      setIsAudioPlaying(true);
    };
    const handleEnded = () => {
      setIsAudioPlaying(false);
      setLocalSpeakingIndex(null);
      onTTS(messageId, "stop");
      if (globalAudioRef === audio) globalAudioRef = null;
    };
    const handlePause = () => {
      setIsAudioPlaying(false);
      setLocalSpeakingIndex(null);
      onTTS(messageId, "stop");
      if (globalAudioRef === audio) globalAudioRef = null;
    };
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('pause', handlePause);
    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('pause', handlePause);
    };
  }, [audioUrl, messageId, onTTS]);

  const handleFeedback = (type) => {
    if (feedback === type) {
      // If clicking the same feedback type again, clear it
      setFeedback(null);
      setSelectedFeedbackOption(null);
      setFeedbackComment("");
    } else {
      // If clicking a different feedback type, switch to it
      setFeedback(type);
      setSelectedFeedbackOption(null);
      setFeedbackComment("");
    }
  };

  const handleOfficialComplete = () => {
    setCompletedSections((prev) => ({
      ...prev,
      official: true,
      external: !external,
    }));
  };

  const handleExternalComplete = () => {
    setCompletedSections((prev) => ({
      ...prev,
      external: true,
      citations: citations.length > 0,
    }));
    onComplete();
  };

  const showOfficial = official.length > 0;
  const showExternal = external.length > 0;
  const showCitations = citations.length > 0;
  const showSuggestions = suggestedQuestions.length > 0;
  const paginatedCitations = citations.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleSubmitFeedback = async () => {
    try {
      const username = accountDetails?.name || "";

      if (!username) {
        setFeedbackStatus({
          show: true,
          type: "error",
          message: "Please login to submit feedback",
        });
        return;
      }

      const feedbackPayload = {
        username,
        session_id: sessionID,
        question: question,
        official_docs_responses: officialResponses[0] || "",
        external_sources_responses: externalResponses[0] || "",
        response_id: responseData?.response_id || messageId,
        response_messages:
          responseData?.response_messages?.[0] || "Response from AI",
        feedback: feedback,
        selectedFeedbackOption: selectedFeedbackOption,
        comment: feedbackComment,
        document_type:
          segment === "service_manual" ? "Service Manual" : "Operator Handbook",
        vehicle_type: selectedTab,
        suggested_questions: suggestedQuestions,
        citations: citations,
      };

      const response = await chatService.storeUserFeedback(feedbackPayload, accountDetails?.environment);

      if (response?.status === "success") {
        setSubmittedFeedback(feedback);
        setFeedbackStatus({
          show: true,
          type: "success",
          message: "Thank you for your feedback!",
        });

        // Reset feedback state
        setFeedback(null);
        setSelectedFeedbackOption(null);
        setFeedbackComment("");
      } else {
        throw new Error("Feedback submission failed");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setFeedbackStatus({
        show: true,
        type: "error",
        message: "Failed to submit feedback. Please try again.",
      });
    }
  };

  const handleCloseFeedbackStatus = () => {
    setFeedbackStatus((prev) => ({ ...prev, show: false }));
  };

  const handleLanguageChange = async (langCode) => {
    setSelectedLang(langCode);
    setTranslatedResponse(null);
    setIsTranslating(true);
    setIsFirstDisplay(false);
    try {
      // Determine source language based on current selection
      let sourceLanguage;
      if (langCode === 'EN') {
        // If switching back to English, source language is the current non-English language
        sourceLanguage = currentSourceLanguage;
      } else {
        // If switching to a non-English language, source language is English (or current language if already translated)
        sourceLanguage = currentSourceLanguage === 'English' ? 'English' : currentSourceLanguage;
      }

      // Use the original markdown (official/external) for translation
      const payload = {
        internal_docs_response: official, // official is the markdown string
        external_docs_response: external, // external is the markdown string
        source_language: sourceLanguage,
        target_language: languages.find(l => l.code === langCode)?.api_name,
      };
      const res = await chatService.resultTranslation(payload, accountDetails?.environment);
      setTranslatedResponse({
        internal: res?.translated_internal_response || '',
        external: res?.translated_external_response || '',
      });
      
      // Update the current source language for next translation using api_name
      if (langCode !== 'EN') {
        setCurrentSourceLanguage(languages.find(l => l.code === langCode)?.api_name || 'English');
      } else {
        setCurrentSourceLanguage('English');
      }
    } catch (e) {
      setTranslatedResponse({ internal: 'Translation failed', external: '' });
    }
    setIsTranslating(false);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", flexWrap: "wrap" }}>
      {isLoading && <Loader />}

      {renderDescription(description)}

      {showOfficial && (
        <ResponseSection type="official">
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Chip
                label="Response from Ashok Leyland's Official Documents"
                color="primary"
                size="small"
                icon={<VerifiedUserIcon fontSize="small" />}
              />
            </Box>
            {isFirstDisplay
              ? <TypingEffect
                  text={official}
                  speed={0.00001}
                  isActive={!isLoading}
                  onComplete={handleOfficialComplete}
                  messageId={messageId}
                  style={{ color: theme.palette.text.primary, lineHeight: 1.6 }}
                  onTextUpdate={onTextUpdate}
                />
              : <MarkdownRenderer text={selectedLang !== 'EN' && translatedResponse && translatedResponse.internal ? translatedResponse.internal : official} style={{ color: theme.palette.text.primary, lineHeight: 1.6 }} />
            }
          </CardContent>
        </ResponseSection>
      )}

      {showExternal &&
        (showOfficial ? completedSections.official : true) &&
        (showExternalWithoutBox ? (
          isFirstDisplay
            ? <TypingEffect
                text={external}
                speed={0.00001}
                isActive={true}
                onComplete={handleExternalComplete}
                messageId={messageId}
                style={{ color: theme.palette.text.primary, lineHeight: 1.6 }}
                onTextUpdate={onTextUpdate}
              />
            : <MarkdownRenderer text={selectedLang !== 'EN' && translatedResponse && translatedResponse.external ? translatedResponse.external : external} style={{ color: theme.palette.text.primary, lineHeight: 1.6 }} />
        ) : (
          <ResponseSection type="external">
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Chip
                  label="Response from External Sources"
                  color="secondary"
                  size="small"
                  icon={<LibraryBooksIcon fontSize="small" />}
                />
              </Box>
              {isFirstDisplay
                ? <TypingEffect
                    text={external}
                    speed={0.00001}
                    isActive={true}
                    onComplete={handleExternalComplete}
                    messageId={messageId}
                    style={{ color: theme.palette.text.primary, lineHeight: 1.6 }}
                    onTextUpdate={onTextUpdate}
                  />
                : <MarkdownRenderer text={selectedLang !== 'EN' && translatedResponse && translatedResponse.external ? translatedResponse.external : external} style={{ color: theme.palette.text.primary, lineHeight: 1.6 }} />
              }
            </CardContent>
          </ResponseSection>
        ))}

      {showCitations && completedSections.external && (
        <Box sx={{ mt: 4 }}>
          <Divider sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              component="h3"
              sx={{ color: "text.primary" }}
            >
              Reference Materials
            </Typography>
          </Divider>

          <CitationGrid container spacing={3}>
            {paginatedCitations.map((citation, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <CitationCard
                  title={citation.title}
                  actionLink={citation.actionLink}
                  imageLink={citation.imageLink}
                />
              </Grid>
            ))}
          </CitationGrid>

          {citations.length > itemsPerPage && (
            <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
              <Pagination
                count={Math.ceil(citations.length / itemsPerPage)}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                shape="rounded"
                sx={{
                  "& .MuiPaginationItem-root": {
                    fontSize: "0.875rem",
                    minWidth: 32,
                    height: 32,
                  },
                }}
              />
            </Box>
          )}
        </Box>
      )}

      {showSuggestions && completedSections.external && (
        <Box
          sx={{ mt: 4, pt: 3, borderTop: `1px solid ${theme.palette.divider}` }}
        >
          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{ color: "text.primary" }}
          >
            Continue exploring
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            {suggestedQuestions.map((q, i) => (
              <QuestionChip
                key={i}
                label={q}
                onClick={() => onSuggestionClick(q)}
                variant="outlined"
                deleteIcon={<ArrowForwardIcon fontSize="small" />}
                onDelete={() => onSuggestionClick(q)}
              />
            ))}
          </Box>
        </Box>
      )}

      {completedSections.external && (
        <Box
          sx={{
            mt: 4,
            pt: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'nowrap' }}>
            {/* TTS IconButton */}
            {isTTSAllowed && (
              <Tooltip
                title={
                  ttsState === "playing" && localSpeakingIndex === messageId
                    ? "Stop audio"
                    : "Play audio response"
                }
              >
                <span style={{ position: 'relative', display: 'inline-block' }}>
                  <IconButton
                    onClick={handleSpeak}
                    size="small"
                    sx={{
                      transition: 'all 0.2s ease',
                      color: localSpeakingIndex === messageId ?
                        (ttsState === 'playing' ? 'primary.main' : 'text.secondary') : 'text.secondary',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      }
                    }}
                    disabled={isAudioLoading}
                  >
                    {isAudioLoading ? (
                      <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 1.2,
                        m: 0.5,
                      }}>
                        <Box sx={{
                          border: `3px solid #f3f3f3`,
                          borderTop: `3px solid ${localSpeakingIndex === messageId && isAudioPlaying ? theme.palette.primary.main : theme.palette.text.secondary}`,
                          borderRadius: '50%',
                          width: 22,
                          height: 22,
                          animation: 'spin 1s linear infinite',
                        }} />
                        <style>{`@keyframes spin {0% { transform: rotate(0deg); }100% { transform: rotate(360deg); }}`}</style>
                      </Box>
                    ) : (
                      isAudioPlaying && localSpeakingIndex === messageId ? (
                        <PauseCircleOutlineIcon
                          fontSize="small"
                          style={{ fontSize: "1.5rem", color: theme.palette.primary.main }}
                        />
                      ) : (
                        <VolumeUpIcon
                          fontSize="small"
                          style={{ fontSize: "1.5rem", color: theme.palette.text.secondary }}
                        />
                      )
                    )}
                  </IconButton>
                </span>
              </Tooltip>
            )}

            {/* LuCopy IconButton */}
            <Tooltip title="Copy response text">
              <IconButton onClick={handleCopy} size="small">
                {copyStatus ? (
                  <LuCopyCheck style={{ color: theme.palette.success.main }} />
                ) : (
                  <LuCopy />
                )}
              </IconButton>
            </Tooltip>

            {/* Language Dropdown (Translate) */}
            <Box sx={{ ml: 1 }}>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  minWidth: 60,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  textTransform: 'none',
                  color: theme.palette.text.primary,
                  borderColor: theme.palette.divider,
                  background: theme.palette.background.paper,
                  '&:hover': {
                    background: theme.palette.action.hover,
                    borderColor: theme.palette.primary.main,
                  },
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  boxShadow: 'none',
                }}
                id="lang-dropdown-btn"
                aria-controls="lang-menu"
                aria-haspopup="true"
                onClick={e => setLangMenuAnchor(e.currentTarget)}
                startIcon={<TranslateIcon fontSize="small" sx={{ color: theme.palette.text.primary }} />}
              >
                {selectedLangObj ? `${selectedLangObj.name} - ${selectedLangObj.code}` : 'EN'}
              </Button>

              <Menu
                id="lang-menu"
                anchorEl={langMenuAnchor}
                open={Boolean(langMenuAnchor)}
                onClose={() => setLangMenuAnchor(null)}
                sx={{ mt: 1 }}
              >
                {languages.map(lang => (
                  <MenuItem
                    key={lang.code}
                    selected={selectedLang === lang.code}
                    onClick={() => {
                      setLangMenuAnchor(null);
                      handleLanguageChange(lang.code);
                    }}
                  >
                    {lang.name} - {lang.code}
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {isTTSAllowed && (
              <audio ref={audioRef} src={audioUrl || undefined} style={{ display: 'none' }} />
            )}
          </Box>

          {/* Feedback UI Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Was this helpful?
            </Typography>
            <IconButton
              size="small"
              onClick={() => handleFeedback("liked")}
              sx={{
                color:
                  submittedFeedback === "liked"
                    ? "success.main"
                    : feedback === "liked"
                    ? "success.main"
                    : "text.secondary",
                "&:hover": {
                  bgcolor: "action.selected",
                  color:
                    submittedFeedback === "liked"
                      ? "success.main"
                      : feedback === "liked"
                      ? "success.main"
                      : "text.secondary",
                },
              }}
            >
              <FaRegThumbsUp />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleFeedback("disliked")}
              sx={{
                color:
                  submittedFeedback === "disliked"
                    ? "error.main"
                    : feedback === "disliked"
                    ? "error.main"
                    : "text.secondary",
                "&:hover": {
                  bgcolor: "action.selected",
                  color:
                    submittedFeedback === "disliked"
                      ? "error.main"
                      : feedback === "disliked"
                      ? "error.main"
                      : "text.secondary",
                },
              }}
            >
              <FaRegThumbsDown />
            </IconButton>
          </Box>
        </Box>
      )}

      {/* Feedback Options UI */}
      {feedback && !selectedFeedbackOption && (
        <Box
          sx={{
            width: "100%",
            maxWidth: 600,
            mx: "auto",
            mt: 3,
            mb: 2,
            p: 3,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
            background: theme.palette.background.paper,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            position: "relative",
          }}
        >
          <IconButton
            size="small"
            onClick={() => {
              setFeedback(null);
              setSelectedFeedbackOption(null);
              setFeedbackComment("");
            }}
            sx={{
              position: "absolute",
              top: 14,
              right: 14,
              color: theme.palette.mode === "dark" ? "#fff" : "#222",
              bgcolor: "transparent",
              border: `1px solid ${theme.palette.divider}`,
              width: 36,
              height: 36,
              "&:hover": {
                bgcolor: theme.palette.action.hover,
              },
            }}
          >
            <span style={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }}>
              ×
            </span>
          </IconButton>
          <Typography
            variant="subtitle1"
            sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}
          >
            {feedback === "liked" ? "Tell us more:" : "What was the issue?"}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
              width: "100%",
              mb: 1,
            }}
          >
            {(feedback === "liked"
              ? [
                  "Good Answer",
                  "Satisfactory",
                  "Very Helpful",
                  "Accurate Result",
                ]
              : ["Inaccurate", "Harmful", "Out of Date", "Too Short","This isn't helpful"]
            ).map((option) => (
              <Button
                key={option}
                variant="outlined"
                color="primary"
                onClick={() => setSelectedFeedbackOption(option)}
                sx={{
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1.08rem",
                  borderColor: theme.palette.divider,
                  color: theme.palette.text.primary,
                  bgcolor: "background.default",
                  px: 0,
                  py: 2,
                  width: "100%",
                  justifyContent: "center",
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    bgcolor: theme.palette.action.hover,
                  },
                }}
              >
                {option}
              </Button>
            ))}
          </Box>
        </Box>
      )}

      {/* Comment Box UI */}
      {feedback && selectedFeedbackOption && (
        <Box
          sx={{
            width: "100%",
            maxWidth: 600,
            mx: "auto",
            mt: 3,
            mb: 2,
            p: 3,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
            background: theme.palette.background.paper,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            position: "relative",
          }}
        >
          <IconButton
            size="small"
            onClick={() => {
              setSelectedFeedbackOption(null);
              setFeedbackComment("");
            }}
            sx={{
              position: "absolute",
              top: 14,
              right: 14,
              color: theme.palette.mode === "dark" ? "#fff" : "#222",
              bgcolor: "transparent",
              border: `1px solid ${theme.palette.divider}`,
              width: 36,
              height: 36,
              "&:hover": {
                bgcolor: theme.palette.action.hover,
              },
            }}
          >
            <span style={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }}>
              ×
            </span>
          </IconButton>
          <Typography
            variant="subtitle1"
            sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}
          >
            {selectedFeedbackOption}
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={5}
            maxRows={8}
            placeholder="Type your feedback here..."
            value={feedbackComment}
            onChange={(e) => setFeedbackComment(e.target.value)}
            sx={{
              mb: 2,
              borderRadius: 2.5,
              background: theme.palette.mode === "dark" ? "#18181a" : "#f7f7f8",
              fontSize: "1.08rem",
              border: `1.5px solid ${theme.palette.divider}`,
              minHeight: 120,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2.5,
                fontSize: "1.08rem",
                background: "inherit",
                padding: 0,
                minHeight: 120,
                alignItems: "flex-start",
              },
              "& .MuiInputLabel-root": {
                fontWeight: 500,
                color: theme.palette.text.secondary,
              },
            }}
            InputProps={{
              style: {
                borderRadius: 12,
                fontSize: "1.08rem",
                padding: 8,
                minHeight: 120,
                alignItems: "flex-start",
              },
            }}
          />
          <Box
            sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              variant="outlined"
              color="primary"
              disabled={feedbackComment.trim().length === 0}
              onClick={handleSubmitFeedback}
              sx={{
                borderRadius: 2.5,
                fontWeight: 700,
                px: 4,
                py: 1.2,
                fontSize: "1.08rem",
                textTransform: "none",
                mt: 1,
                minWidth: 120,
                boxShadow: "none",
                color:
                  theme.palette.mode === "dark"
                    ? theme.palette.primary.light
                    : theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
                opacity: feedbackComment.trim().length === 0 ? 0.6 : 1,
              }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      )}

      {/* Feedback Status Snackbar */}
      <Snackbar
        open={feedbackStatus.show}
        autoHideDuration={4000}
        onClose={handleCloseFeedbackStatus}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseFeedbackStatus}
          severity={feedbackStatus.type}
          variant="filled"
          sx={{
            width: "100%",
            "& .MuiAlert-message": {
              fontSize: "1rem",
              fontWeight: 500,
            },
          }}
        >
          {feedbackStatus.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}