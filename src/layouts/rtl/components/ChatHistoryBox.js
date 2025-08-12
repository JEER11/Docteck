import React, { useState, useEffect } from "react";
import { Card, Box, Typography, List, ListItem, ListItemText, Divider, Dialog, DialogTitle, DialogContent, TextField, Button } from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import colors from "assets/theme/base/colors";
import { FaHistory } from "react-icons/fa";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// For demo, use localStorage. In production, use backend or context.
const CHAT_HISTORY_KEY = "doctorAssistantHistory";

function ChatHistoryBox({ history, onRestoreChat, onDeleteChat }) {
  const { info, gradients } = colors;
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuIdx, setMenuIdx] = useState(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleMenuOpen = (event, idx) => {
    setAnchorEl(event.currentTarget);
    setMenuIdx(idx);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuIdx(null);
  };

  const handleDelete = () => {
    if (typeof onDeleteChat === 'function' && menuIdx !== null) {
      onDeleteChat(menuIdx);
    }
    handleMenuClose();
  };

  const filtered = (history || []).map((chat, idx) => {
    const firstUser = chat.conversation?.find(m => m.sender === 'user');
    let topic = 'General Chat';
    if (firstUser && firstUser.text) {
      topic = firstUser.text.split(' ').slice(0, 5).join(' ');
      if (topic.length > 30) topic = topic.slice(0, 30) + '...';
    }
    return { idx, chat, topic };
  }).filter(item => item.topic.toLowerCase().includes(query.toLowerCase()));

  return (
    <Card sx={{ height: 420, display: 'flex', flexDirection: 'column' }}>
      <VuiBox sx={{ width: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <VuiBox display='flex' alignItems='center' justifyContent='space-between' sx={{ width: '100%' }} mb='12px'>
          <VuiTypography variant='lg' color='white' mr='auto' fontWeight='bold'>
            <FaHistory style={{ marginRight: 8 }} /> Chat History
          </VuiTypography>
          <Button size="small" onClick={() => setOpen(true)} sx={{
            color: '#bdbdbd',
            textTransform: 'none',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 2,
            px: 1.25,
            py: 0.25,
            fontSize: 13,
            '&:hover': { background: 'rgba(255,255,255,0.08)' }
          }}>View all</Button>
        </VuiBox>
        <Box sx={{
          flex: 1,
          overflowY: 'auto',
          px: 2,
          // Ultra-minimal scrollbar: only thumb, no background/track
          '::-webkit-scrollbar': {
            width: '6px',
            background: 'transparent',
          },
          '::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '::-webkit-scrollbar-thumb': {
            background: 'rgba(255,255,255,0.13)',
            borderRadius: '6px',
            minHeight: '40px',
          },
          '::-webkit-scrollbar-corner': {
            background: 'transparent',
          },
          'scrollbarWidth': 'thin',
          'scrollbarColor': 'rgba(255,255,255,0.13) transparent',
        }}>
          {history.length === 0 ? (
            <Typography color="text.secondary" sx={{ fontSize: 14, textAlign: 'center', mt: 2 }}>
              No previous chats yet.
            </Typography>
          ) : (
            <Box display="flex" flexDirection="column" gap={2}>
              {history.map((chat, idx) => {
                const firstUser = chat.conversation?.find(m => m.sender === 'user');
                // Use first 5 words of first user message as topic, fallback to 'General Chat'
                let topic = 'General Chat';
                if (firstUser && firstUser.text) {
                  topic = firstUser.text.split(' ').slice(0, 5).join(' ');
                  if (topic.length > 30) topic = topic.slice(0, 30) + '...';
                }
                return (
                  <Box
                    key={idx}
                    sx={{
                      background: 'rgba(23, 25, 50, 0.95)',
                      color: 'white',
                      borderRadius: 3,
                      px: 2,
                      py: 1.5,
                      mb: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontWeight: 600,
                      fontSize: 16,
                      boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                      '&:hover': { background: 'rgba(33, 35, 60, 1)' },
                    }}
                    onClick={() => onRestoreChat(chat.conversation)}
                  >
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 700, fontSize: 15 }}>
                      {topic}
                    </span>
                    <IconButton size="small" sx={{ ml: 1, color: '#bdbdbd' }} onClick={e => { e.stopPropagation(); handleMenuOpen(e, idx); }}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={menuIdx === idx} onClose={handleMenuClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
                      <MenuItem onClick={handleDelete}>Delete</MenuItem>
                      {/* Add more options here if needed */}
                    </Menu>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
      </VuiBox>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ bgcolor: 'rgba(18,20,40,0.95)', color: 'white' }}>All Chats</DialogTitle>
        <DialogContent sx={{ bgcolor: 'rgba(18,20,40,0.95)' }}>
          <TextField
            autoFocus
            fullWidth
            placeholder="Search chats..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              mb: 2,
              input: { color: 'white' },
              label: { color: 'rgba(255,255,255,0.7)' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
            }}
          />
          <Box sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <Typography color="text.secondary" sx={{ fontSize: 14, textAlign: 'center', mt: 2 }}>
                No chats found.
              </Typography>
            ) : (
              <List>
                {filtered.map(({ idx, topic }) => (
                  <ListItem key={idx} secondaryAction={
                    onDeleteChat ? (
                      <Button size="small" color="error" onClick={() => onDeleteChat(idx)}>Delete</Button>
                    ) : null
                  }>
                    <ListItemText primary={topic} primaryTypographyProps={{ sx: { color: 'white', fontWeight: 600 } }} onClick={() => { onRestoreChat?.(history[idx]?.conversation); setOpen(false); }} />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default ChatHistoryBox;
