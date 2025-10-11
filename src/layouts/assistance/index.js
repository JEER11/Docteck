
//
// MIT: Portions © 2021 Creative Tim & Simmmple (Vision UI Free React). See LICENSE.md.
//

import { Card, Stack, Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import colors from "assets/theme/base/colors";
import linearGradient from "assets/theme/functions/linearGradient";
import VuiBox from "components/VuiBox";
import VuiProgress from "components/VuiProgress";
import VuiTypography from "components/VuiTypography";
import { setDirection, useVisionUIController } from "context";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import BarChart from "examples/Charts/BarCharts/BarChart";
import LineChart from "examples/Charts/LineCharts/LineChart";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import OrderOverview from "layouts/rtl/components/OrderOverview";
import Projects from "layouts/rtl/components/Projects";
import ReferralTracking from "layouts/rtl/components/ReferralTracking";
import MiniDayCalendar from "components/MiniDayCalendar";
import WelcomeMark from "layouts/rtl/components/WelcomeMark";
import { barChartDataDashboard } from "layouts/rtl/data/barChartData";
import { barChartOptionsDashboard } from "layouts/rtl/data/barChartOptions";
import { lineChartDataDashboard } from "layouts/rtl/data/lineChartData";
import { lineChartOptionsDashboard } from "layouts/rtl/data/lineChartOptions";
import { useEffect, useState, useRef } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { IoIosRocket } from "react-icons/io";
import { IoBuild, IoDocumentText, IoGlobe, IoWallet } from "react-icons/io5";
import DoctorAssistant from "components/DoctorAssistant";
import { auth } from "lib/firebase";
import { addChatMessage } from "lib/chatData";
import ChatHistoryBox from "layouts/rtl/components/ChatHistoryBox";
import TodoTracker from "components/TodoTracker";
import getApiBase from "lib/apiBase";

function Assistance() {
  const { gradients } = colors;
  const { cardContent } = gradients;
  const [, dispatch] = useVisionUIController();

  // Chat state for DoctorAssistant
  const CHAT_HISTORY_KEY = "doctorAssistantHistory";
  const initialMessage = [
    { sender: "ai", text: "Hello! I'm your Medical Assistant. Describe your symptoms and I'll help you understand what you might have or suggest possible medication." }
  ];
  const [messages, setMessages] = useState(initialMessage);
  const [history, setHistory] = useState(() => {
    const stored = localStorage.getItem(CHAT_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  // Changing the direction to rtl
  useEffect(() => {
    setDirection(dispatch, "ltr");
    return () => setDirection(dispatch, "ltr");
  }, []);

  // File upload state and handlers
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [analysis, setAnalysis] = useState([]); // {name,type,result,loading,error}
  const [analyzing, setAnalyzing] = useState(false);
  const [sendingAnalysis, setSendingAnalysis] = useState(false);
  const fileInputRef = useRef(null);
  const API_URL = getApiBase();

  // New Chat handler
  const handleNewChat = () => {
    const userMessages = messages.filter(m => m.sender === "user");
    const aiMessages = messages.filter(m => m.sender === "ai" && m.text !== initialMessage[0].text);
    if (userMessages.length > 0 && aiMessages.length > 0) {
      const newHistory = [{ conversation: messages }, ...history].slice(0, 20);
      setHistory(newHistory);
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(newHistory));
    }
    setMessages(initialMessage);
  };

  // Restore chat from history
  const handleRestoreChat = (conversation) => {
    setMessages(conversation);
  };

  // Delete chat from history
  const handleDeleteChat = (idx) => {
    const newHistory = history.filter((_, i) => i !== idx);
    setHistory(newHistory);
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(newHistory));
  };

  const handleFiles = async (files) => {
    const fileArr = Array.from(files);
    setUploadedFiles((prev) => [...prev, ...fileArr]);
    // Kick off analysis for each new file
    setAnalyzing(true);
    const newRows = fileArr.map(f => ({ name: f.name, type: f.type, loading: true }));
    setAnalysis(prev => [...prev, ...newRows]);
    for (let i = 0; i < fileArr.length; i++) {
      const f = fileArr[i];
      try {
        const form = new FormData();
        form.append('file', f, f.name);
        const res = await fetch(`${API_URL}/api/analyze-file`, { method: 'POST', body: form });
        const data = await res.json();
        setAnalysis(prev => {
          // update the first pending row for this file
          const idx = prev.findIndex(r => r.loading && r.name === f.name);
          const next = [...prev];
          const resultText = buildResultSummary(f.name, data);
          next[idx] = { name: f.name, type: data.type || f.type, loading: false, result: resultText, raw: data };
          return next;
        });
      } catch (e) {
        setAnalysis(prev => {
          const idx = prev.findIndex(r => r.loading && r.name === f.name);
          const next = [...prev];
          next[idx] = { name: f.name, type: f.type, loading: false, error: 'Analysis failed' };
          return next;
        });
      }
    }
    setAnalyzing(false);
  };

  const buildResultSummary = (name, data) => {
    if (!data) return `${name}: No result.`;
    if (data.type === 'image') {
      const parts = [];
      if (data.caption) parts.push(`Image description: ${data.caption}`);
      if (data.ocr && data.ocr.trim()) parts.push(`Detected text (OCR):\n${data.ocr.trim().slice(0, 2000)}`);
      return `${name} (image)\n${parts.join('\n\n')}`;
    }
    if (data.type === 'audio' || data.type === 'video') {
      const kind = data.type;
      const t = (data.transcript || '').trim();
      return `${name} (${kind}) transcription:\n${t || 'No speech detected or unavailable.'}`;
    }
    if (data.type === 'text' || data.type === 'pdf') {
      const content = (data.content || '').slice(0, 4000);
      const label = data.type === 'pdf' ? 'pdf text' : 'text';
      return `${name} (${label}) preview:\n${content || '(no extractable text)'}`;
    }
    if (data.type === 'url') {
      const page = data.page || {};
      const lines = [];
      if (page.title) lines.push(`Title: ${page.title}`);
      if (page.description) lines.push(`Description: ${page.description}`);
      if (page.text) lines.push(`Content: ${page.text.slice(0, 4000)}`);
      return `${name} (url)\n${lines.join('\n\n') || 'No readable content found.'}`;
    }
    return `${name}: ${data.info || 'Unsupported file type.'}`;
  };

  const pushAnalysisToChat = async () => {
    if (!analysis.length || sendingAnalysis) return;
    setSendingAnalysis(true);
    try {
      // Safety timer so UI never stays stuck
  let finished = false;
      // Prepare a single user prompt that includes the extracted content so the AI can respond.
      const combined = analysis
        .map(a => a.result || `${a.name}: ${a.error || 'No result'}`)
        .join('\n\n---\n\n')
        .slice(0, 6000);
  const now = Date.now();
  const prompt = `You are analyzing the following extracted content from files. Provide a clear, structured explanation without repeating the full text.\n\nReturn sections with short bullets: 1) What this is, 2) Key points (<=8 bullets), 3) Risks/Red flags (if any), 4) Recommended next steps.\n- Quote only short snippets when necessary.\n- If non-medical, summarize in plain language anyway.\n- Keep it concise (150-250 words).\n\nExtracted content:\n${combined}`;

  // Add the user message immediately so chat updates right away
  // Keep the long extracted content private to the payload; only show a short user message
  const fileNames = analysis.map(a => a.name).filter(Boolean);
  const previewNames = fileNames.slice(0, 3).join(', ');
  const extra = fileNames.length > 3 ? ` and ${fileNames.length - 3} more` : '';
  const visibleUserText = fileNames.length ? `Please analyze my uploaded file(s): ${previewNames}${extra}.` : 'Please analyze the files I uploaded.';
  const userMsg = { sender: 'user', text: visibleUserText, ts: now };
  // Also add a visible placeholder so the user knows the AI is thinking
  const thinkingTs = now + 1;
  const thinkingText = 'Analyzing your files and preparing a summary…';
  setMessages(prev => [...prev, userMsg, { sender: 'ai', text: thinkingText, ts: thinkingTs }]);

  // Call the smart assistant directly to obtain an actual AI reply.
  const payload = { messages: [{ role: 'user', content: prompt }] };
      let aiText = '';
      try {
        // Abort after 20s to avoid hanging UI
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 20000);
        async function callOnce() {
          const resp = await fetch(`${API_URL}/api/assistant-smart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: controller.signal,
          }).finally(() => clearTimeout(timer));
          let data = null;
          try { data = await resp.json(); } catch (_) { data = null; }
          return { resp, data };
        }
        let { resp, data } = await callOnce();
        if (!resp.ok && data && data.error === 'rate_limit_exceeded') {
          const wait = typeof data.retryAfter === 'number' ? Math.min(45, data.retryAfter) : 20;
          // one-time retry
          setMessages(prev => [...prev, { sender: 'ai', text: `Rate limited — retrying in ~${wait}s…`, ts: Date.now() }]);
          await new Promise(r => setTimeout(r, wait * 1000));
          const controller2 = new AbortController();
          setTimeout(() => controller2.abort(), 20000);
          const r2 = await fetch(`${API_URL}/api/assistant-smart`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: controller2.signal
          });
          let d2 = null; try { d2 = await r2.json(); } catch(_) {}
          resp = r2; data = d2;
        }
        aiText = (data && data.reply) ? data.reply : aiText;
        if (!resp.ok && !aiText && (!data || data.error !== 'rate_limit_exceeded')) {
          aiText = 'The assistant took too long or encountered an error. Here is a brief overview of what was extracted.';
        }
      } catch (_) {
        aiText = 'The assistant request timed out. Here is a brief overview of what was extracted.';
      }

      // Prepare final AI message: never dump the full transcript; provide a compact overview if needed
      const fallbackOverview = (() => {
        // Trim to first ~800 characters across sections to avoid flooding the chat
        const trimmed = combined.slice(0, 800);
        return `Preview of extracted content (first part):\n${trimmed}${combined.length > 800 ? '…' : ''}`;
      })();
      // Normalize spacing/numbering similar to DoctorAssistant
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
              i = j; continue;
            }
            out.push(`${m[1]}.`); continue;
          }
          out.push(line);
        }
        t = out.join('\n').replace(/\n{3,}/g, '\n\n');
        return t;
      }
      const finalText = aiText && aiText.trim() ? formatAiMarkdown(aiText) : fallbackOverview;

      // Replace the thinking placeholder with the final text
      setMessages(prev => {
        const next = [...prev];
        const idx = next.findIndex(m => m.sender === 'ai' && m.ts === thinkingTs && m.text === thinkingText);
        if (idx >= 0) next[idx] = { sender: 'ai', text: finalText, ts: Date.now() };
        else next.push({ sender: 'ai', text: finalText, ts: Date.now() });
        return next;
      });

      if (auth && auth.currentUser) {
        // Persist for signed-in users
        try {
          await addChatMessage({ sender: 'user', text: userMsg.text, tsClient: userMsg.ts });
          await addChatMessage({ sender: 'ai', text: finalText, tsClient: Date.now() });
        } catch (_) { /* ignore */ }
      }
      finished = true;
    } finally {
      setSendingAnalysis(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileInputChange = (e) => {
    handleFiles(e.target.files);
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  return (
    <DashboardLayout>
      {/* Use the same navbar as Dashboard for identical look and behavior */}
      <DashboardNavbar />
      <VuiBox py={3}>
        <VuiBox mb={3}>
          {/* Removed 4 MiniStatisticsCard boxes as requested */}
        </VuiBox>
        <VuiBox mb={3}>
          <Grid container spacing="18px" alignItems="stretch">
            <Grid item xs={12} lg={4} xl={4} sx={{ display: 'flex' }}>
              <Box sx={{ width: '100%' }}>
        <WelcomeMark height={420} />
              </Box>
            </Grid>
            <Grid item xs={12} lg={4} xl={4} sx={{ display: 'flex' }}>
              <Box sx={{ width: '100%' }}>
                <MiniDayCalendar />
              </Box>
            </Grid>
            <Grid item xs={12} lg={4} xl={4} sx={{ display: 'flex' }}>
              <Box sx={{ width: '100%' }}>
                <ChatHistoryBox history={history} onRestoreChat={handleRestoreChat} onDeleteChat={handleDeleteChat} />
              </Box>
            </Grid>
          </Grid>
        </VuiBox>
        {/* Remove the two top boxes (hello and bar chart), and make the chat box take their space */}
        <VuiBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ minHeight: 900, height: { xs: 900, md: 1100 }, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch', borderRadius: 4, p: { xs: 1, md: 3 }, direction: 'ltr' }}>
                <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <VuiTypography variant="lg" color="white" fontWeight="bold" sx={{ textAlign: 'left' }}>
                    Medical Assistant
                  </VuiTypography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <button onClick={handleNewChat} style={{ background: 'rgba(25, 118, 210, 0.12)', color: '#bdbdbd', border: 'none', borderRadius: 6, padding: '6px 16px 6px 10px', fontWeight: 600, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.2s' }}>
                      <FaRegEdit style={{ fontSize: 22, marginRight: 6 }} />
                      New chat
                    </button>
                  </Box>
                </VuiBox>
                <VuiTypography variant="caption" color="text" mb={2} sx={{ textAlign: 'left' }}>
                  Ask your AI assistant anything about your appointments, prescriptions, or medical workflow.
                </VuiTypography>
                <Box flex={1} minHeight={0} display="flex" flexDirection="column" justifyContent="flex-start">
                  {/* Always run DoctorAssistant in controlled mode so injected messages appear immediately. */}
                  <DoctorAssistant messages={messages} setMessages={setMessages} />
                </Box>
              </Card>
            </Grid>
          </Grid>
        </VuiBox>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            {/* File Upload Box uses same card shell as Daily Calendar/Chat History */}
            <Card
              sx={{
                minHeight: 350,
                display: 'flex',
                flexDirection: 'column',
                p: { xs: 2, md: 3 },
                height: '100%',
                color: 'white',
                cursor: 'default',
              }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
                accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.zip,.rar,.7z,.ppt,.pptx,.mp4,.mp3,.wav,.json,.xml,.html,.js,.jsx,.ts,.tsx,.py,.java,.c,.cpp,.h,.hpp,.md,.svg,.gif,.bmp,.webp,.ico,.heic,.mov,.avi,.mkv,.webm,.rtf,.odt,.ods,.odp,.pages,.numbers,.key"
              />
              <Box sx={{ mb: 2 }}>
                <VuiTypography variant="lg" color="white" fontWeight="bold">
                  Upload Files or Images        
                </VuiTypography>
                <VuiTypography variant="caption" color="text" sx={{ ml: 1.5 }}>
                       Drag and drop files here, or click to select files
                </VuiTypography>
              </Box>
              <Box onClick={openFileDialog} sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                border: '2px dashed rgba(255,255,255,0.18)',
                borderRadius: 3,
                minHeight: 180,
                px: 2,
              }}>
                <VuiTypography variant="button" color="text">Drop files here or click anywhere in this box</VuiTypography>
              </Box>

              {uploadedFiles.length > 0 && (
                <Box mt={2} width="100%">
                  <VuiTypography variant="caption" color="white" fontWeight="bold" mb={1}>
                    Uploaded Files:
                  </VuiTypography>
                  <Stack direction="row" flexWrap="wrap" spacing={2}>
                    {uploadedFiles.map((file, idx) => (
                      <Box key={idx} sx={{ position: 'relative', m: 1, p: 1, border: '1px solid #444', borderRadius: 2, background: '#22284a', minWidth: 160, maxWidth: 220, textAlign: 'center' }}>
                        {file.type.startsWith('image') ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 4, marginBottom: 4 }}
                          />
                        ) : (
                          <Box sx={{ height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>
                            <span role="img" aria-label="file">📄</span>
                          </Box>
                        )}
                        {/* Delete file button */}
                        <button
                          title="Remove file"
                          onClick={(e) => {
                            e.stopPropagation();
                            setUploadedFiles(prev => prev.filter((_, i) => i !== idx));
                            setAnalysis(prev => prev.filter((_, i) => i !== idx));
                          }}
                          style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: 6, border: '1px solid #555', background: 'rgba(0,0,0,0.45)', color: '#fff', lineHeight: '18px', cursor: 'pointer' }}
                        >
                          ×
                        </button>
                        <VuiTypography variant="caption" color="white" sx={{ wordBreak: 'break-all' }}>
                          {file.name}
                        </VuiTypography>
                        {/* Inline result preview */}
                        {analysis[idx] && (
                          <VuiTypography variant="caption" color="text" sx={{ display: 'block', mt: 0.5, textAlign: 'left', whiteSpace: 'pre-wrap', maxHeight: 150, overflowY: 'auto' }}>
                            {analysis[idx].loading ? 'Analyzing…' : (analysis[idx].error ? analysis[idx].error : (analysis[idx].result || ''))}
                          </VuiTypography>
                        )}
                      </Box>
                    ))}
                  </Stack>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                    <button
                      disabled={!analysis.length || analyzing || sendingAnalysis}
                      onClick={(e) => { e.stopPropagation(); pushAnalysisToChat(); }}
                      style={{ background: 'rgba(25, 118, 210, 0.12)', color: '#bdbdbd', border: 'none', borderRadius: 6, padding: '6px 12px', fontWeight: 600, fontSize: 14, cursor: (!analysis.length || analyzing || sendingAnalysis) ? 'not-allowed' : 'pointer' }}
                    >
                      {sendingAnalysis ? 'Sending…' : 'Send analysis to chat'}
                    </button>
                    {analyzing && <span style={{ fontSize: 12, color: '#aaa' }}>Analyzing files…</span>}
                  </Box>
                </Box>
              )}
              {/* Link analysis input removed; use chat box for links */}
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            {/* Replace OrderOverview with TodoTracker */}
            <Box sx={{ height: 420, maxHeight: 420, minHeight: 350, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <TodoTracker />
            </Box>
          </Grid>
        </Grid>
      </VuiBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Assistance;
