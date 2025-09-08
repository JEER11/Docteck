import React, { useState, useEffect, useRef } from "react";
import { IconButton, InputBase, Paper, Box, Tooltip } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import getApiBase from "../lib/apiBase";
import { onChatMessages, addChatMessage } from "lib/chatData";
import { enqueue } from "lib/assistantBus";
import { auth } from "lib/firebase";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Tidy AI markdown: merge standalone numbered lines with next line and collapse extra spacing
function formatAiMarkdown(text) {
  if (!text) return text;
  let t = String(text).replace(/\r/g, '');
  const lines = t.split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trimEnd();
    const m = line.match(/^\s*(\d+)\s*[.)]?\s*$/);
    if (m) {
      let j = i + 1;
      while (j < lines.length && lines[j].trim() === '') j++;
      if (j < lines.length) {
        out.push(`${m[1]}. ${lines[j].trim()}`);
        i = j; // skip the consumed line
        continue;
      }
      out.push(`${m[1]}.`);
      continue;
    }
    out.push(line);
  }
  t = out.join('\n');
  // Collapse 3+ consecutive blank lines to 1 empty line
  t = t.replace(/\n{3,}/g, '\n\n');
  return t;
}


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
    // Watchdog: ensure we never stay stuck on typing
    let watchdog = setTimeout(() => {
      setMessages((prev) => [...prev, { sender: 'ai', text: 'Still working on that… please try again in a moment if no reply appears.', ts: Date.now() }]);
      setLoading(false);
    }, 35_000);
    try {
      // Prepare a trimmed chat history for the smart assistant
      const history = [...messages, userMessage].slice(-15).map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));
      const groqFallback = async (text, base) => {
        try {
          const r = await fetch(`${base}/api/groq-assistant`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
          });
          if (!r.ok) return null;
          const dj = await r.json().catch(() => null);
          return dj && dj.reply ? dj.reply : null;
        } catch (_) { return null; }
      };

      const attempt = async (once, base = API_URL) => {
        // 25s safety timeout so UI never hangs
        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), 25000);
        try {
          const response = await fetch(`${base}/api/assistant-smart`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: history }),
            signal: controller.signal,
          });
          const data = await response.json().catch(() => ({}));
          if (!response.ok && data && data.error === 'rate_limit_exceeded') {
            const wait = typeof data.retryAfter === 'number' ? Math.min(45, data.retryAfter) : 20;
            // If server provided a fallback reply, use it immediately instead of waiting
            if (data && typeof data.reply === 'string' && data.reply.trim()) {
              return { text: data.reply };
            }
            // Try Groq directly once as a backup
            const gf = await groqFallback(userMessage.text, base);
            if (gf) return { text: gf };
            if (!once) {
              setMessages((prev) => [...prev, { sender: "ai", text: `Rate limited — retrying in ~${wait}s…`, ts: Date.now() }]);
              await new Promise(r => setTimeout(r, wait * 1000));
              return attempt(true, base);
            }
            return { text: `We're temporarily rate limited. Please try again in about ${wait} seconds.` };
          }
          return { text: (data && (data.reply || data.message)) || "Sorry, I couldn't process that.", tool: data && data.tool };
        } catch (err) {
          // If network error and base is localhost, retry with 127.0.0.1 (and vice versa) once
          const isLocal = typeof base === 'string' && base.includes('localhost:3001');
          const is127 = typeof base === 'string' && base.includes('127.0.0.1:3001');
          // Try Groq fallback before switching host
          const gf2 = await groqFallback(userMessage.text, base);
          if (gf2) return { text: gf2 };
          if (!once && (isLocal || is127)) {
            const alt = isLocal ? base.replace('localhost', '127.0.0.1') : base.replace('127.0.0.1', 'localhost');
            return attempt(true, alt);
          }
          return { text: "Sorry, there was an error connecting to the Doctor Assistant." };
        } finally {
          clearTimeout(t);
        }
      };
      const { text: aiRaw, tool } = await attempt(false);
      let aiText = aiRaw;
  
  aiText = formatAiMarkdown(aiText);
      // If the assistant used an app tool, emit a DOM event so existing UI can react without UI changes
      try {
        const toolData = tool || {};
        if (toolData && toolData.name) {
          // Normalize payloads
          const detail = toolData.result || {};
          if (toolData.name === 'add_todo' && detail.todo) enqueue('add_todo', detail.todo);
          else if (toolData.name === 'add_appointment' && detail.appointment) enqueue('add_appointment', detail.appointment);
          else if (toolData.name === 'add_hub_item' && detail.hub) enqueue('add_hub_item', detail.hub);
          else if (toolData.name === 'add_pharmacy' && detail.pharmacy) enqueue('add_pharmacy', detail.pharmacy);
          else if (toolData.name === 'add_prescription' && detail.prescription) enqueue('add_prescription', detail.prescription);
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
  clearTimeout(watchdog);
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
                {msg.sender === 'ai' ? (
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    linkTarget="_blank"
                    components={{
                      strong: ({node, ...props}) => <strong style={{fontWeight:800}} {...props} />,
                      a: ({node, ...props}) => <a style={{color:'#8ab4ff'}} target="_blank" rel="noreferrer" {...props} />,
                      ul: ({node, ...props}) => <ul style={{paddingLeft: '1.1rem', margin: '0.1rem 0', listStylePosition: 'outside'}} {...props} />,
                      ol: ({node, ...props}) => <ol style={{paddingLeft: '1.1rem', margin: '0.1rem 0', listStylePosition: 'outside'}} {...props} />,
                      li: ({node, ...props}) => <li style={{margin: '0.06rem 0'}} {...props} />,
                      p: ({node, ...props}) => <p style={{margin: 0, lineHeight: 1.35}} {...props} />,
                      h1: ({node, ...props}) => <h3 style={{margin: '0.15rem 0 0.2rem', fontSize: '1.05rem'}} {...props} />,
                      h2: ({node, ...props}) => <h4 style={{margin: '0.12rem 0 0.18rem', fontSize: '1rem'}} {...props} />,
                      h3: ({node, ...props}) => <h5 style={{margin: '0.1rem 0 0.16rem', fontSize: '0.95rem'}} {...props} />,
                      code: ({inline, ...props}) => inline ? (
                        <code style={{background: 'rgba(255,255,255,0.08)', padding: '0 4px', borderRadius: 4}} {...props} />
                      ) : (
                        <pre style={{background: 'rgba(255,255,255,0.08)', padding: 8, borderRadius: 6, overflowX: 'auto'}}><code {...props} /></pre>
                      )
                    }}
                  >
                    {msg.text}
                </ReactMarkdown>
                ) : (
                  <span>{msg.text}</span>
                )}
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
