import { Card, Stack, Box } from "@mui/material";
// @mui material components
import Grid from "@mui/material/Grid";
import colors from "assets/theme/base/colors";

// Vision UI Dashboard React base styles
import linearGradient from "assets/theme/functions/linearGradient";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiProgress from "components/VuiProgress";
import VuiTypography from "components/VuiTypography";

// Vision UI Dashboard React contexts
import { setDirection, useVisionUIController } from "context";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import BarChart from "examples/Charts/BarCharts/BarChart";

// Data
import LineChart from "examples/Charts/LineCharts/LineChart";
import Footer from "examples/Footer";

// Vision UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import OrderOverview from "layouts/rtl/components/OrderOverview";
import Projects from "layouts/rtl/components/Projects";
import ReferralTracking from "layouts/rtl/components/ReferralTracking";
import SatisfactionRate from "layouts/rtl/components/SatisfactionRate";

// Dashboard layout components
import WelcomeMark from "layouts/rtl/components/WelcomeMark";
import { barChartDataDashboard } from "layouts/rtl/data/barChartData";
import { barChartOptionsDashboard } from "layouts/rtl/data/barChartOptions";
import { lineChartDataDashboard } from "layouts/rtl/data/lineChartData";
import { lineChartOptionsDashboard } from "layouts/rtl/data/lineChartOptions";
import { useEffect, useState, useRef } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";

// React icons
import { IoIosRocket } from "react-icons/io";
import { IoBuild, IoDocumentText, IoGlobe, IoWallet } from "react-icons/io5";
import DoctorAssistant from "components/DoctorAssistant";
import ChatHistoryBox from "./components/ChatHistoryBox";
import TodoTracker from "components/TodoTracker";
import MiniDayCalendar from "components/MiniDayCalendar";

function RTL() {
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
  const [compact, setCompact] = useState(false);

  // Add selectedDate state synced with context
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Changing the direction to rtl
  useEffect(() => {
    setDirection(dispatch, "ltr");
    return () => setDirection(dispatch, "ltr");
  }, []);

  // File upload state and handlers
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

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

  // Add handler for deleting chat history
  const handleDeleteChat = (idx) => {
    const newHistory = history.filter((_, i) => i !== idx);
    setHistory(newHistory);
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(newHistory));
  };

  const handleFiles = (files) => {
    const fileArr = Array.from(files);
    setUploadedFiles((prev) => [...prev, ...fileArr]);
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
      <DashboardNavbar />
      <VuiBox py={3}>
        <VuiBox mb={3}>
          {/* Removed 4 MiniStatisticsCard boxes as requested */}
        </VuiBox>
        <VuiBox mb={3}>
          <Grid container spacing="18px">
            <Grid item xs={12} xl={5}>
              <WelcomeMark />
            </Grid>
            <Grid item xs={12} xl={3}>
              <MiniDayCalendar />
            </Grid>
            <Grid item xs={12} xl={4}>
              <ChatHistoryBox history={history} onRestoreChat={handleRestoreChat} onDeleteChat={handleDeleteChat} />
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
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#bdbdbd', fontSize: 13, cursor: 'pointer', userSelect: 'none' }}>
                      <input type="checkbox" checked={compact} onChange={(e) => setCompact(e.target.checked)} style={{ appearance: 'none', width: 34, height: 20, borderRadius: 12, background: compact ? 'rgba(106,106,252,0.6)' : 'rgba(255,255,255,0.15)', position: 'relative', outline: 'none', transition: 'background 0.2s' }} />
                      <span style={{ position: 'relative', marginLeft: -34, width: 34, height: 20, pointerEvents: 'none' }}>
                        <span style={{ position: 'absolute', top: 2, left: compact ? 18 : 2, width: 16, height: 16, borderRadius: 16, background: '#fff', transition: 'left 0.2s' }}></span>
                      </span>
                      <span>Compact</span>
                    </label>
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
                  <DoctorAssistant messages={messages} setMessages={setMessages} compact={compact} />
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
                cursor: 'pointer',
              }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={openFileDialog}
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
              <Box sx={{
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
                      <Box key={idx} sx={{ m: 1, p: 1, border: '1px solid #444', borderRadius: 2, background: '#22284a', minWidth: 100, maxWidth: 120, textAlign: 'center' }}>
                        {file.type.startsWith('image') ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            style={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 4, marginBottom: 4 }}
                          />
                        ) : (
                          <Box sx={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>
                            <span role="img" aria-label="file">📄</span>
                          </Box>
                        )}
                        <VuiTypography variant="caption" color="white" sx={{ wordBreak: 'break-all' }}>
                          {file.name}
                        </VuiTypography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
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

export default RTL;
