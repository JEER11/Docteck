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
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
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
      { name: "Buddy", species: "Dog", breed: "Labrador", age: "5", medical: "Vaccinated, No allergies", avatar: '' },
      { name: "Max", species: "Dog", breed: "Beagle", age: "3", medical: "Needs dental check", avatar: '' },
    ],
    cats: [
      { name: "Whiskers", species: "Cat", breed: "Siamese", age: "2", medical: "Allergic to fish", avatar: '' },
      { name: "Luna", species: "Cat", breed: "Maine Coon", age: "4", medical: "Healthy", avatar: '' },
    ],
    other: [
      { name: "Tweety", species: "Bird", breed: "Canary", age: "1", medical: "Healthy", avatar: '' },
      { name: "Nibbles", species: "Hamster", breed: "Syrian", age: "1.5", medical: "No known issues", avatar: '' },
    ],
  });
  const [editPet, setEditPet] = useState({ name: "", species: "", breed: "", age: "", medical: "", avatar: '' });
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
    setEditPet({ name: "", species: "", breed: "", age: "", medical: "", avatar: '' });
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
      <Avatar src={p.avatar || undefined} sx={{ width: 40, height: 40, bgcolor: '#2f315a', fontSize: 16 }}>{(p.name || '?').charAt(0)}</Avatar>
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

  // Shared input styling helper for pet edit form
  const getPetInputSx = () => ({
    '& .MuiOutlinedInput-root': {
      background: 'linear-gradient(180deg, rgba(34,36,65,0.9) 0%, rgba(30,32,58,0.9) 100%)',
      borderRadius: 2.2,
      border: '1px solid #2b2d55',
      color: '#fff',
      '& fieldset': { borderColor: 'transparent' },
      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.18)' },
      '&.Mui-focused fieldset': { borderColor: '#3b3df2', boxShadow: '0 0 0 1px #3b3df255' }
    },
    '& .MuiInputBase-input': { color: '#e7e9f3', fontSize: 14, fontWeight: 400, padding: '10px 12px' },
    '& .MuiInputLabel-root': { color: '#aeb3d5', fontSize: 12, fontWeight: 600 },
    '& .MuiInputLabel-root.Mui-focused': { color: '#e7e9f3' }
  });

  const speciesOptions = ["Dog","Cat","Bird","Fish","Hamster","Reptile","Other"];
  const selectProps = {
    IconComponent: ExpandMoreRoundedIcon,
    MenuProps: { PaperProps: { sx: { bgcolor: 'rgba(30,32,55,0.96)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', '& .MuiMenuItem-root': { fontSize: 14 } } } }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setEditPet(p => ({ ...p, avatar: reader.result }));
    reader.readAsDataURL(file);
  };

  // Match Family popup styling
  const popupPaperSx = {
    background: 'linear-gradient(145deg, rgba(18,20,36,0.96), rgba(20,22,40,0.98))',
    backdropFilter: 'blur(18px) saturate(100%)',
    borderRadius: 5,
    boxShadow: '0 18px 60px -4px rgba(0,0,0,0.65), 0 4px 18px rgba(0,0,0,0.4)',
    border: '1.5px solid rgba(90,98,160,0.35)',
    color: '#fff',
    overflow: 'hidden',
  width: { xs: '100%', sm: 640, md: 700 },
  minHeight: 570
  };

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
                  background: 'linear-gradient(145deg, rgba(18,20,36,0.96), rgba(20,22,40,0.98))',
                  backdropFilter: 'blur(18px) saturate(100%)',
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
      {/* Modal for viewing and editing pets – unified with Family modal design */}
  <Dialog open={!!openModal} onClose={handleCloseModal} maxWidth='md' fullWidth PaperProps={{ sx: popupPaperSx }}>
        <DialogTitle sx={{ position: 'relative', px: 5, pt: 3.25, pb: 2.25 }}>
          <VuiTypography variant='lg' fontWeight='bold' color='white' sx={{ fontSize: 23, letterSpacing: 0.3 }}>
            {openModal ? `${openModal.charAt(0).toUpperCase() + openModal.slice(1)} Members` : ''}
          </VuiTypography>
        </DialogTitle>
        <DialogContent sx={{ px: 5, py: 3.5 }}>
          {openModal && editIndex === null && (
            <>
              <VuiBox component="ul" sx={{ listStyle: 'none', p: 0, m: 0, mb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {pets[openModal].map((p, i) => (
                  <li key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px',
                    background: 'linear-gradient(180deg, rgba(24,26,47,0.7) 0%, rgba(22,24,45,0.7) 100%)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12
                  }}>
                    <Avatar src={p.avatar || undefined} sx={{ width: 46, height: 46, bgcolor: '#34365e', fontSize: 17, fontWeight: 600 }}>
                      {(p.name||'?').charAt(0)}
                    </Avatar>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600, fontSize: 15 }}>{p.name} <span style={{ color: '#6a6afc', fontWeight: 500 }}>({p.breed || p.species})</span></span>
                      <span style={{ fontSize: 12.5, color: '#bdbdfc', marginTop: 2 }}>Age: {p.age} | Species: {p.species}</span>
                      <span style={{ fontSize: 12.5, color: '#bdbdfc' }}>Medical: {p.medical}</span>
                    </div>
                    <Tooltip title="Edit pet details"><Button size="small" sx={{ color: '#6a6afc', textTransform: 'none', fontWeight: 600 }} onClick={() => handleEdit(openModal, i)}>Edit</Button></Tooltip>
                  </li>
                ))}
              </VuiBox>
              <Tooltip title="Add a new pet"><Button variant="contained" sx={{ mt: 0.5, background: 'linear-gradient(90deg,#6a6afc,#8b8bfc)', color: '#fff', borderRadius: 2, fontWeight: 700, textTransform: 'none', px: 3, py: 1, boxShadow: '0 2px 8px #6a6afc33' }} onClick={handleAddPet}>Add Pet</Button></Tooltip>
            </>
          )}
          {openModal && editIndex !== null && (
            <form style={{ width: '100%' }}>
              <input hidden type="file" id="pet-avatar-upload" accept="image/*" onChange={handleAvatarChange} />
              <VuiBox display="flex" alignItems="center" gap={2} mb={3} mt={1}>
                <Tooltip title="Upload photo">
                  <Avatar
                    src={editPet.avatar || undefined}
                    sx={{ width: 62, height: 62, bgcolor: '#2f315a', fontSize: 20, fontWeight: 600, cursor: 'pointer', position: 'relative' }}
                    onClick={() => document.getElementById('pet-avatar-upload')?.click()}
                  >
                    {(editPet.name||'?').charAt(0)}
                  </Avatar>
                </Tooltip>
                <VuiTypography color="text" sx={{ fontSize: 13 }}>Click the avatar to upload / change photo.</VuiTypography>
              </VuiBox>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 14, width: '100%' }}>
                <TextField size='small' label="Name" name="name" value={editPet.name} onChange={handleEditChange} fullWidth sx={getPetInputSx()} />
                <TextField size='small' label="Species" name="species" value={editPet.species} onChange={handleEditChange} fullWidth select SelectProps={selectProps} sx={getPetInputSx()}>
                  {speciesOptions.map(sp => <MenuItem key={sp} value={sp}>{sp}</MenuItem>)}
                </TextField>
                <TextField size='small' label="Breed" name="breed" value={editPet.breed} onChange={handleEditChange} fullWidth sx={getPetInputSx()} />
                <TextField size='small' label="Age" name="age" value={editPet.age} onChange={handleEditChange} fullWidth sx={getPetInputSx()} />
                <TextField size='small' label="Medical Info" name="medical" value={editPet.medical} onChange={handleEditChange} fullWidth multiline minRows={2} sx={getPetInputSx()} />
              </div>
            </form>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 5, py: 2.4, gap: 1 }}>
          <Button onClick={handleCloseModal} sx={{ color: '#fff', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 2.2, py: 1, background: 'rgba(255,255,255,0.04)', '&:hover': { background: 'rgba(255,255,255,0.08)' } }}>Close</Button>
          {openModal && editIndex !== null && (
            <>
              <Button onClick={() => setEditIndex(null)} sx={{ color: '#fff', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 2.2, py: 1, background: 'rgba(255,255,255,0.04)', '&:hover': { background: 'rgba(255,255,255,0.10)' } }}>Back</Button>
              {editIndex < pets[openModal].length && (
                <Button onClick={() => { setPets(prev => { const updated = { ...prev }; updated[openModal] = updated[openModal].filter((_, i) => i !== editIndex); return updated; }); setEditIndex(null); }} sx={{ color: '#fff', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 2.2, py: 1, background: 'linear-gradient(90deg,#b92e2e,#d84343)', '&:hover': { background: 'linear-gradient(90deg,#d84343,#b92e2e)' } }}>Delete</Button>
              )}
              <Button onClick={editIndex < pets[openModal].length ? handleSaveEdit : handleSaveAdd} sx={{ color: '#fff', borderRadius: 2.2, textTransform: 'none', fontWeight: 700, px: 2.7, py: 1.05, background: 'linear-gradient(90deg,#5353f6,#7d7dfc)', boxShadow: '0 4px 14px -2px #5353f666', '&:hover': { background: 'linear-gradient(90deg,#7d7dfc,#5353f6)' } }}>
                Save
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
      <Footer />
    </DashboardLayout>
  );
}
