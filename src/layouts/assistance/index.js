
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
import ChatHistoryBox from "layouts/rtl/components/ChatHistoryBox";
import TodoTracker from "components/TodoTracker";

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
      {/* Use the same navbar as Dashboard for identical look and behavior */}
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
            <Grid item xs={12} lg={6} xl={3}>
              <MiniDayCalendar />
            </Grid>
            <Grid item xs={12} lg={6} xl={4}>
              <ChatHistoryBox history={history} onRestoreChat={handleRestoreChat} />
            </Grid>
          </Grid>
        </VuiBox>
        {/* Remove the two top boxes (hello and bar chart), and make the chat box take their space */}
        <VuiBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ minHeight: 900, height: { xs: 900, md: 1100 }, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch', background: 'rgba(34, 40, 74, 0.85)', boxShadow: 8, borderRadius: 4, p: { xs: 1, md: 3 }, direction: 'ltr', position: 'relative' }}>
                <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <VuiTypography variant="lg" color="white" fontWeight="bold" sx={{ textAlign: 'left' }}>
                    Medical Assistant
                  </VuiTypography>
                  <button onClick={handleNewChat} style={{ background: 'rgba(25, 118, 210, 0.12)', color: '#bdbdbd', border: 'none', borderRadius: 6, padding: '6px 16px 6px 10px', fontWeight: 600, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.2s' }}>
                    <FaRegEdit style={{ fontSize: 22, marginRight: 6 }} />
                    New chat
                  </button>
                </VuiBox>
                <VuiTypography variant="caption" color="text" mb={2} sx={{ textAlign: 'left' }}>
                  Ask your AI assistant anything about your appointments, prescriptions, or medical workflow.
                </VuiTypography>
                <Box flex={1} minHeight={0} display="flex" flexDirection="column" justifyContent="flex-end">
                  <DoctorAssistant messages={messages} setMessages={setMessages} />
                </Box>
              </Card>
            </Grid>
          </Grid>
        </VuiBox>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            {/* File Upload Box replaces Projects */}
            <Card
              sx={{
                minHeight: 350,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(34, 40, 74, 0.85)',
                boxShadow: 8,
                borderRadius: 4,
                p: { xs: 2, md: 4 },
                border: '2px dashed #6C63FF',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
                color: 'white',
                textAlign: 'center',
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
              <VuiTypography variant="lg" color="white" fontWeight="bold" mb={1}>
                Upload Files or Images
              </VuiTypography>
              <VuiTypography variant="caption" color="text" mb={2}>
                Drag and drop files here, or click to select files
              </VuiTypography>
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

export default Assistance;
