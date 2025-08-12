import React, { useState } from "react";
import { IconButton, InputBase, Paper, Box } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import getApiBase from "../lib/apiBase";


// Compute API base using helper to work across dev/prod and different host ports
const API_URL = getApiBase();

function DoctorAssistant({ messages: controlledMessages, setMessages: setControlledMessages }) {
  const isControlled = controlledMessages !== undefined && setControlledMessages !== undefined;
  const initialMessage = [
    { sender: "ai", text: "Hello! I'm your Medical Assistant. Describe your symptoms and I'll help you understand what you might have or suggest possible medication." }
  ];
  const [uncontrolledMessages, setUncontrolledMessages] = useState(initialMessage);
  const messages = isControlled ? controlledMessages : uncontrolledMessages;
  const setMessages = isControlled ? setControlledMessages : setUncontrolledMessages;
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
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
      setMessages((prev) => [...prev, { sender: "ai", text: aiText }]);
    } catch (e) {
      setMessages((prev) => [...prev, { sender: "ai", text: "Sorry, there was an error connecting to the Doctor Assistant." }]);
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
  height: { xs: 420, md: 640 }, // increased height for chat area
      width: "100%",
      flex: 1,
  maxHeight: { xs: 420, md: 640 },
  minHeight: { xs: 420, md: 640 },
      p: { xs: 1.5, md: 3 }
    }}>
      <Box sx={{
        flex: 1,
        overflowY: "auto",
        minHeight: 0,
  maxHeight: { xs: 300, md: 440 }, // increased scrollable area for messages
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 1.5, md: 2 },
        pb: { xs: 3, md: 4 },
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
        {messages.map((msg, idx) => (
          <Box key={idx} sx={{ display: "flex", justifyContent: msg.sender === "user" ? "flex-end" : "flex-start" }}>
            <Paper sx={{
              p: { xs: 1.5, md: 1.75 },
              bgcolor: msg.sender === "user" ? "rgba(44, 50, 90, 0.85)" : "rgba(238, 238, 238, 0.5)",
              color: msg.sender === "user" ? "white" : "black",
              borderRadius: 2,
              maxWidth: { xs: '86%', md: msg.sender === "ai" ? "66%" : "88%" },
              fontSize: "0.95rem",
              boxShadow: 'none',
              wordBreak: 'break-word',
            }}>
              {msg.text}
            </Paper>
          </Box>
        ))}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
            <Paper sx={{ p: { xs: 1.5, md: 1.75 }, bgcolor: "rgba(238, 238, 238, 0.5)", color: "black", borderRadius: 2, maxWidth: { xs: '86%', md: '66%' }, fontSize: "0.95rem", boxShadow: 'none' }}>
              Doctor Assistant is typing...
            </Paper>
          </Box>
        )}
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <Paper
        component="form"
        sx={{
          display: "flex",
          alignItems: "center",
          p: { xs: 1.5, md: 2 },
          bgcolor: "rgba(238, 238, 238, 0.5)",
          boxShadow: 'none',
          borderRadius: 2,
          mt: { xs: 2, md: 3 },
          border: '1px solid rgba(255,255,255,0.08)'
        }}
        onSubmit={e => { e.preventDefault(); handleSend(); }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1, color: 'white', fontSize: 16, py: { xs: 0.25, md: 0.5 } }}
          placeholder="Describe your symptoms..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <IconButton color="primary" onClick={handleSend} disabled={loading || !input.trim()}>
          <SendIcon />
        </IconButton>
      </Paper>
    </Box>
  );
}

export default DoctorAssistant;
