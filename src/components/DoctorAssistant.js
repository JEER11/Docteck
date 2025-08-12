import React, { useState, useEffect, useRef } from "react";
import { IconButton, InputBase, Paper, Box, Tooltip } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import getApiBase from "../lib/apiBase";


// Compute API base using helper to work across dev/prod and different host ports
const API_URL = getApiBase();

function DoctorAssistant({ messages: controlledMessages, setMessages: setControlledMessages, compact: compactProp }) {
  const isControlled = controlledMessages !== undefined && setControlledMessages !== undefined;
  const initialMessage = [
    { sender: "ai", text: "Hello! I'm your Medical Assistant. Describe your symptoms and I'll help you understand what you might have or suggest possible medication.", ts: Date.now() }
  ];
  const [uncontrolledMessages, setUncontrolledMessages] = useState(initialMessage);
  const messages = isControlled ? controlledMessages : uncontrolledMessages;
  const setMessages = isControlled ? setControlledMessages : setUncontrolledMessages;
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [compactInternal] = useState(false);
  const compact = compactProp !== undefined ? compactProp : compactInternal;

  // Scroll management
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) {
      // Auto-scroll to bottom whenever messages change or typing indicator toggles
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const formatTs = (t) => {
    if (!t) return "";
    try {
      const d = new Date(t);
      return d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return "";
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const now = Date.now();
    const userMessage = { sender: "user", text: input, ts: now };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    try {
  const response = await fetch(`${API_URL}/api/groq-assistant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      let aiText = data.reply || "Sorry, I couldn't process that.";
      setMessages((prev) => [...prev, { sender: "ai", text: aiText, ts: Date.now() }]);
    } catch (e) {
      setMessages((prev) => [...prev, { sender: "ai", text: "Sorry, there was an error connecting to the Doctor Assistant.", ts: Date.now() }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      handleSend();
    }
  };

  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      width: "100%",
      flex: 1,
      minHeight: 0,
      p: { xs: 1.5, md: 3 }
    }}>
  {/* Compact toggle moved to page header */}
      <Box sx={{
        flex: 1,
        overflowY: "auto",
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        gap: compact ? { xs: 0.75, md: 1 } : { xs: 1.25, md: 1.75 },
        pb: { xs: 3, md: 4 },
        px: { xs: 0.5, md: 0 },
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
      }} ref={scrollRef}>
        {messages.map((msg, idx) => (
          <Box key={idx} sx={{ display: "flex", justifyContent: msg.sender === "user" ? "flex-end" : "flex-start" }}>
            <Tooltip title={formatTs(msg.ts)} arrow placement={msg.sender === 'user' ? 'left' : 'right'} disableInteractive>
              <Paper sx={{
                p: compact ? { xs: 0.75, md: 1 } : { xs: 1.25, md: 1.5 },
                bgcolor: msg.sender === "user" ? "rgba(106,106,252,0.20)" : "rgba(255,255,255,0.10)",
                color: 'white',
                borderRadius: 3,
                border: '1px solid rgba(255,255,255,0.08)',
                maxWidth: { xs: '86%', md: msg.sender === "ai" ? "66%" : "88%" },
                fontSize: compact ? "0.9rem" : "0.95rem",
                boxShadow: 'none',
                wordBreak: 'break-word',
              }}>
                {msg.text}
              </Paper>
            </Tooltip>
          </Box>
        ))}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
            <Paper sx={{ p: compact ? { xs: 0.75, md: 1 } : { xs: 1.25, md: 1.5 }, bgcolor: "rgba(255,255,255,0.10)", color: "white", borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)', maxWidth: { xs: '86%', md: '66%' }, fontSize: compact ? "0.9rem" : "0.95rem", boxShadow: 'none' }}>
              Doctor Assistant is typing...
            </Paper>
          </Box>
        )}
      </Box>
      <Paper
        component="form"
        sx={{
          display: "flex",
          alignItems: "center",
          p: compact ? { xs: 0.75, md: 1 } : { xs: 1.25, md: 1.5 },
          bgcolor: 'rgba(255,255,255,0.10)',
          boxShadow: 'none',
          borderRadius: 3,
          mt: { xs: 2, md: 3 },
          border: '1px solid rgba(255,255,255,0.08)'
        }}
        onSubmit={e => { e.preventDefault(); handleSend(); }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1, color: 'white', fontSize: compact ? 15 : 16, py: compact ? { xs: 0, md: 0 } : { xs: 0.25, md: 0.5 } }}
          placeholder="Describe your symptoms..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <IconButton color="primary" onClick={handleSend} disabled={loading || !input.trim()} sx={{
          bgcolor: 'rgba(106,106,252,0.22)',
          color: 'white',
          '&:hover': { bgcolor: 'rgba(106,106,252,0.35)' }
        }}>
          <SendIcon />
        </IconButton>
      </Paper>
    </Box>
  );
}

export default DoctorAssistant;
