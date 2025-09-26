import React, { useMemo, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Header from "./components/Header";
import CarInformations from "./components/CarInformations";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Footer from "examples/Footer";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import VuiButton from "components/VuiButton";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";

export default function Pets() {
  // State for modals and editing
  const [openModal, setOpenModal] = useState(null); // 'dogs', 'cats', 'other', or null
  const [editIndex, setEditIndex] = useState(null);
  const [pets, setPets] = useState({
    dogs: [
      { name: "Buddy", species: "Dog", breed: "Labrador", age: "5", medical: "Vaccinated, No allergies" },
      { name: "Max", species: "Dog", breed: "Beagle", age: "3", medical: "Needs dental check" },
    ],
    cats: [
      { name: "Whiskers", species: "Cat", breed: "Siamese", age: "2", medical: "Allergic to fish" },
      { name: "Luna", species: "Cat", breed: "Maine Coon", age: "4", medical: "Healthy" },
    ],
    other: [
      { name: "Tweety", species: "Bird", breed: "Canary", age: "1", medical: "Healthy" },
      { name: "Nibbles", species: "Hamster", breed: "Syrian", age: "1.5", medical: "No known issues" },
    ],
  });
  const [editPet, setEditPet] = useState({ name: "", species: "", breed: "", age: "", medical: "" });
  // Add state for popups
  // Settings dialog (tabbed)
  const [openSettings, setOpenSettings] = useState(false);
  const [activeTab, setActiveTab] = useState("care"); // "care" | "visits" | "tests" | "schedule" | "search" | "insurance"

  // Modal open/close
  const handleOpenModal = (section) => { setOpenModal(section); setEditIndex(null); };
  const handleCloseModal = () => { setOpenModal(null); setEditIndex(null); };

  // Edit pet
  const handleEdit = (section, idx) => {
    setEditIndex(idx);
    setEditPet(pets[section][idx]);
  };
  const handleEditChange = (e) => {
    setEditPet({ ...editPet, [e.target.name]: e.target.value });
  };
  const handleSaveEdit = () => {
    setPets((prev) => {
      const updated = { ...prev };
      updated[openModal][editIndex] = { ...editPet };
      return updated;
    });
    setEditIndex(null);
  };
  // Add pet
  const handleAddPet = () => {
    setEditIndex(pets[openModal].length);
    setEditPet({ name: "", species: "", breed: "", age: "", medical: "" });
  };
  const handleSaveAdd = () => {
    setPets((prev) => {
      const updated = { ...prev };
      updated[openModal] = [...updated[openModal], { ...editPet }];
      return updated;
    });
    setEditIndex(null);
  };

  // Match Family button styling on the settings card (copied from Family.js)
  const optionBtnSx = {
    width: '100%',
    justifyContent: 'space-between',
    gap: 1,
    color: '#e7e9f3',
    textTransform: 'none',
    fontWeight: 700,
    fontSize: 14,
    px: 1.75,
    py: 1.1,
    borderRadius: 2,
    background: 'linear-gradient(180deg, rgba(24,26,47,0.8) 0%, rgba(22,24,45,0.85) 100%)',
    border: '1px solid rgba(255,255,255,0.09)',
    boxShadow: 'none',
    transition: 'all .15s ease',
    '&:hover': {
      background: 'linear-gradient(180deg, rgba(30,32,60,0.9) 0%, rgba(24,26,47,0.95) 100%)',
      borderColor: '#6a6afc',
      boxShadow: '0 6px 18px rgba(0,0,0,0.25)'
    },
    '&:focus-visible': {
      outline: '2px solid rgba(106,106,252,0.6)',
      outlineOffset: 2
    }
  };

  // Helpers for settings dialog
  const sections = useMemo(() => Object.keys(pets), [pets]); // ["dogs","cats","other"]

  const handleOpenSettings = (tabKey) => {
    setActiveTab(tabKey);
    setOpenSettings(true);
  };
  const handleCloseSettings = () => setOpenSettings(false);

  const renderPetRowBase = (p) => (
    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: '100%' }}>
      <Avatar sx={{ width: 36, height: 36, bgcolor: '#2f315a', fontSize: 16 }}>{(p.name || '?').charAt(0)}</Avatar>
      <VuiTypography color="white" sx={{ fontWeight: 700, fontSize: 16, minWidth: 110 }}>{p.name}</VuiTypography>
      <Chip size="small" label={p.breed || p.species || 'Pet'} sx={{ bgcolor: 'rgba(106,106,252,0.18)', color: '#bdbdfc', border: '1px solid #2c2e59' }} />
    </Stack>
  );

  const RowContainer = ({ children }) => (
    <VuiBox
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        gap: 1.5,
        p: 1.25,
        borderRadius: 2,
        background: 'rgba(40,42,70,0.45)',
        border: '1px solid #23244a',
        mb: 1,
      }}
    >
      {children}
    </VuiBox>
  );

  const renderCareTeamRows = () => (
    <>
      {sections.map((section) => (
        <VuiBox key={section} mb={2}>
          <VuiTypography color="white" fontWeight="bold" mb={1} sx={{ fontSize: 18 }}>
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </VuiTypography>
          {pets[section].map((p, i) => (
            <RowContainer key={`${section}-${i}`}>
              {renderPetRowBase(p)}
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} sx={{ alignItems: 'center', width: '100%', justifyContent: 'flex-end' }}>
                <TextField size="small" variant="outlined" placeholder="Vet" sx={{ background: '#181a2f', borderRadius: 1, input: { color: 'white', fontSize: 14 }, width: 160 }} />
                <TextField size="small" variant="outlined" placeholder="Pharmacy" sx={{ background: '#181a2f', borderRadius: 1, input: { color: 'white', fontSize: 14 }, width: 160 }} />
                <Stack direction="row" alignItems="center" spacing={1}>
                  <VuiTypography color="text" sx={{ fontSize: 13 }}>Share</VuiTypography>
                  <Switch size="small" />
                </Stack>
                <Button size="small" color="info" sx={{ fontSize: 13, fontWeight: 700, textTransform: 'none' }}>Save</Button>
              </Stack>
            </RowContainer>
          ))}
        </VuiBox>
      ))}
    </>
  );

  const renderInsuranceRows = () => (
    <>
      {sections.map((section) => (
        <VuiBox key={section} mb={2}>
          <VuiTypography color="white" fontWeight="bold" mb={1} sx={{ fontSize: 18 }}>
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </VuiTypography>
          {pets[section].map((p, i) => (
            <RowContainer key={`${section}-ins-${i}`}>
              {renderPetRowBase(p)}
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} sx={{ alignItems: 'center', width: '100%', justifyContent: 'flex-end' }}>
                <TextField size="small" variant="outlined" placeholder="Insurance Company" sx={{ background: '#181a2f', borderRadius: 1, input: { color: 'white', fontSize: 14 }, width: 240 }} />
                <Button size="small" color="info" sx={{ fontSize: 13, fontWeight: 700, textTransform: 'none' }}>Assign</Button>
              </Stack>
            </RowContainer>
          ))}
        </VuiBox>
      ))}
    </>
  );

  const renderVisitsRows = () => (
    <>
      {sections.map((section) => (
        <VuiBox key={section} mb={2}>
          <VuiTypography color="white" fontWeight="bold" mb={1} sx={{ fontSize: 18 }}>
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </VuiTypography>
          {pets[section].map((p, i) => (
            <RowContainer key={`${section}-vis-${i}`}>
              {renderPetRowBase(p)}
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} sx={{ alignItems: 'center', width: '100%', justifyContent: 'flex-end' }}>
                <VuiTypography color="text" sx={{ fontSize: 14 }}>No past visits</VuiTypography>
                <Button size="small" color="info" sx={{ fontSize: 13, fontWeight: 700, textTransform: 'none' }}>Add</Button>
              </Stack>
            </RowContainer>
          ))}
        </VuiBox>
      ))}
    </>
  );

  return (
    <DashboardLayout>
      <Header />
      <VuiBox mt={5} mb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <CarInformations popupVariant='settings' />
          </Grid>
        </Grid>
      </VuiBox>
      <Grid container spacing={3} mb="30px">
        <Grid item xs={12} xl={3}>
          {/* Pet settings card – styled like Family */}
          <Card sx={{ minHeight: 360, height: "auto" }}>
            <VuiBox mb="26px">
              <VuiTypography variant="lg" fontWeight="bold" color="white" textTransform="capitalize">
                Pet settings
              </VuiTypography>
            </VuiBox>
            <VuiBox component="ul" sx={{ color: '#fff', pl: 0, mb: 2, listStyle: 'none', fontSize: 15, p: 0, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              {['Care Team', 'Visits', 'Test Results', 'Schedule Appointment', 'Search Provider', 'Insurance'].map((label) => (
                <li key={label}>
                  <VuiButton
                    variant="contained"
                    color="info"
                    onClick={() => handleOpenSettings(
                      label === 'Care Team' ? 'care' :
                      label === 'Visits' ? 'visits' :
                      label === 'Test Results' ? 'tests' :
                      label === 'Schedule Appointment' ? 'schedule' :
                      label === 'Search Provider' ? 'search' : 'insurance'
                    )}
                    sx={optionBtnSx}
                  >
                    <span>{label}</span>
                    <ArrowForwardIosOutlinedIcon sx={{ fontSize: 16, opacity: 0.75 }} />
                  </VuiButton>
                </li>
              ))}
            </VuiBox>
            {/* Unified tabbed settings dialog */}
            <Dialog open={openSettings} onClose={handleCloseSettings} maxWidth="md" fullWidth
              PaperProps={{
                sx: {
                  background: 'linear-gradient(145deg, rgba(20,22,40,0.90), rgba(24,26,47,0.94))',
                  backdropFilter: 'blur(18px) saturate(140%)',
                  borderRadius: 5,
                  boxShadow: '0 18px 60px -4px rgba(0,0,0,0.65), 0 4px 18px rgba(0,0,0,0.4)',
                  border: '1.5px solid rgba(90,98,160,0.35)',
                  color: '#fff',
                  minWidth: 500,
                  maxWidth: 900,
                  overflow: 'hidden'
                },
              }}
            >
              <DialogTitle sx={{ position: 'relative', px: 5, pt: 3.25, pb: 1.25, fontSize: 23, fontWeight: 800, letterSpacing: 0.3 }}>Pet Settings</DialogTitle>
              <Tabs
                value={activeTab}
                onChange={(e, v) => setActiveTab(v)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ px: 2, mt: 0.5, borderBottom: '1px solid #23244a',
                  '& .MuiTab-root': { color: '#b0b3c0', textTransform: 'none', fontWeight: 700, minHeight: 44 },
                  '& .Mui-selected': { color: '#fff' },
                  '& .MuiTabs-indicator': { backgroundColor: '#6a6afc', height: 3 }
                }}
              >
                <Tab value="care" label="Care Team" />
                <Tab value="insurance" label="Insurance" />
                <Tab value="visits" label="Visits" />
                <Tab value="schedule" label="Schedule" />
                <Tab value="search" label="Search Provider" />
                <Tab value="tests" label="Test Results" />
              </Tabs>
              <DialogContent sx={{ px: 5, py: 3.25 }}>
                {activeTab === 'insurance' && (
                  <>
                    <VuiTypography color="text" variant="button" mb={2} sx={{ fontSize: 16 }}>Search and assign insurance companies for each pet.</VuiTypography>
                    {renderInsuranceRows()}
                  </>
                )}
                {activeTab === 'care' && (
                  <>
                    <VuiTypography color="text" variant="button" mb={2} sx={{ fontSize: 16 }}>Enter vet and pharmacy for each pet.</VuiTypography>
                    {renderCareTeamRows()}
                  </>
                )}
                {activeTab === 'visits' && (
                  <>
                    <VuiTypography color="text" variant="button" mb={2} sx={{ fontSize: 16 }}>Past visit records for each pet.</VuiTypography>
                    {renderVisitsRows()}
                  </>
                )}
                {activeTab === 'schedule' && (
                  <>
                    <VuiTypography color="text" variant="button" mb={2} sx={{ fontSize: 16 }}>Schedule a new appointment and view upcoming appointments.</VuiTypography>
                    <VuiBox mb={2} display="flex" alignItems="center" gap={2}>
                      <TextField size="small" variant="outlined" placeholder="Pet" sx={{ background: '#181a2f', borderRadius: 1, input: { color: 'white', fontSize: 16 }, width: 180 }} />
                      <TextField size="small" variant="outlined" placeholder="Date" type="date" sx={{ background: '#181a2f', borderRadius: 1, input: { color: 'white', fontSize: 16 }, width: 150 }} InputLabelProps={{ shrink: true }} />
                      <TextField size="small" variant="outlined" placeholder="Reason" sx={{ background: '#181a2f', borderRadius: 1, input: { color: 'white', fontSize: 16 }, width: 220 }} />
                      <Button size="small" color="info" sx={{ fontSize: 15, fontWeight: 600 }}>Schedule</Button>
                    </VuiBox>
                    <VuiTypography color="white" fontWeight="bold" mb={1} sx={{ fontSize: 18 }}>Upcoming Appointments</VuiTypography>
                    <VuiTypography color="text" sx={{ fontSize: 16 }}>No upcoming appointments</VuiTypography>
                  </>
                )}
                {activeTab === 'search' && (
                  <>
                    <VuiTypography color="text" variant="button" mb={2} sx={{ fontSize: 16 }}>Search and book a vet for your pet.</VuiTypography>
                    <VuiBox mb={2} display="flex" alignItems="center" gap={2}>
                      <TextField size="small" variant="outlined" placeholder="Search Vet or Specialty" sx={{ background: '#181a2f', borderRadius: 1, input: { color: 'white', fontSize: 16 }, width: 260 }} />
                      <Button size="small" color="info" sx={{ fontSize: 15, fontWeight: 600 }}>Search</Button>
                    </VuiBox>
                    <VuiTypography color="white" fontWeight="bold" mb={1} sx={{ fontSize: 18 }}>Results</VuiTypography>
                    <VuiTypography color="text" sx={{ fontSize: 16 }}>No providers found</VuiTypography>
                  </>
                )}
                {activeTab === 'tests' && (
                  <>
                    <VuiTypography color="text" variant="button" mb={1} sx={{ fontSize: 16 }}>Test results for each pet.</VuiTypography>
                    <VuiTypography color="text" sx={{ fontSize: 15 }}>No test results available</VuiTypography>
                  </>
                )}
              </DialogContent>
              <DialogActions sx={{ px: 5, py: 2.4 }}>
                <Button onClick={handleCloseSettings} sx={{ color: '#fff', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 2.2, py: 1, background: 'rgba(255,255,255,0.04)', '&:hover': { background: 'rgba(255,255,255,0.08)' } }}>Close</Button>
              </DialogActions>
            </Dialog>
          </Card>
        </Grid>
        <Grid item xs={12} xl={9}>
          <VuiBox display="flex" flexDirection={{ xs: "column", md: "row" }} gap={3}>
            {/* Dogs Section */}
            <Card sx={{ flex: 1, minWidth: 0, minHeight: 360 }}>
              <VuiBox display="flex" flexDirection="column" height="100%" p={3}>
                <VuiBox display="flex" flexDirection="column" mb="12px">
                  <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">Dogs</VuiTypography>
                  <VuiTypography color="text" variant="button">View and manage dog information and care.</VuiTypography>
                </VuiBox>
                <VuiBox component="ul" sx={{ color: '#fff', pl: 2, mb: 2, listStyle: 'disc', fontSize: 14 }}>
                  {pets.dogs.map((p, i) => <li key={i}>{p.name} <span style={{ color: '#6a6afc', fontWeight: 500 }}>({p.breed})</span></li>)}
                </VuiBox>
                <VuiBox mt="auto" display="flex" justifyContent="flex-end">
                  <VuiButton variant="text" size="small" onClick={() => handleOpenModal('dogs')}>VIEW ALL</VuiButton>
                </VuiBox>
              </VuiBox>
            </Card>
            {/* Cats Section */}
            <Card sx={{ flex: 1, minWidth: 0, minHeight: 360 }}>
              <VuiBox display="flex" flexDirection="column" height="100%" p={3}>
                <VuiBox display="flex" flexDirection="column" mb="12px">
                  <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">Cats</VuiTypography>
                  <VuiTypography color="text" variant="button">View and manage cat information and care.</VuiTypography>
                </VuiBox>
                <VuiBox component="ul" sx={{ color: '#fff', pl: 2, mb: 2, listStyle: 'disc', fontSize: 14 }}>
                  {pets.cats.map((p, i) => <li key={i}>{p.name} <span style={{ color: '#6a6afc', fontWeight: 500 }}>({p.breed})</span></li>)}
                </VuiBox>
                <VuiBox mt="auto" display="flex" justifyContent="flex-end">
                  <VuiButton variant="text" size="small" onClick={() => handleOpenModal('cats')}>VIEW ALL</VuiButton>
                </VuiBox>
              </VuiBox>
            </Card>
            {/* Other Pets Section */}
            <Card sx={{ flex: 1, minWidth: 0, minHeight: 360 }}>
              <VuiBox display="flex" flexDirection="column" height="100%" p={3}>
                <VuiBox display="flex" flexDirection="column" mb="12px">
                  <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">Other Pets</VuiTypography>
                  <VuiTypography color="text" variant="button">View and manage other pet information and care.</VuiTypography>
                </VuiBox>
                <VuiBox component="ul" sx={{ color: '#fff', pl: 2, mb: 2, listStyle: 'disc', fontSize: 14 }}>
                  {pets.other.map((p, i) => <li key={i}>{p.name} <span style={{ color: '#6a6afc', fontWeight: 500 }}>({p.species})</span></li>)}
                </VuiBox>
                <VuiBox mt="auto" display="flex" justifyContent="flex-end">
                  <VuiButton variant="text" size="small" onClick={() => handleOpenModal('other')}>VIEW ALL</VuiButton>
                </VuiBox>
              </VuiBox>
            </Card>
          </VuiBox>
        </Grid>
      </Grid>
      {/* Modal for viewing and editing pets */}
      <Dialog
        open={!!openModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(145deg, rgba(20,22,40,0.9), rgba(26,28,50,0.94))',
            backdropFilter: 'blur(20px) saturate(140%)',
            borderRadius: 5,
            boxShadow: '0 18px 60px -6px rgba(0,0,0,0.65), 0 4px 18px rgba(0,0,0,0.4)',
            border: '1.5px solid rgba(90,98,160,0.35)',
            color: '#fff',
            p: 0,
            width: { xs: '100%', sm: 600, md: 660 },
            minHeight: 440,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ background: 'transparent', color: '#fff', fontWeight: 800, letterSpacing: 0.4, fontSize: 22, px: 5, pt: 3.25, pb: 1.25, borderBottom: '1px solid #23244a' }}>
          {openModal ? `${openModal.charAt(0).toUpperCase() + openModal.slice(1)} Pets` : ''}
        </DialogTitle>
        <DialogContent sx={{ background: 'transparent', color: '#fff', px: 5, pt: 2.5, pb: 2 }}>
          {openModal && editIndex === null && (
            <>
              <VuiBox>
                {pets[openModal].map((p, i) => (
                  <RowContainer key={`view-${openModal}-${i}`}>
                    {renderPetRowBase(p)}
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25} sx={{ alignItems: 'flex-start', width: '100%', justifyContent: 'space-between', flex: 1, flexWrap: 'wrap' }}>
                      <Stack spacing={0.25} sx={{ minWidth: { xs: '100%', md: 220 }, flex: 1 }}>
                        <VuiTypography color="text" sx={{ fontSize: 13, lineHeight: 1.3 }}>Breed: <span style={{ color: '#d5d8f5' }}>{p.breed}</span></VuiTypography>
                        <VuiTypography color="text" sx={{ fontSize: 13, lineHeight: 1.3 }}>Age: <span style={{ color: '#d5d8f5' }}>{p.age}</span></VuiTypography>
                        <VuiTypography color="text" sx={{ fontSize: 13, lineHeight: 1.3, maxWidth: 280 }}>Medical: <span style={{ color: '#d5d8f5' }}>{p.medical}</span></VuiTypography>
                      </Stack>
                      <Button size="small" sx={{ color: '#6a6afc', textTransform: 'none', fontWeight: 700, alignSelf: 'flex-start' }} onClick={() => handleEdit(openModal, i)}>Edit</Button>
                    </Stack>
                  </RowContainer>
                ))}
              </VuiBox>
              <Button variant="contained" sx={{ mt: 1.25, background: 'linear-gradient(90deg,#5353f6,#7d7dfc)', color: '#fff', borderRadius: 2.2, fontWeight: 700, textTransform: 'none', px: 3.2, py: 1, boxShadow: '0 4px 14px -2px #5353f655' }} onClick={handleAddPet}>Add Pet</Button>
            </>
          )}
          {openModal && editIndex !== null && (
            <form>
              <TextField label="Name" name="name" value={editPet.name} onChange={handleEditChange} fullWidth sx={{ mb: 2, input: { color: '#fff' }, label: { color: '#bdbdfc' }, '& .MuiOutlinedInput-root': { background: 'linear-gradient(180deg, rgba(34,36,65,0.9) 0%, rgba(30,32,58,0.9) 100%)', borderRadius: 2.2, border: '1px solid #2b2d55', '& fieldset': { borderColor: 'transparent' } } }} />
              <TextField label="Species" name="species" value={editPet.species} onChange={handleEditChange} fullWidth sx={{ mb: 2, input: { color: '#fff' }, label: { color: '#bdbdfc' }, '& .MuiOutlinedInput-root': { background: 'linear-gradient(180deg, rgba(34,36,65,0.9) 0%, rgba(30,32,58,0.9) 100%)', borderRadius: 2.2, border: '1px solid #2b2d55', '& fieldset': { borderColor: 'transparent' } } }} />
              <TextField label="Breed" name="breed" value={editPet.breed} onChange={handleEditChange} fullWidth sx={{ mb: 2, input: { color: '#fff' }, label: { color: '#bdbdfc' }, '& .MuiOutlinedInput-root': { background: 'linear-gradient(180deg, rgba(34,36,65,0.9) 0%, rgba(30,32,58,0.9) 100%)', borderRadius: 2.2, border: '1px solid #2b2d55', '& fieldset': { borderColor: 'transparent' } } }} />
              <TextField label="Age" name="age" value={editPet.age} onChange={handleEditChange} fullWidth sx={{ mb: 2, input: { color: '#fff' }, label: { color: '#bdbdfc' }, '& .MuiOutlinedInput-root': { background: 'linear-gradient(180deg, rgba(34,36,65,0.9) 0%, rgba(30,32,58,0.9) 100%)', borderRadius: 2.2, border: '1px solid #2b2d55', '& fieldset': { borderColor: 'transparent' } } }} />
              <TextField label="Medical Info" name="medical" value={editPet.medical} onChange={handleEditChange} fullWidth multiline minRows={2} sx={{ mb: 2, input: { color: '#fff' }, label: { color: '#bdbdfc' }, '& .MuiOutlinedInput-root': { background: 'linear-gradient(180deg, rgba(34,36,65,0.9) 0%, rgba(30,32,58,0.9) 100%)', borderRadius: 2.2, border: '1px solid #2b2d55', '& fieldset': { borderColor: 'transparent' } } }} />
            </form>
          )}
        </DialogContent>
        <DialogActions sx={{ background: 'transparent', px: 5, pb: 3.2, pt: 1.2 }}>
          <Button onClick={handleCloseModal} sx={{ color: '#fff', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 2.2, py: 1, background: 'rgba(255,255,255,0.05)', '&:hover': { background: 'rgba(255,255,255,0.09)' } }}>Close</Button>
          {openModal && editIndex !== null && (
            <Button onClick={editIndex < pets[openModal].length ? handleSaveEdit : handleSaveAdd} sx={{ color: '#fff', borderRadius: 2.2, textTransform: 'none', fontWeight: 700, px: 2.7, py: 1.05, background: 'linear-gradient(90deg,#5353f6,#7d7dfc)', boxShadow: '0 4px 14px -2px #5353f666', '&:hover': { background: 'linear-gradient(90deg,#7d7dfc,#5353f6)' } }}>
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Footer />
    </DashboardLayout>
  );
}
