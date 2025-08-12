import React, { useState, useEffect } from "react";
import { Card, Box, Typography, List, ListItem, ListItemText, Divider, Dialog, DialogTitle, DialogContent, TextField, Button, Avatar, ListItemAvatar, ListItemButton, InputAdornment, Tooltip, Slide } from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import colors from "assets/theme/base/colors";
import { FaHistory } from "react-icons/fa";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';

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

  // Derive nice metadata for each chat item
  const getChatMeta = (chat) => {
    const firstUser = chat.conversation?.find((m) => m.sender === 'user');
    const firstAssistant = chat.conversation?.find((m) => m.sender !== 'user');
    // topic: first 5 words of the first user message
    let topic = 'General Chat';
    if (firstUser?.text) {
      topic = firstUser.text.split(' ').slice(0, 5).join(' ');
    }
    if (topic.length > 42) topic = topic.slice(0, 42) + '...';

    // preview: a short snippet from the first assistant response
    let preview = firstAssistant?.text || '';
    if (preview.length > 80) preview = preview.slice(0, 80) + '…';

    // timestamp: try several fields commonly used
    const ts = chat.savedAt || chat.updatedAt || chat.createdAt || chat.conversation?.[0]?.timestamp || chat.conversation?.[0]?.time || null;
    let when = '';
    try {
      if (ts) {
        const d = new Date(ts);
        const today = new Date();
        const sameDay = d.toDateString() === today.toDateString();
        when = sameDay ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : d.toLocaleDateString();
      }
    } catch (e) {
      when = '';
    }
    return { topic, preview, when };
  };

  const filtered = (history || [])
    .map((chat, idx) => ({ idx, chat, ...getChatMeta(chat) }))
    .filter((item) =>
      `${item.topic} ${item.preview}`.toLowerCase().includes(query.toLowerCase())
    );

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
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
        keepMounted
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' }}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(12, 14, 30, 0.98)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 3,
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
          }
        }}
      >
        <DialogTitle sx={{ px: 3, py: 2.5 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1.25}>
              <Box sx={{
                width: 34,
                height: 34,
                borderRadius: '10px',
                display: 'grid',
                placeItems: 'center',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(56,189,248,0.25))',
                color: 'white'
              }}>
                <FaHistory />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, lineHeight: 1 }}>
                  All Chats
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  {filtered.length} result{filtered.length === 1 ? '' : 's'}
                </Typography>
              </Box>
            </Box>
            <IconButton aria-label="close" onClick={() => setOpen(false)} sx={{ color: 'rgba(255,255,255,0.7)' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ px: 3, py: 2.5 }}>
          <TextField
            autoFocus
            fullWidth
            placeholder="Search chats..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            variant="outlined"
            size="medium"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                </InputAdornment>
              ),
              endAdornment: (
                query ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setQuery('')} sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null
              )
            }}
            sx={{
              mb: 2.5,
              input: { color: 'white' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.25)' },
              '& .MuiInputBase-root': { bgcolor: 'rgba(255,255,255,0.06)', borderRadius: 2 }
            }}
          />

          <Box sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, textAlign: 'center', mt: 4 }}>
                No chats found.
              </Typography>
            ) : (
              <List disablePadding>
                {filtered.map(({ idx, topic, preview, when }, i) => (
                  <React.Fragment key={idx}>
                    <ListItem disablePadding secondaryAction={
                      onDeleteChat ? (
                        <Tooltip title="Delete chat" arrow>
                          <IconButton edge="end" onClick={(e) => { e.stopPropagation(); onDeleteChat(idx); }} sx={{ color: 'rgba(255,80,80,0.9)' }}>
                            <DeleteForeverOutlinedIcon />
                          </IconButton>
                        </Tooltip>
                      ) : null
                    }>
                      <ListItemButton
                        onClick={() => { onRestoreChat?.(history[idx]?.conversation); setOpen(false); }}
                        sx={{
                          py: 1.25,
                          px: 1.5,
                          borderRadius: 2,
                          '&:hover': { backgroundColor: 'rgba(255,255,255,0.06)' }
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              fontSize: 14,
                              fontWeight: 700,
                              bgcolor: 'transparent',
                              color: 'white',
                              background: 'linear-gradient(135deg, rgba(124,58,237,0.35), rgba(16,185,129,0.35))',
                              border: '1px solid rgba(255,255,255,0.1)'
                            }}
                          >
                            {String(topic).charAt(0).toUpperCase() || 'C'}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" justifyContent="space-between" gap={1}>
                              <Typography sx={{ color: 'white', fontWeight: 700, pr: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {topic}
                              </Typography>
                              {when && (
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap' }}>
                                  {when}
                                </Typography>
                              )}
                            </Box>
                          }
                          secondary={
                            preview ? (
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)', mt: 0.25 }}>
                                {preview}
                              </Typography>
                            ) : null
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                    {i < filtered.length - 1 && (
                      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
                    )}
                  </React.Fragment>
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
