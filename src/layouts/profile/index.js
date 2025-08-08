// @mui material components
// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import team1 from "assets/images/avatar1.png";
import team2 from "assets/images/avatar2.png";
import team3 from "assets/images/avatar3.png";
import team4 from "assets/images/avatar4.png";
// Images
import profile1 from "assets/images/profile-1.png";
import profile2 from "assets/images/profile-2.png";
import profile3 from "assets/images/profile-3.png";
import teamImage from "assets/images/team-1.jpg";
import recordImage from "assets/images/billbackground.jpg";
import communicationImage from "assets/images/avatar-simmmple.png";
// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
import Footer from "examples/Footer";
// Vision UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// Overview page components
import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";
import Welcome from "../profile/components/Welcome/index";
import CarInformations from "./components/CarInformations";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import countries from "./countries.json"; // You will need to add a countries.json file with all country names
import { useState } from "react";
import VuiButton from "components/VuiButton";
import MiniDayCalendar from "components/MiniDayCalendar";
import { AppointmentProvider } from "context/AppointmentContext";

function Overview() {
  const [editOpen, setEditOpen] = useState(false);
  const [careTeamOpen, setCareTeamOpen] = useState(false);
  const [recordOpen, setRecordOpen] = useState(false);
  const [communicationOpen, setCommunicationOpen] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "--",
    mobile: "--",   
    email: "--",
    location: "United States",
    dateOfBirth: "yyyy-mm-dd",
    sex: "--",
    bloodType: "--",
    wheelchair: "--",
  });
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
  const handleProfileSave = () => {
    setEditOpen(false);
  };

  // Dialog open states for each section
  const [careTeamDialog, setCareTeamDialog] = useState(false);
  const [recordDialog, setRecordDialog] = useState(false);
  const [communicationDialog, setCommunicationDialog] = useState(false);

  // Add state for chat popup and chat logic
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [chatMessages, setChatMessages] = useState({}); // { doctorName: [ {from, text, time} ] }
  const [chatInput, setChatInput] = useState("");
  const doctors = ["Dr. Smith", "Dr. Lee", "Dr. Patel"];

  // Handler to open chat with a doctor
  const handleOpenChat = (doctor) => {
    setSelectedDoctor(doctor);
    setChatOpen(true);
  };
  const handleCloseChat = () => {
    setChatOpen(false);
    setSelectedDoctor(null);
    setChatInput("");
  };
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => ({
      ...prev,
      [selectedDoctor]: [
        ...(prev[selectedDoctor] || []),
        { from: "You", text: chatInput, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
      ]
    }));
    setChatInput("");
  };

  // Adjust image style to show only a thin horizontal strip (e.g., 36px tall)
  const cardImageStyle = { objectFit: "cover", objectPosition: "top", height: 36 };

  return (
    <AppointmentProvider>
      <DashboardLayout>
        <Header />
        <VuiBox mt={5} mb={3}>
          <Grid
            container
            spacing={3}
            sx={({ breakpoints }) => ({
              [breakpoints.only("xl")]: {
                gridTemplateColumns: "repeat(2, 1fr)",
              },
            })}
          >
            <Grid
              item
              xs={12}
              xl={8}
              xxl={9}
              sx={({ breakpoints }) => ({
                minHeight: "400px",
                [breakpoints.only("xl")]: {
                  gridArea: "1 / 1 / 2 / 2",
                },
              })}
            >
              <CarInformations />
            </Grid>
            <Grid
              item
              xs={12}
              xl={4}
              xxl={3}
              sx={({ breakpoints }) => ({
                [breakpoints.only("xl")]: {
                  gridArea: "1 / 2 / 2 / 3",
                },
              })}
            >
              <ProfileInfoCard
                title="profile"
                description=""
                info={profile}
                onEdit={handleEditOpen}
              >
                <VuiBox mt={2} mb={2} p={2} borderRadius={3} sx={{ background: '#0a0c1b', minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  {/* Make all text in profile box the same size */}
                  <VuiTypography color="white" fontWeight="bold" fontSize={16} mb={0.5}>
                    
                  </VuiTypography>
                  <VuiTypography color="white" fontWeight="bold" fontSize={16} mb={0.5}>
                    
                  </VuiTypography>
                  <svg width="80" height="24" viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 18L8 14L16 16L24 10L32 12L40 8L48 14L56 12L64 16L72 10L80 12" stroke="#00FFD0" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  </svg>
                </VuiBox>
              </ProfileInfoCard>

              <Dialog
                open={editOpen}
                onClose={handleEditClose}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                  style: {
                    background: 'rgba(20, 22, 40, 0.75)',
                    borderRadius: 18,
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                    padding: '18px 10px',
                    color: '#fff',
                    backdropFilter: 'blur(8px)',
                  }
                }}
              >
                <DialogTitle sx={{ color: '#fff', fontWeight: 700, fontSize: '1.15rem', pb: 1, letterSpacing: 0.2 }}>
                  Edit Profile
                </DialogTitle>
                <DialogContent sx={{ color: '#fff', pb: 2, pt: 1 }}>
                  <Box mb={2}>
                    <Typography sx={{ color: '#a6b1e1', fontWeight: 600, fontSize: '1rem', mb: 1, letterSpacing: 0.5 }}>Contact Information</Typography>
                    <TextField
                      margin="dense"
                      label="Full Name"
                      name="fullName"
                      value={profile.fullName}
                      onChange={handleProfileChange}
                      fullWidth
                      variant="outlined"
                      placeholder="Enter your full name"
                      sx={{
                        background: '#181a2f',
                        borderRadius: 2,
                        border: '2px solid #23244a',
                        input: { color: '#fff', fontWeight: 500 },
                        label: { color: '#a6b1e1', fontSize: '0.95rem' },
                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        '& .MuiOutlinedInput-root': { background: '#181a2f', borderRadius: 2 },
                      }}
                    />
                    <TextField
                      margin="dense"
                      label="Mobile"
                      name="mobile"
                      value={profile.mobile}
                      onChange={handleProfileChange}
                      fullWidth
                      variant="outlined"
                      placeholder="Enter your mobile number"
                      sx={{
                        background: '#181a2f',
                        borderRadius: 2,
                        border: '2px solid #23244a',
                        input: { color: '#fff', fontWeight: 500 },
                        label: { color: '#a6b1e1', fontSize: '0.95rem' },
                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        '& .MuiOutlinedInput-root': { background: '#181a2f', borderRadius: 2 },
                      }}
                    />
                    <TextField
                      margin="dense"
                      label="Email"
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      fullWidth
                      variant="outlined"
                      placeholder="Enter your email"
                      sx={{
                        background: '#181a2f',
                        borderRadius: 2,
                        border: '2px solid #23244a',
                        input: { color: '#fff', fontWeight: 500 },
                        label: { color: '#a6b1e1', fontSize: '0.95rem' },
                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        '& .MuiOutlinedInput-root': { background: '#181a2f', borderRadius: 2 },
                      }}
                    />
                  </Box>
                  <Box mb={2}>
                    <Typography sx={{ color: '#a6b1e1', fontWeight: 600, fontSize: '1rem', mb: 1, letterSpacing: 0.5 }}>Details</Typography>
                    <TextField
                      margin="dense"
                      label="Location"
                      name="location"
                      select
                      value={profile.location}
                      onChange={handleProfileChange}
                      fullWidth
                      sx={{ select: { background: '#181a2f', color: '#fff', borderRadius: 2, border: '2px solid #23244a', fontWeight: 500 }, label: { color: '#a6b1e1', fontSize: '0.95rem' } }}
                      SelectProps={{
                        native: false,
                        MenuProps: {
                          PaperProps: {
                            sx: {
                              maxHeight: 300,
                              background: '#181a2f',
                              color: '#fff',
                              '& .MuiMenu-list': {
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#888 #222',
                              },
                              '&::-webkit-scrollbar': {
                                width: '6px',
                                background: '#222',
                              },
                              '&::-webkit-scrollbar-thumb': {
                                background: '#888',
                                borderRadius: '4px',
                              },
                            },
                          },
                        },
                      }}
                    >
                      {countries.map((country) => (
                        <MenuItem key={country} value={country} sx={{ background: '#181a2f', color: '#fff' }}>{country}</MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      margin="dense"
                      label="Date of Birth"
                      name="dateOfBirth"
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={handleProfileChange}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      placeholder="yyyy-mm-dd"
                      sx={{ input: { background: '#181a2f', color: '#fff', borderRadius: 2, border: '2px solid #23244a', fontWeight: 500 }, label: { color: '#a6b1e1', fontSize: '0.95rem' } }}
                    />
                    <TextField
                      margin="dense"
                      label="Sex"
                      name="sex"
                      select
                      value={profile.sex}
                      onChange={handleProfileChange}
                      fullWidth
                      sx={{ select: { background: '#181a2f', color: '#fff', borderRadius: 2, border: '2px solid #23244a', fontWeight: 500 }, label: { color: '#a6b1e1', fontSize: '0.95rem' } }}
                      SelectProps={{
                        native: false,
                        MenuProps: {
                          PaperProps: {
                            sx: {
                              maxHeight: 200,
                              background: '#181a2f',
                              color: '#fff',
                              '& .MuiMenu-list': {
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#888 #222',
                              },
                              '&::-webkit-scrollbar': {
                                width: '6px',
                                background: '#222',
                              },
                              '&::-webkit-scrollbar-thumb': {
                                background: '#888',
                                borderRadius: '4px',
                              },
                            },
                          },
                        },
                      }}
                    >
                      <MenuItem value="Male" sx={{ background: '#181a2f', color: '#fff' }}>Male</MenuItem>
                      <MenuItem value="Female" sx={{ background: '#181a2f', color: '#fff' }}>Female</MenuItem>
                      <MenuItem value="Other" sx={{ background: '#181a2f', color: '#fff' }}>Other</MenuItem>
                    </TextField>
                    <TextField
                      margin="dense"
                      label="Blood Type"
                      name="bloodType"
                      select
                      value={profile.bloodType}
                      onChange={handleProfileChange}
                      fullWidth
                      sx={{ select: { background: '#181a2f', color: '#fff', borderRadius: 2, border: '2px solid #23244a', fontWeight: 500 }, label: { color: '#a6b1e1', fontSize: '0.95rem' } }}
                      SelectProps={{
                        native: false,
                        MenuProps: {
                          PaperProps: {
                            sx: {
                              maxHeight: 200,
                              background: '#181a2f',
                              color: '#fff',
                              '& .MuiMenu-list': {
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#888 #222',
                              },
                              '&::-webkit-scrollbar': {
                                width: '6px',
                                background: '#222',
                              },
                              '&::-webkit-scrollbar-thumb': {
                                background: '#888',
                                borderRadius: '4px',
                              },
                            },
                          },
                        },
                      }}
                    >
                      <MenuItem value="O+" sx={{ background: '#181a2f', color: '#fff' }}>O+</MenuItem>
                      <MenuItem value="O-" sx={{ background: '#181a2f', color: '#fff' }}>O-</MenuItem>
                      <MenuItem value="A+" sx={{ background: '#181a2f', color: '#fff' }}>A+</MenuItem>
                      <MenuItem value="A-" sx={{ background: '#181a2f', color: '#fff' }}>A-</MenuItem>
                      <MenuItem value="B+" sx={{ background: '#181a2f', color: '#fff' }}>B+</MenuItem>
                      <MenuItem value="B-" sx={{ background: '#181a2f', color: '#fff' }}>B-</MenuItem>
                      <MenuItem value="AB+" sx={{ background: '#181a2f', color: '#fff' }}>AB+</MenuItem>
                      <MenuItem value="AB-" sx={{ background: '#181a2f', color: '#fff' }}>AB-</MenuItem>
                    </TextField>
                    <TextField
                      margin="dense"
                      label="Wheelchair"
                      name="wheelchair"
                      select
                      value={profile.wheelchair}
                      onChange={handleProfileChange}
                      fullWidth
                      sx={{ select: { background: '#181a2f', color: '#fff', borderRadius: 2, border: '2px solid #23244a', fontWeight: 500 }, label: { color: '#a6b1e1', fontSize: '0.95rem' } }}
                      SelectProps={{
                        native: false,
                        MenuProps: {
                          PaperProps: {
                            sx: {
                              maxHeight: 200,
                              background: '#181a2f',
                              color: '#fff',
                              '& .MuiMenu-list': {
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#888 #222',
                              },
                              '&::-webkit-scrollbar': {
                                width: '6px',
                                background: '#222',
                              },
                              '&::-webkit-scrollbar-thumb': {
                                background: '#888',
                                borderRadius: '4px',
                              },
                            },
                          },
                        },
                      }}
                    >
                      <MenuItem value="No" sx={{ background: '#181a2f', color: '#fff' }}>No</MenuItem>
                      <MenuItem value="Yes" sx={{ background: '#181a2f', color: '#fff' }}>Yes</MenuItem>
                    </TextField>
                  </Box>
                  <Box mb={2}>
                    <Typography sx={{ color: '#a6b1e1', fontWeight: 600, fontSize: '1rem', mb: 1, letterSpacing: 0.5 }}>Allergies</Typography>
                    <TextField
                      margin="dense"
                      label="Allergies"
                      name="allergies"
                      value={profile.allergies}
                      onChange={handleProfileChange}
                      fullWidth
                      variant="outlined"
                      placeholder="Enter allergies"
                      sx={{
                        background: '#181a2f',
                        borderRadius: 2,
                        border: '2px solid #23244a',
                        input: { color: '#fff', fontWeight: 500 },
                        label: { color: '#a6b1e1', fontSize: '0.95rem' },
                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        '& .MuiOutlinedInput-root': { background: '#181a2f', borderRadius: 2 },
                      }}
                    />
                  </Box>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'flex-end', pb: 1 }}>
                  <Button onClick={handleEditClose} sx={{ color: '#a259ec', background: 'transparent', borderRadius: 2, px: 2, mr: 1, fontWeight: 500, textTransform: 'none' }}>
                    Close
                  </Button>
                  <Button onClick={handleProfileSave} sx={{ color: '#fff', background: 'linear-gradient(90deg, #3a8dde 0%, #6f7cf7 100%)', borderRadius: 2, px: 2, fontWeight: 600, textTransform: 'none' }}>
                    Save
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>
          </Grid>
        </VuiBox>
        <Grid container spacing={3} mb="30px">
          <Grid item xs={12} xl={3} height="100%">
            <PlatformSettings />
          </Grid>
          <Grid item xs={12} xl={9}>
            <Card>
              <VuiBox display="flex" flexDirection="column" height="100%">
                <VuiBox display="flex" flexDirection="column" mb="24px">
                  <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">
                    Settings
                  </VuiTypography>
                  <VuiTypography color="text" variant="button" fontWeight="regular">
                    Center your health and wellness with personalized care and support.
                  </VuiTypography>
                </VuiBox>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6} xl={4}>
                    <VuiBox
                      sx={{
                        backgroundImage: `url(${recordImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'top',
                        borderRadius: 3,
                        height: 48,
                        width: 'fit-content',
                        minWidth: 180,
                        maxWidth: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        px: 2,
                        mb: 1.5,
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <VuiBox
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          background: 'rgba(30,32,60,0.55)',
                          zIndex: 1,
                          borderRadius: 3,
                          backdropFilter: 'blur(2px)',
                        }}
                      />
                      <VuiTypography color="white" variant="h5" fontWeight="bold" sx={{ position: 'relative', zIndex: 2 }}>
                        Care Team
                      </VuiTypography>
                    </VuiBox>
                    <VuiBox display="flex" flexDirection="column" gap={1} mb={1}>
                      <VuiBox sx={{
                        display: 'flex', flexDirection: 'column', gap: 1,
                        background: 'rgba(30, 32, 60, 0.5)',
                        borderRadius: 3,
                        p: 2,
                        boxShadow: '0 2px 12px 0 rgba(0,0,0,0.08)',
                      }}>
                        <VuiButton color="white" variant="outlined" size="medium" sx={{background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', fontWeight: 500, letterSpacing: 0.5, transition: 'background 0.2s', '&:hover': {background: 'rgba(0,255,208,0.12)', color: '#00FFD0'} }} onClick={() => setCareTeamDialog(true)}>View Care Team</VuiButton>
                        <VuiButton color="white" variant="outlined" size="medium" sx={{background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', fontWeight: 500, letterSpacing: 0.5, transition: 'background 0.2s', '&:hover': {background: 'rgba(0,255,208,0.12)', color: '#00FFD0'} }} onClick={() => setCareTeamDialog(true)}>Search for Provider</VuiButton>
                        <VuiButton color="white" variant="outlined" size="medium" sx={{background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', fontWeight: 500, letterSpacing: 0.5, transition: 'background 0.2s', '&:hover': {background: 'rgba(0,255,208,0.12)', color: '#00FFD0'} }} onClick={() => setCareTeamDialog(true)}>Schedule Appointment</VuiButton>
                        <VuiButton color="white" variant="outlined" size="medium" sx={{background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', fontWeight: 500, letterSpacing: 0.5, transition: 'background 0.2s', '&:hover': {background: 'rgba(0,255,208,0.12)', color: '#00FFD0'} }} onClick={() => setCareTeamDialog(true)}>Find Urgent Care</VuiButton>
                        <VuiButton color="white" variant="outlined" size="medium" sx={{background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', fontWeight: 500, letterSpacing: 0.5, transition: 'background 0.2s', '&:hover': {background: 'rgba(0,255,208,0.12)', color: '#00FFD0'} }} onClick={() => setCareTeamDialog(true)}>Insurance</VuiButton>
                      </VuiBox>
                    </VuiBox>
                    <VuiBox display="flex" flexDirection="column" gap={1}>
                      <VuiButton color="white" variant="outlined" size="medium" sx={{opacity: 0.7, border: '1px solid #222', fontWeight: 600}} onClick={() => setCareTeamDialog(true)}>VIEW ALL</VuiButton>
                    </VuiBox>
                  </Grid>
                  <Grid item xs={12} md={6} xl={4}>
                    <VuiBox
                      sx={{
                        backgroundImage: `url(${recordImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'top',
                        borderRadius: 3,
                        height: 48,
                        width: 'fit-content',
                        minWidth: 180,
                        maxWidth: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        px: 2,
                        mb: 1.5,
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <VuiBox
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          background: 'rgba(30,32,60,0.55)',
                          zIndex: 1,
                          borderRadius: 3,
                          backdropFilter: 'blur(2px)',
                        }}
                      />
                      <VuiTypography color="white" variant="h5" fontWeight="bold" sx={{ position: 'relative', zIndex: 2 }}>
                        Record
                      </VuiTypography>
                    </VuiBox>
                    <VuiBox display="flex" flexDirection="column" gap={1} mb={1}>
                      <VuiBox sx={{
                        display: 'flex', flexDirection: 'column', gap: 1,
                        background: 'rgba(30, 32, 60, 0.5)',
                        borderRadius: 3,
                        p: 2,
                        boxShadow: '0 2px 12px 0 rgba(0,0,0,0.08)',
                      }}>
                        <VuiButton color="white" variant="outlined" size="medium" sx={{background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', fontWeight: 500, letterSpacing: 0.5, transition: 'background 0.2s', '&:hover': {background: 'rgba(0,255,208,0.12)', color: '#00FFD0'} }} onClick={() => setRecordDialog(true)}>Visits</VuiButton>
                        <VuiButton color="white" variant="outlined" size="medium" sx={{background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', fontWeight: 500, letterSpacing: 0.5, transition: 'background 0.2s', '&:hover': {background: 'rgba(0,255,208,0.12)', color: '#00FFD0'} }} onClick={() => setRecordDialog(true)}>Test Results</VuiButton>
                        <VuiButton color="white" variant="outlined" size="medium" sx={{background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', fontWeight: 500, letterSpacing: 0.5, transition: 'background 0.2s', '&:hover': {background: 'rgba(0,255,208,0.12)', color: '#00FFD0'} }} onClick={() => setRecordDialog(true)}>End of Life Planning</VuiButton>
                        <VuiButton color="white" variant="outlined" size="medium" sx={{background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', fontWeight: 500, letterSpacing: 0.5, transition: 'background 0.2s', '&:hover': {background: 'rgba(0,255,208,0.12)', color: '#00FFD0'} }} onClick={() => setRecordDialog(true)}>Medical and Family History</VuiButton>
                        <VuiButton color="white" variant="outlined" size="medium" sx={{background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', fontWeight: 500, letterSpacing: 0.5, transition: 'background 0.2s', '&:hover': {background: 'rgba(0,255,208,0.12)', color: '#00FFD0'} }} onClick={() => setRecordDialog(true)}>Preventive Care</VuiButton>
                      </VuiBox>
                    </VuiBox>
                    <VuiBox display="flex" flexDirection="column" gap={1}>
                      <VuiButton color="white" variant="outlined" size="medium" sx={{opacity: 0.7, border: '1px solid #222', fontWeight: 600}} onClick={() => setRecordDialog(true)}>VIEW ALL</VuiButton>
                    </VuiBox>
                  </Grid>
                  <Grid item xs={12} md={6} xl={4}>
                    <VuiBox
                      sx={{
                        backgroundImage: `url(${recordImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'top',
                        borderRadius: 3,
                        height: 48,
                        width: 'fit-content',
                        minWidth: 180,
                        maxWidth: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        px: 2,
                        mb: 1.5,
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <VuiBox
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          background: 'rgba(30,32,60,0.55)',
                          zIndex: 1,
                          borderRadius: 3,
                          backdropFilter: 'blur(2px)',
                        }}
                      />
                      <VuiTypography color="white" variant="h5" fontWeight="bold" sx={{ position: 'relative', zIndex: 2 }}>
                        Communication
                      </VuiTypography>
                    </VuiBox>
                    <VuiBox display="flex" flexDirection="column" gap={1} mb={1}>
                      <VuiBox sx={{
                        display: 'flex', flexDirection: 'column', gap: 1,
                        background: 'rgba(30, 32, 60, 0.5)',
                        borderRadius: 3,
                        p: 2,
                        boxShadow: '0 2px 12px 0 rgba(0,0,0,0.08)',
                      }}>
                        <VuiButton color="white" variant="outlined" size="medium" sx={{background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', fontWeight: 500, letterSpacing: 0.5, transition: 'background 0.2s', '&:hover': {background: 'rgba(0,255,208,0.12)', color: '#00FFD0'} }} onClick={() => setCommunicationDialog(true)}>Messages</VuiButton>
                        <VuiButton color="white" variant="outlined" size="medium" sx={{background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', fontWeight: 500, letterSpacing: 0.5, transition: 'background 0.2s', '&:hover': {background: 'rgba(0,255,208,0.12)', color: '#00FFD0'} }} onClick={() => setCommunicationDialog(true)}>Ask Questions</VuiButton>
                        <VuiButton color="white" variant="outlined" size="medium" sx={{background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', fontWeight: 500, letterSpacing: 0.5, transition: 'background 0.2s', '&:hover': {background: 'rgba(0,255,208,0.12)', color: '#00FFD0'} }} onClick={() => setCommunicationDialog(true)}>Letters</VuiButton>
                        <VuiButton color="white" variant="outlined" size="medium" sx={{background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', fontWeight: 500, letterSpacing: 0.5, transition: 'background 0.2s', '&:hover': {background: 'rgba(0,255,208,0.12)', color: '#00FFD0'} }} onClick={() => setCommunicationDialog(true)}>Community Resources</VuiButton>
                        <VuiButton color="white" variant="outlined" size="medium" sx={{background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', fontWeight: 500, letterSpacing: 0.5, transition: 'background 0.2s', '&:hover': {background: 'rgba(0,255,208,0.12)', color: '#00FFD0'} }} onClick={() => setCommunicationDialog(true)}>Report Problems</VuiButton>
                      </VuiBox>
                    </VuiBox>
                    <VuiBox display="flex" flexDirection="column" gap={1}>
                      <VuiButton color="white" variant="outlined" size="medium" sx={{opacity: 0.7, border: '1px solid #222', fontWeight: 600}} onClick={() => setCommunicationDialog(true)}>VIEW ALL</VuiButton>
                    </VuiBox>
                  </Grid>
                </Grid>
              </VuiBox>
            </Card>
          </Grid>
        </Grid>

        <Footer />

        {/* Dialogs for each section */}
        <Dialog open={careTeamDialog} onClose={() => setCareTeamDialog(false)} maxWidth="md" fullWidth
          PaperProps={{sx:{backgroundColor:'rgba(30,32,60,0.7)',boxShadow:24,borderRadius:3,color:'white',minWidth:500,maxWidth:800,backdropFilter:'blur(4px)'}}}>
          <DialogTitle sx={{ fontSize: 22, fontWeight: 700, color: '#fff', mb: 1 }}>Care Team</DialogTitle>
          <DialogContent>
            <VuiTypography color="text" variant="button" mb={2} sx={{ fontSize: 16 }}>Enter doctor and pharmacy for your care team, assign insurance, and manage appointments.</VuiTypography>
            <VuiBox mb={2}>
              <VuiTypography color="white" fontWeight="bold" mb={1} sx={{ fontSize: 18 }}>Doctor & Pharmacy</VuiTypography>
              <VuiBox display="flex" alignItems="center" mb={1} gap={2}>
                <TextField size="small" variant="outlined" placeholder="Doctor" sx={{ background: '#181a2f', borderRadius: 1, input: { color: 'white', fontSize: 16 }, width: 160 }} />
                <TextField size="small" variant="outlined" placeholder="Pharmacy" sx={{ background: '#181a2f', borderRadius: 1, input: { color: 'white', fontSize: 16 }, width: 160 }} />
                <Button size="small" color="info" sx={{ fontSize: 15, fontWeight: 600 }}>Save</Button>
              </VuiBox>
            </VuiBox>
            <VuiBox mb={2}>
              <VuiTypography color="white" fontWeight="bold" mb={1} sx={{ fontSize: 18 }}>Insurance</VuiTypography>
              <TextField size="small" variant="outlined" placeholder="Insurance Company" sx={{ background: '#181a2f', borderRadius: 1, input: { color: 'white', fontSize: 16 }, width: 220, mr: 2 }} />
              <Button size="small" color="info" sx={{ fontSize: 15, fontWeight: 600 }}>Assign</Button>
            </VuiBox>
            <VuiBox mb={2}>
              <VuiTypography color="white" fontWeight="bold" mb={1} sx={{ fontSize: 18 }}>Visits</VuiTypography>
              <VuiTypography color="text" sx={{ fontSize: 16 }}>No past visits</VuiTypography>
            </VuiBox>
            <VuiBox mb={2}>
              <VuiTypography color="white" fontWeight="bold" mb={1} sx={{ fontSize: 18 }}>Schedule Appointment</VuiTypography>
              <VuiBox display="flex" alignItems="center" gap={2}>
                <TextField size="small" variant="outlined" placeholder="Date" type="date" sx={{ background: '#181a2f', borderRadius: 1, input: { color: 'white', fontSize: 16 }, width: 150 }} InputLabelProps={{ shrink: true }} />
                <TextField size="small" variant="outlined" placeholder="Reason" sx={{ background: '#181a2f', borderRadius: 1, input: { color: 'white', fontSize: 16 }, width: 220 }} />
                <Button size="small" color="info" sx={{ fontSize: 15, fontWeight: 600 }}>Schedule</Button>
              </VuiBox>
              <VuiTypography color="white" fontWeight="bold" mb={1} mt={2} sx={{ fontSize: 18 }}>Upcoming Appointments</VuiTypography>
              <VuiTypography color="text" sx={{ fontSize: 16 }}>No upcoming appointments</VuiTypography>
            </VuiBox>
            <VuiBox mb={2}>
              <VuiTypography color="white" fontWeight="bold" mb={1} sx={{ fontSize: 18 }}>Search Provider</VuiTypography>
              <VuiBox display="flex" alignItems="center" gap={2}>
                <TextField size="small" variant="outlined" placeholder="Search Doctor or Specialty" sx={{ background: '#181a2f', borderRadius: 1, input: { color: 'white', fontSize: 16 }, width: 260 }} />
                <Button size="small" color="info" sx={{ fontSize: 15, fontWeight: 600 }}>Search</Button>
              </VuiBox>
              <VuiTypography color="white" fontWeight="bold" mb={1} mt={2} sx={{ fontSize: 18 }}>Results</VuiTypography>
              <VuiTypography color="text" sx={{ fontSize: 16 }}>No providers found</VuiTypography>
            </VuiBox>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCareTeamDialog(false)} color="primary" sx={{ fontSize: 15, fontWeight: 600, px: 3, py: 1 }}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Record Dialog content */}
        <Dialog open={recordDialog} onClose={() => setRecordDialog(false)} maxWidth="md" fullWidth
          PaperProps={{sx:{backgroundColor:'rgba(30,32,60,0.7)',boxShadow:24,borderRadius:3,color:'white',minWidth:500,maxWidth:800,backdropFilter:'blur(4px)'}}}>
          <DialogTitle sx={{ fontSize: 22, fontWeight: 700, color: '#fff', mb: 1 }}>Record</DialogTitle>
          <DialogContent>
            <VuiTypography color="text" variant="button" mb={2} sx={{ fontSize: 16 }}>Manage your health records, test results, and planning.</VuiTypography>
            <VuiBox mb={2}>
              <VuiTypography color="white" fontWeight="bold" mb={1} sx={{ fontSize: 18 }}>Visits</VuiTypography>
              <VuiTypography color="text" sx={{ fontSize: 16 }}>No past visits</VuiTypography>
            </VuiBox>
            <VuiBox mb={2}>
              <VuiTypography color="white" fontWeight="bold" mb={1} sx={{ fontSize: 18 }}>Test Results</VuiTypography>
              <VuiTypography color="text" sx={{ fontSize: 16 }}>No test results available</VuiTypography>
            </VuiBox>
            <VuiBox mb={2}>
              <VuiTypography color="white" fontWeight="bold" mb={1} sx={{ fontSize: 18 }}>End of Life Planning</VuiTypography>
              <TextField size="small" variant="outlined" placeholder="Notes or wishes" sx={{ background: '#181a2f', borderRadius: 1, input: { color: 'white', fontSize: 16 }, width: 320, mb: 1 }} />
              <Button size="small" color="info" sx={{ fontSize: 15, fontWeight: 600 }}>Save</Button>
            </VuiBox>
            <VuiBox mb={2}>
              <VuiTypography color="white" fontWeight="bold" mb={1} sx={{ fontSize: 18 }}>Medical and Family History</VuiTypography>
              <TextField size="small" variant="outlined" placeholder="Medical/Family History" sx={{ background: '#181a2f', borderRadius: 1, input: { color: 'white', fontSize: 16 }, width: 320, mb: 1 }} />
              <Button size="small" color="info" sx={{ fontSize: 15, fontWeight: 600 }}>Save</Button>
            </VuiBox>
            <VuiBox mb={2}>
              <VuiTypography color="white" fontWeight="bold" mb={1} sx={{ fontSize: 18 }}>Preventive Care</VuiTypography>
              <VuiTypography color="text" sx={{ fontSize: 16 }}>No preventive care records</VuiTypography>
            </VuiBox>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRecordDialog(false)} color="primary" sx={{ fontSize: 15, fontWeight: 600, px: 3, py: 1 }}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Communication Dialog content */}
        <Dialog open={communicationDialog} onClose={() => setCommunicationDialog(false)} maxWidth="md" fullWidth
          PaperProps={{sx:{backgroundColor:'rgba(30,32,60,0.7)',boxShadow:24,borderRadius:3,color:'white',minWidth:500,maxWidth:800,backdropFilter:'blur(4px)'}}}>
          <DialogTitle sx={{ fontSize: 22, fontWeight: 700, color: '#fff', mb: 1 }}>Communication</DialogTitle>
          <DialogContent>
            <VuiTypography color="text" variant="button" mb={2} sx={{ fontSize: 16 }}>Manage your messages, questions, and resources.</VuiTypography>
            <VuiBox mb={2}>
              <VuiTypography color="white" fontWeight="bold" mb={1} sx={{ fontSize: 18 }}>Messages</VuiTypography>
              <VuiTypography color="text" sx={{ fontSize: 16, mb: 1 }}>Select a doctor to chat:</VuiTypography>
              <VuiBox display="flex" flexDirection="column" gap={1}>
                {doctors.map((doc) => (
                  <Button key={doc} variant="outlined" color="info" sx={{ color: '#fff', borderColor: '#6a6afc', fontWeight: 600, justifyContent: 'flex-start', textTransform: 'none', fontSize: 16 }} onClick={() => handleOpenChat(doc)}>{doc}</Button>
                ))}
              </VuiBox>
            </VuiBox>
            <VuiBox mb={2}>
              <VuiTypography color="white" fontWeight="bold" mb={1} sx={{ fontSize: 18 }}>Ask Questions</VuiTypography>
              <TextField size="small" variant="outlined" placeholder="Your question..." sx={{ background: '#181a2f', borderRadius: 1, input: { color: 'white', fontSize: 16 }, width: 320, mb: 1 }} />
              <Button size="small" color="info" sx={{ fontSize: 15, fontWeight: 600 }}>Ask</Button>
            </VuiBox>
            <VuiBox mb={2}>
              <VuiTypography color="white" fontWeight="bold" mb={1} sx={{ fontSize: 18 }}>Letters</VuiTypography>
              <VuiTypography color="text" sx={{ fontSize: 16 }}>No letters available</VuiTypography>
            </VuiBox>
            <VuiBox mb={2}>
              <VuiTypography color="white" fontWeight="bold" mb={1} sx={{ fontSize: 18 }}>Community Resources</VuiTypography>
              <VuiTypography color="text" sx={{ fontSize: 16 }}>No resources found</VuiTypography>
            </VuiBox>
            <VuiBox mb={2}>
              <VuiTypography color="white" fontWeight="bold" mb={1} sx={{ fontSize: 18 }}>Report Problems</VuiTypography>
              <TextField size="small" variant="outlined" placeholder="Describe the problem..." sx={{ background: '#181a2f', borderRadius: 1, input: { color: 'white', fontSize: 16 }, width: 320, mb: 1 }} />
              <Button size="small" color="info" sx={{ fontSize: 15, fontWeight: 600 }}>Report</Button>
            </VuiBox>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCommunicationDialog(false)} color="primary" sx={{ fontSize: 15, fontWeight: 600, px: 3, py: 1 }}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* independent chat popup */}
        <Dialog open={chatOpen} onClose={handleCloseChat} maxWidth="xs" fullWidth
          PaperProps={{sx:{backgroundColor:'rgba(30,32,60,0.95)',boxShadow:24,borderRadius:3,color:'white',minWidth:350,maxWidth:400,backdropFilter:'blur(6px)'}}}>
          <DialogTitle sx={{ fontSize: 20, fontWeight: 700, color: '#fff', mb: 1, pb: 0 }}>{selectedDoctor}</DialogTitle>
          <DialogContent sx={{ p: 2, minHeight: 320, maxHeight: 400, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
            {(chatMessages[selectedDoctor] || []).map((msg, idx) => (
              <VuiBox key={idx} alignSelf={msg.from === 'You' ? 'flex-end' : 'flex-start'} mb={0.5} px={2} py={1} borderRadius={2} sx={{ background: msg.from === 'You' ? 'linear-gradient(90deg,#6a6afc,#8b8bfc)' : 'rgba(40,42,70,0.7)', color: '#fff', maxWidth: '80%' }}>
                <VuiTypography variant="button" color="white" fontWeight="bold" sx={{ fontSize: 14 }}>{msg.from}</VuiTypography>
                <VuiTypography variant="button" color="text" sx={{ fontSize: 15 }}>{msg.text}</VuiTypography>
                <VuiTypography variant="caption" color="text" sx={{ fontSize: 12, opacity: 0.7 }}>{msg.time}</VuiTypography>
              </VuiBox>
            ))}
          </DialogContent>
          <DialogActions sx={{ px: 2, pb: 2 }}>
            <TextField
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              label="Message"
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Type a message..."
              sx={{
                background: '#181a2f',
                borderRadius: 2,
                border: '2px solid #23244a',
                input: { color: '#fff', fontWeight: 500 },
                label: { color: '#a6b1e1', fontSize: '0.95rem' },
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiOutlinedInput-root': { background: '#181a2f', borderRadius: 2 },
              }}
              onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
            />
            <Button onClick={handleSendMessage} color="info" sx={{ fontWeight: 600, ml: 1, px: 2 }}>Send</Button>
          </DialogActions>
        </Dialog>
      </DashboardLayout>
    </AppointmentProvider>
  );
}

export default Overview;
