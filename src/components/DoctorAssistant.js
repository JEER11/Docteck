import React, { useState, useEffect, useRef } from "react";
import { IconButton, InputBase, Paper, Box, Tooltip } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import getApiBase from "../lib/apiBase";
import { onChatMessages, addChatMessage } from "lib/chatData";
import { enqueue } from "lib/assistantBus";
import { auth } from "lib/firebase";


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

  // Persisted chat subscription (default session)
  useEffect(() => {
    // Only bind when component manages its own messages and user is signed in
    if (!auth || !auth.currentUser || isControlled) return;
    const unsub = onChatMessages({}, (items) => {
      if (!items.length) return setUncontrolledMessages(initialMessage);
      setUncontrolledMessages(items.map((m) => ({ sender: m.sender, text: m.text, ts: m.tsClient || Date.now() })));
    });
    return () => unsub && unsub();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isControlled]);

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
      // Detect URLs in the user's message and attempt lightweight analysis
      const urlMatches = (userMessage.text.match(/https?:\/\/\S+/gi) || []).slice(0, 3);
      let linkSummaries = [];
      for (const u of urlMatches) {
        try {
          const form = new FormData();
          form.append('url', u);
          const r = await fetch(`${API_URL}/api/analyze-file`, { method: 'POST', body: form });
          const d = await r.json();
          let summary = '';
          if (d.type === 'url') {
            const p = d.page || {}; const parts = [];
            if (p.title) parts.push(`Title: ${p.title}`);
            if (p.description) parts.push(`Description: ${p.description}`);
            if (p.text) parts.push(`Content: ${p.text.slice(0, 600)}`);
            summary = parts.join('\n');
          } else if (d.type === 'pdf' || d.type === 'text') {
            summary = (d.content || '').slice(0, 800);
          } else if (d.type === 'image') {
            const parts = []; if (d.caption) parts.push(`Image: ${d.caption}`); if (d.ocr) parts.push(`OCR: ${d.ocr.slice(0, 600)}`); summary = parts.join('\n');
          }
          if (summary) linkSummaries.push(`URL: ${u}\n${summary}`);
        } catch (_) { /* ignore link failures */ }
      }

      // Prepare a trimmed chat history for the smart assistant
      const history = [...messages, userMessage].slice(-15).map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));
      const response = await fetch(`${API_URL}/api/assistant-smart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = await response.json();
      let aiText = data.reply || "Sorry, I couldn't process that.";
      if (linkSummaries.length) {
        aiText = `I analyzed the links you shared:\n\n${linkSummaries.join('\n\n')}\n\n---\n${aiText}`;
      }
      // If the assistant used an app tool, emit a DOM event so existing UI can react without UI changes
      try {
        const tool = data.tool || {};
        if (tool && tool.name) {
          // Normalize payloads
          const detail = tool.result || {};
          if (tool.name === 'add_todo' && detail.todo) enqueue('add_todo', detail.todo);
          else if (tool.name === 'add_appointment' && detail.appointment) enqueue('add_appointment', detail.appointment);
          else if (tool.name === 'add_hub_item' && detail.hub) enqueue('add_hub_item', detail.hub);
          else if (tool.name === 'add_pharmacy' && detail.pharmacy) enqueue('add_pharmacy', detail.pharmacy);
          else if (tool.name === 'add_prescription' && detail.prescription) enqueue('add_prescription', detail.prescription);
        }
      } catch (_) {}
      // Write both messages to Firestore when not controlled and signed in
      try {
        if (!isControlled && auth && auth.currentUser) {
          await addChatMessage({ sender: 'user', text: userMessage.text, tsClient: now });
          await addChatMessage({ sender: 'ai', text: aiText, tsClient: Date.now() });
        }
      } catch (_) {}
      setMessages((prev) => [...prev, { sender: "ai", text: aiText, ts: Date.now() }]);
    } catch (e) {
  const errText = "Sorry, there was an error connecting to the Doctor Assistant.";
  try { if (!isControlled && auth && auth.currentUser) await addChatMessage({ sender: 'ai', text: errText, tsClient: Date.now() }); } catch (_) {}
      setMessages((prev) => [...prev, { sender: "ai", text: errText, ts: Date.now() }]);
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
                whiteSpace: 'pre-wrap',
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
