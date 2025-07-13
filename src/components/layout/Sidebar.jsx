import React, { useEffect, useState, useMemo } from 'react';
import { 
  List, ListItemButton, Typography, TextField, IconButton,
  ListItemText, Divider, Box, Tooltip
} from '@mui/material';
import { Delete, Search } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { setChat, setSessionID, deleteSession } from '../../redux/actions';
import { categorizeDate, formatDate } from '../../utils/dateUtils';

// Utility function to truncate text
const truncateText = (text, maxLength = 80) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const Sidebar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const allChatData = useSelector((state) => state.chat.allChat);
  const sessionID = useSelector((state) => state.chat.session_id);
  const dispatch = useDispatch();

  const processedSessions = useMemo(() => {
    const sessions = allChatData.reduce((acc, message) => {
      const session = acc[message.session_id] || [];
      return { ...acc, [message.session_id]: [...session, message] };
    }, {});

    return Object.values(sessions)
      .filter(session => 
        session[0].input_prompt.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => 
        new Date(b[0].created_on) - new Date(a[0].created_on)
      );
  }, [allChatData, searchQuery]);

  useEffect(() => {
    console.log("All Chat Data:", allChatData);
    console.log("Processed Sessions:", processedSessions);
  }, [allChatData, processedSessions]);

  return (
    <Box sx={{ p: 1 }}>
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        placeholder="Search history..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: <Search fontSize="small" sx={{ mr: 1 }} />
        }}
        sx={{ mb: 1 }}
      />

      {processedSessions.map((session) => (
        <Box key={session[0].session_id} sx={{ mb: 1 }}>
         
          <List dense>
            <ListItemButton
              selected={sessionID === session[0].session_id}
              sx={{
                borderRadius: 1,
                mb: 0,
                display: 'flex',
                justifyContent: 'space-between',
                '&:hover .delete-btn': { opacity: 1 }
              }}
              onClick={() => {
                dispatch(setChat(session));
                dispatch(setSessionID(session[0].session_id));
              }}
            >
              <Box 
                sx={{ 
                  flexGrow: 1,
                  minWidth: 0,
                }}
              >
                <Tooltip title={session[0].input_prompt} enterDelay={300}>
                  <Typography
                    variant="body2"
                    sx={{ 
                      fontWeight: 500,
                      lineHeight: 1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {truncateText(session[0].input_prompt)}
                  </Typography>
                </Tooltip>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block' }}
                >
                  {formatDate(session[0].created_on)}
                </Typography>
              </Box>
              
              <IconButton
                size="small"
                className="delete-btn"
                sx={{ 
                  opacity: 0, 
                  transition: 'opacity 0.2s',
                  flexShrink: 0
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(deleteSession(session[0].session_id));
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </ListItemButton>
          </List>
        </Box>
      ))}
    </Box>
  );
};

export default Sidebar;