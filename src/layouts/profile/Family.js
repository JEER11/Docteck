import React, { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Header from "./components/Header";
import PlatformSettings from "./components/PlatformSettings";
import CarInformations from "./components/CarInformations";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiButton from "components/VuiButton";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Footer from "examples/Footer";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import IconButton from "@mui/material/IconButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Divider from "@mui/material/Divider";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import InputAdornment from "@mui/material/InputAdornment";

import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import LocalPharmacyOutlinedIcon from "@mui/icons-material/LocalPharmacyOutlined";
import ContactPhoneOutlinedIcon from "@mui/icons-material/ContactPhoneOutlined";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";

export default function Family() {
  // State for modals and editing
  const [openModal, setOpenModal] = useState(null); // 'parents', 'spouse', 'children', or null
  const [editIndex, setEditIndex] = useState(null);
  const [members, setMembers] = useState({
    parents: [
      { name: "Jane Doe", relation: "Mother", email: "jane@example.com", phone: "555-1234", blood: "A+", allergies: "None" },
      { name: "John Doe", relation: "Father", email: "john@example.com", phone: "555-5678", blood: "O-", allergies: "Peanuts" },
    ],
    spouse: [
      { name: "Alex Doe", relation: "Spouse", email: "alex@example.com", phone: "555-9999", blood: "B+", allergies: "None" },
    ],
    children: [
      { name: "Lucas Doe", relation: "Son", email: "lucas@example.com", phone: "555-1111", blood: "A-", allergies: "None" },
      { name: "Sophia Doe", relation: "Daughter", email: "sophia@example.com", phone: "555-2222", blood: "O+", allergies: "Milk" },
    ],
  });
  const [editMember, setEditMember] = useState({ name: "", relation: "", email: "", phone: "", blood: "", allergies: "" });
  const [openPopup, setOpenPopup] = useState(null); // for button popups

  // Modal open/close
  const handleOpenModal = (section) => { setOpenModal(section); setEditIndex(null); };
  const handleCloseModal = () => { setOpenModal(null); setEditIndex(null); };

  // Edit member
  const handleEdit = (section, idx) => {
    setEditIndex(idx);
    setEditMember(members[section][idx]);
  };
  const handleEditChange = (e) => {
    setEditMember({ ...editMember, [e.target.name]: e.target.value });
  };
  const handleSaveEdit = () => {
    setMembers((prev) => {
      const updated = { ...prev };
      updated[openModal][editIndex] = { ...editMember };
      return updated;
    });
    setEditIndex(null);
  };
  // Add member
  const handleAddMember = () => {
    setEditIndex(members[openModal].length);
    setEditMember({ name: "", relation: "", email: "", phone: "", blood: "", allergies: "" });
  };
  const handleSaveAdd = () => {
    setMembers((prev) => {
      const updated = { ...prev };
      updated[openModal] = [...updated[openModal], { ...editMember }];
      return updated;
    });
    setEditIndex(null);
  };

  // Modern, simple button style to match Personal page aesthetics
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

  // Shared styling for dialogs to match Account Settings popups exactly
  const popupPaperSx = {
    backgroundColor: 'rgba(30, 32, 60, 0.7)',
    boxShadow: 24,
    borderRadius: 3,
    color: 'white',
    backdropFilter: 'blur(4px)'
  };

  const sectionCardSx = {
    background: 'linear-gradient(180deg, rgba(24,26,47,0.7) 0%, rgba(22,24,45,0.7) 100%)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 3,
    p: 2,
    mb: 2,
  };

  // TextField styles cloned from Account Settings password dialog (consistent inputs)
  const inputSx = {
    width: '100%',
    ml: 0,
    background: '#181a2f',
    borderRadius: 1.5,
    '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #23244a' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#2f3570' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#6a6afc' },
    '& .MuiInputBase-input': { color: '#e7e9f3', fontSize: 14, py: 1 },
    '& .MuiInputAdornment-positionEnd': { mr: -1.25 },
    '& .MuiFormLabel-root': { color: '#aeb3d5', fontSize: 12 }
  };

  const smallActionBtnSx = {
    fontSize: 14,
    fontWeight: 700,
    px: 2,
    py: 0.75,
    borderRadius: 2,
    boxShadow: '0 2px 10px rgba(106,106,252,0.25)'
  };

  // Tab state for Parents/Spouse/Children inside popups
  const [familyTab, setFamilyTab] = useState(0); // 0: parents, 1: spouse, 2: children
  const sectionKeys = ['parents', 'spouse', 'children'];
  const tabsSx = {
    minHeight: 40,
    '& .MuiTab-root': { color: '#aeb3d5', textTransform: 'none', minHeight: 40, fontWeight: 600 },
    '& .Mui-selected': { color: '#ffffff' },
    '& .MuiTabs-indicator': { backgroundColor: '#6a6afc', height: 2 }
  };

  useEffect(() => {
    if (openPopup) setFamilyTab(0);
  }, [openPopup]);

  // Lightweight per-member preferences/state for UI controls
  const [prefs, setPrefs] = useState({}); // key: `${section}-${index}` -> { doctor, pharmacy, primary, emergency, insurer }
  const getKey = (section, idx) => `${section}-${idx}`;
  const getPref = (section, idx) => prefs[getKey(section, idx)] || {};
  const setPref = (section, idx, patch) => setPrefs((p) => ({ ...p, [getKey(section, idx)]: { ...(p[getKey(section, idx)] || {}), ...patch } }));

  const initials = (name = '') => name.trim().split(/\s+/).slice(0,2).map(s => s[0]?.toUpperCase()||'').join('');

  const memberRowBoxSx = {
    p: 1.25,
    borderRadius: 2,
    mb: 1,
    background: 'linear-gradient(180deg, rgba(24,26,47,0.7) 0%, rgba(22,24,45,0.7) 100%)',
    border: '1px solid rgba(255,255,255,0.08)'
  };

  const actionIconBtnSx = { color: '#c6c9e5', '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.06)' } };

  // Renderers for improved rows
  const renderCareTeamRow = (section, m, i) => {
    const pref = getPref(section, i);
    return (
      <VuiBox key={`${section}-${i}`} sx={memberRowBoxSx}>
        <Grid container spacing={1.25} alignItems="center">
          <Grid item xs={12} sm={4} md={3}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar sx={{ width: 34, height: 34, bgcolor: '#34365e', fontSize: 14 }}>{initials(m.name)}</Avatar>
              <VuiBox>
                <VuiTypography color="white" sx={{ fontSize: 14, fontWeight: 700, lineHeight: 1 }}>{m.name}</VuiTypography>
                <Chip label={m.relation} size="small" sx={{ height: 20, fontSize: 11, borderRadius: 1, color: '#cfd3f7', borderColor: 'rgba(255,255,255,0.25)' }} variant="outlined" />
              </VuiBox>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={8} md={6}>
            <Grid container spacing={1.25}>
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  variant="outlined"
                  placeholder="Doctor"
                  value={pref.doctor || ''}
                  onChange={(e) => setPref(section, i, { doctor: e.target.value })}
                  fullWidth
                  sx={inputSx}
                  InputProps={{ startAdornment: (<InputAdornment position="start"><LocalHospitalOutlinedIcon sx={{ color: '#aeb3d5' }} /></InputAdornment>) }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  variant="outlined"
                  placeholder="Pharmacy"
                  value={pref.pharmacy || ''}
                  onChange={(e) => setPref(section, i, { pharmacy: e.target.value })}
                  fullWidth
                  sx={inputSx}
                  InputProps={{ startAdornment: (<InputAdornment position="start"><LocalPharmacyOutlinedIcon sx={{ color: '#aeb3d5' }} /></InputAdornment>) }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={3}>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
              <Tooltip title={pref.primary ? 'Primary member' : 'Mark as primary'}><IconButton size="small" onClick={() => setPref(section, i, { primary: !pref.primary })} sx={actionIconBtnSx}>{pref.primary ? <StarRoundedIcon /> : <StarOutlineRoundedIcon />}</IconButton></Tooltip>
              <Tooltip title={pref.emergency ? 'Emergency contact' : 'Set as emergency contact'}><Switch size="small" checked={!!pref.emergency} onChange={(e) => setPref(section, i, { emergency: e.target.checked })} icon={<ContactPhoneOutlinedIcon sx={{ fontSize: 18, color: '#aeb3d5' }} />} checkedIcon={<ContactPhoneOutlinedIcon sx={{ fontSize: 18, color: '#5de4c7' }} />} /></Tooltip>
              <Tooltip title="View"><IconButton size="small" sx={actionIconBtnSx}><VisibilityRoundedIcon /></IconButton></Tooltip>
              <Tooltip title="Edit"><IconButton size="small" sx={actionIconBtnSx}><EditRoundedIcon /></IconButton></Tooltip>
              <VuiButton size="small" color="info" startIcon={<SaveRoundedIcon />} sx={smallActionBtnSx}>Save</VuiButton>
            </Stack>
          </Grid>
        </Grid>
      </VuiBox>
    );
  };

  const renderInsuranceRow = (section, m, i) => {
    const pref = getPref(section, i);
    return (
      <VuiBox key={`${section}-ins-${i}`} sx={memberRowBoxSx}>
        <Grid container spacing={1.25} alignItems="center">
          <Grid item xs={12} sm={4} md={3}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar sx={{ width: 34, height: 34, bgcolor: '#34365e', fontSize: 14 }}>{initials(m.name)}</Avatar>
              <VuiBox>
                <VuiTypography color="white" sx={{ fontSize: 14, fontWeight: 700, lineHeight: 1 }}>{m.name}</VuiTypography>
                <Chip label={m.relation} size="small" sx={{ height: 20, fontSize: 11, borderRadius: 1, color: '#cfd3f7', borderColor: 'rgba(255,255,255,0.25)' }} variant="outlined" />
              </VuiBox>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={8} md={6}>
            <TextField size="small" variant="outlined" placeholder="Insurance Company" value={pref.insurer || ''} onChange={(e) => setPref(section, i, { insurer: e.target.value })} fullWidth sx={inputSx} />
          </Grid>
          <Grid item xs={12} md={3}>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
              <Tooltip title={pref.primary ? 'Primary member' : 'Mark as primary'}><IconButton size="small" onClick={() => setPref(section, i, { primary: !pref.primary })} sx={actionIconBtnSx}>{pref.primary ? <StarRoundedIcon /> : <StarOutlineRoundedIcon />}</IconButton></Tooltip>
              <VuiButton size="small" color="info" startIcon={<SaveRoundedIcon />} sx={smallActionBtnSx}>Assign</VuiButton>
            </Stack>
          </Grid>
        </Grid>
      </VuiBox>
    );
  };

  const renderVisitsRow = (section, m, i) => (
    <VuiBox key={`${section}-visit-${i}`} sx={memberRowBoxSx}>
      <Grid container spacing={1.25} alignItems="center">
        <Grid item xs={12} sm={4} md={3}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar sx={{ width: 34, height: 34, bgcolor: '#34365e', fontSize: 14 }}>{initials(m.name)}</Avatar>
            <VuiBox>
              <VuiTypography color="white" sx={{ fontSize: 14, fontWeight: 700, lineHeight: 1 }}>{m.name}</VuiTypography>
              <Chip label={m.relation} size="small" sx={{ height: 20, fontSize: 11, borderRadius: 1, color: '#cfd3f7', borderColor: 'rgba(255,255,255,0.25)' }} variant="outlined" />
            </VuiBox>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={8} md={6}>
          <VuiTypography color="text" sx={{ fontSize: 14 }}>No past visits</VuiTypography>
        </Grid>
        <Grid item xs={12} md={3}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
            <Tooltip title="View"><IconButton size="small" sx={actionIconBtnSx}><VisibilityRoundedIcon /></IconButton></Tooltip>
            <Tooltip title="Edit"><IconButton size="small" sx={actionIconBtnSx}><EditRoundedIcon /></IconButton></Tooltip>
            <VuiButton size="small" color="info" sx={smallActionBtnSx}>Add visit</VuiButton>
          </Stack>
        </Grid>
      </Grid>
    </VuiBox>
  );

  return (
    <DashboardLayout>
      <Header />
      <VuiBox mt={5} mb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <CarInformations />
          </Grid>
        </Grid>
      </VuiBox>
      <Grid container spacing={3} mb="30px">
        <Grid item xs={12} xl={3}>
          {/* Family settings card – styled like Profile's Account settings */}
          <Card sx={{ minHeight: 360, height: "auto" }}>
            <VuiBox mb="26px">
              <VuiTypography variant="lg" fontWeight="bold" color="white" textTransform="capitalize">
                Family settings
              </VuiTypography>
            </VuiBox>
            <VuiBox component="ul" sx={{ color: '#fff', pl: 0, mb: 2, listStyle: 'none', fontSize: 15, p: 0, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              {['Care Team', 'Visits', 'Test Results', 'Schedule Appointment', 'Search Provider', 'Insurance'].map((label) => (
                <li key={label}>
                  <VuiButton
                    variant="contained"
                    color="info"
                    onClick={() => setOpenPopup(label)}
                    sx={optionBtnSx}
                  >
                    <span>{label}</span>
                    <ArrowForwardIosOutlinedIcon sx={{ fontSize: 16, opacity: 0.75 }} />
                  </VuiButton>
                </li>
              ))}
            </VuiBox>
            {/* Popup Dialog for each button */}
            <Dialog
              open={!!openPopup}
              onClose={() => setOpenPopup(null)}
              maxWidth="md"
              fullWidth
              PaperProps={{ sx: popupPaperSx }}
            >
              <DialogTitle sx={{ position: 'relative', px: 4, pt: 3, pb: 2 }}>
                <VuiTypography variant="lg" fontWeight="bold" color="white" sx={{ fontSize: 22 }}>
                  {openPopup}
                </VuiTypography>
                <IconButton
                  aria-label="close"
                  onClick={() => setOpenPopup(null)}
                  sx={{ position: 'absolute', right: 12, top: 10, color: '#9fa3c1', '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.06)' } }}
                >
                  <CloseRoundedIcon />
                </IconButton>
              </DialogTitle>
              <Divider sx={{ borderColor: '#23244a' }} />
              <DialogContent sx={{ px: 4, py: 3 }}>
                {openPopup === 'Insurance' && (
                  <>
                    <VuiTypography color="text" variant="button" mb={1.5} sx={{ fontSize: 16 }}>
                      Search and assign insurance companies for each family member.
                    </VuiTypography>

                    <Tabs value={familyTab} onChange={(e, v) => setFamilyTab(v)} variant="scrollable" allowScrollButtonsMobile sx={tabsSx}>
                      <Tab label="Parents" />
                      <Tab label="Spouse" />
                      <Tab label="Children" />
                    </Tabs>

                    <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

                    {(() => {
                      const section = sectionKeys[familyTab];
                      return (
                        <VuiBox sx={sectionCardSx}>
                          <VuiTypography color="white" fontWeight="bold" mb={1.25} sx={{ fontSize: 18 }}>
                            {section.charAt(0).toUpperCase() + section.slice(1)}
                          </VuiTypography>
                          {members[section].map((m, i) => renderInsuranceRow(section, m, i))}
                        </VuiBox>
                      );
                    })()}
                  </>
                )}
                {openPopup === 'Care Team' && (
                  <>
                    <VuiTypography color="text" variant="button" mb={1.5} sx={{ fontSize: 16 }}>
                      Enter doctor and pharmacy for each family member.
                    </VuiTypography>

                    <Tabs value={familyTab} onChange={(e, v) => setFamilyTab(v)} variant="scrollable" allowScrollButtonsMobile sx={tabsSx}>
                      <Tab label="Parents" />
                      <Tab label="Spouse" />
                      <Tab label="Children" />
                    </Tabs>

                    <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

                    {(() => {
                      const section = sectionKeys[familyTab];
                      return (
                        <VuiBox sx={sectionCardSx}>
                          <VuiTypography color="white" fontWeight="bold" mb={1.25} sx={{ fontSize: 18 }}>
                            {section.charAt(0).toUpperCase() + section.slice(1)}
                          </VuiTypography>
                          {members[section].map((m, i) => renderCareTeamRow(section, m, i))}
                        </VuiBox>
                      );
                    })()}
                  </>
                )}
                {openPopup === 'Visits' && (
                  <>
                    <VuiTypography color="text" variant="button" mb={1.5} sx={{ fontSize: 16 }}>
                      Past visit records for each family member.
                    </VuiTypography>

                    <Tabs value={familyTab} onChange={(e, v) => setFamilyTab(v)} variant="scrollable" allowScrollButtonsMobile sx={tabsSx}>
                      <Tab label="Parents" />
                      <Tab label="Spouse" />
                      <Tab label="Children" />
                    </Tabs>

                    <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

                    {(() => {
                      const section = sectionKeys[familyTab];
                      return (
                        <VuiBox sx={sectionCardSx}>
                          <VuiTypography color="white" fontWeight="bold" mb={1.25} sx={{ fontSize: 18 }}>
                            {section.charAt(0).toUpperCase() + section.slice(1)}
                          </VuiTypography>
                          {members[section].map((m, i) => renderVisitsRow(section, m, i))}
                        </VuiBox>
                      );
                    })()}
                  </>
                )}
                {openPopup === 'Schedule Appointment' && (
                  <>
                    <VuiTypography color="text" variant="button" mb={2} sx={{ fontSize: 16 }}>
                      Schedule a new appointment and view upcoming appointments.
                    </VuiTypography>
                    <VuiBox mb={2} sx={sectionCardSx}>
                      <Grid container spacing={1.5} alignItems="center">
                        <Grid item xs={12} sm={4} md={3}>
                          <TextField size="small" variant="outlined" placeholder="Family Member" fullWidth sx={inputSx} />
                        </Grid>
                        <Grid item xs={12} sm={4} md={3}>
                          <TextField size="small" variant="outlined" placeholder="Date" type="date" fullWidth sx={inputSx} InputLabelProps={{ shrink: true }} />
                        </Grid>
                        <Grid item xs={12} sm={4} md={4}>
                          <TextField size="small" variant="outlined" placeholder="Reason" fullWidth sx={inputSx} />
                        </Grid>
                        <Grid item xs={12} sm={12} md={2} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                          <VuiButton size="small" color="info" sx={smallActionBtnSx}>Schedule</VuiButton>
                        </Grid>
                      </Grid>
                    </VuiBox>
                    <VuiBox sx={sectionCardSx}>
                      <VuiTypography color="white" fontWeight="bold" mb={1} sx={{ fontSize: 18 }}>
                        Upcoming Appointments
                      </VuiTypography>
                      <VuiTypography color="text" sx={{ fontSize: 15 }}>No upcoming appointments</VuiTypography>
                    </VuiBox>
                  </>
                )}
                {openPopup === 'Search Provider' && (
                  <>
                    <VuiTypography color="text" variant="button" mb={2} sx={{ fontSize: 16 }}>
                      Search and book a doctor for your family.
                    </VuiTypography>
                    <VuiBox mb={2} sx={sectionCardSx}>
                      <Grid container spacing={1.5} alignItems="center">
                        <Grid item xs={12} sm={9}>
                          <TextField size="small" variant="outlined" placeholder="Search Doctor or Specialty" fullWidth sx={inputSx} />
                        </Grid>
                        <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                          <VuiButton size="small" color="info" sx={smallActionBtnSx}>Search</VuiButton>
                        </Grid>
                      </Grid>
                    </VuiBox>
                    <VuiBox sx={sectionCardSx}>
                      <VuiTypography color="white" fontWeight="bold" mb={1} sx={{ fontSize: 18 }}>Results</VuiTypography>
                      <VuiTypography color="text" sx={{ fontSize: 15 }}>No providers found</VuiTypography>
                    </VuiBox>
                  </>
                )}
              </DialogContent>
              <Divider sx={{ borderColor: '#23244a' }} />
              <DialogActions sx={{ px: 4, py: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={() => setOpenPopup(null)} sx={{ color: '#a259ec', textTransform: 'none', fontWeight: 600 }}>Close</Button>
              </DialogActions>
            </Dialog>
          </Card>
        </Grid>
        <Grid item xs={12} xl={9}>
          <VuiBox display="flex" flexDirection={{ xs: "column", md: "row" }} gap={3}>
            {/* Parents card – styled like Profile's Settings card */}
            <Card sx={{ flex: 1, minWidth: 0, minHeight: 360 }}>
              <VuiBox display="flex" flexDirection="column" height="100%" p={3}>
                <VuiBox display="flex" flexDirection="column" mb="12px">
                  <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">Parents</VuiTypography>
                  <VuiTypography color="text" variant="button">View and manage parent information and permissions.</VuiTypography>
                </VuiBox>
                <VuiBox component="ul" sx={{ color: '#fff', pl: 2, mb: 2, listStyle: 'disc', fontSize: 14 }}>
                  {members.parents.map((m, i) => <li key={i}>{m.name} <span style={{ color: '#6a6afc', fontWeight: 500 }}>({m.relation})</span></li>)}
                </VuiBox>
                <VuiBox mt="auto" display="flex" justifyContent="flex-end">
                  <VuiButton variant="text" size="small" onClick={() => handleOpenModal('parents')}>VIEW ALL</VuiButton>
                </VuiBox>
              </VuiBox>
            </Card>
            {/* Spouse card */}
            <Card sx={{ flex: 1, minWidth: 0, minHeight: 360 }}>
              <VuiBox display="flex" flexDirection="column" height="100%" p={3}>
                <VuiBox display="flex" flexDirection="column" mb="12px">
                  <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">Spouse</VuiTypography>
                  <VuiTypography color="text" variant="button">View and manage spouse information and permissions.</VuiTypography>
                </VuiBox>
                <VuiBox component="ul" sx={{ color: '#fff', pl: 2, mb: 2, listStyle: 'disc', fontSize: 14 }}>
                  {members.spouse && members.spouse.length > 0 ? (
                    members.spouse.map((m, i) => <li key={i}>{m.name} <span style={{ color: '#6a6afc', fontWeight: 500 }}>({m.relation})</span></li>)
                  ) : (
                    <li style={{ color: '#bdbdfc' }}>No spouse added</li>
                  )}
                </VuiBox>
                <VuiBox mt="auto" display="flex" justifyContent="flex-end">
                  <VuiButton variant="text" size="small" onClick={() => handleOpenModal('spouse')}>VIEW ALL</VuiButton>
                </VuiBox>
              </VuiBox>
            </Card>
            {/* Children card */}
            <Card sx={{ flex: 1, minWidth: 0, minHeight: 360 }}>
              <VuiBox display="flex" flexDirection="column" height="100%" p={3}>
                <VuiBox display="flex" flexDirection="column" mb="12px">
                  <VuiTypography color="white" variant="lg" fontWeight="bold" mb="6px">Children</VuiTypography>
                  <VuiTypography color="text" variant="button">View and manage children information and permissions.</VuiTypography>
                </VuiBox>
                <VuiBox component="ul" sx={{ color: '#fff', pl: 2, mb: 2, listStyle: 'disc', fontSize: 14 }}>
                  {members.children.map((m, i) => <li key={i}>{m.name} <span style={{ color: '#6a6afc', fontWeight: 500 }}>({m.relation})</span></li>)}
                </VuiBox>
                <VuiBox mt="auto" display="flex" justifyContent="flex-end">
                  <VuiButton variant="text" size="small" onClick={() => handleOpenModal('children')}>VIEW ALL</VuiButton>
                </VuiBox>
              </VuiBox>
            </Card>
          </VuiBox>
        </Grid>
      </Grid>
      {/* Modal for viewing and editing members */}
      <Dialog 
        open={!!openModal} 
        onClose={handleCloseModal} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: popupPaperSx }}
      >
        <DialogTitle sx={{ position: 'relative', px: 4, pt: 3, pb: 2 }}>
          {openModal ? `${openModal.charAt(0).toUpperCase() + openModal.slice(1)} Members` : ''}
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{ position: 'absolute', right: 12, top: 10, color: '#9fa3c1', '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.06)' } }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <Divider sx={{ borderColor: '#23244a' }} />
        <DialogContent sx={{ px: 4, py: 3 }}>
          {openModal && editIndex === null && (
            <>
              <ul style={{ color: '#fff', paddingLeft: 18, marginBottom: 16, fontSize: 15 }}>
                {members[openModal].map((m, i) => (
                  <li key={i} style={{ marginBottom: 14, background: 'linear-gradient(180deg, rgba(24,26,47,0.7) 0%, rgba(22,24,45,0.7) 100%)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontWeight: 600, fontSize: 16 }}>{m.name} <span style={{ color: '#6a6afc', fontWeight: 500 }}>({m.relation})</span></span>
                    <span style={{ fontSize: 13, color: '#bdbdfc' }}>Email: {m.email} | Phone: {m.phone}</span>
                    <span style={{ fontSize: 13, color: '#bdbdfc' }}>Blood: {m.blood} | Allergies: {m.allergies}</span>
                    <Button size="small" sx={{ mt: 1, alignSelf: 'flex-end', color: '#6a6afc', textTransform: 'none', fontWeight: 600 }} onClick={() => handleEdit(openModal, i)}>Edit</Button>
                  </li>
                ))}
              </ul>
              <Button variant="contained" sx={{ mt: 1, background: 'linear-gradient(90deg,#6a6afc,#8b8bfc)', color: '#fff', borderRadius: 2, fontWeight: 700, textTransform: 'none', px: 3, py: 1, boxShadow: '0 2px 8px #6a6afc33' }} onClick={handleAddMember}>Add Member</Button>
            </>
          )}
          {openModal && editIndex !== null && (
            <form>
              <TextField label="Name" name="name" value={editMember.name} onChange={handleEditChange} fullWidth sx={{ mb: 2, ...inputSx }} />
              <TextField label="Relation" name="relation" value={editMember.relation} onChange={handleEditChange} fullWidth sx={{ mb: 2, ...inputSx }} />
              <TextField label="Email" name="email" value={editMember.email} onChange={handleEditChange} fullWidth sx={{ mb: 2, ...inputSx }} />
              <TextField label="Phone" name="phone" value={editMember.phone} onChange={handleEditChange} fullWidth sx={{ mb: 2, ...inputSx }} />
              <TextField label="Blood Type" name="blood" value={editMember.blood} onChange={handleEditChange} fullWidth sx={{ mb: 2, ...inputSx }} />
              <TextField label="Allergies" name="allergies" value={editMember.allergies} onChange={handleEditChange} fullWidth sx={{ mb: 2, ...inputSx }} />
            </form>
          )}
        </DialogContent>
        <Divider sx={{ borderColor: '#23244a' }} />
        <DialogActions sx={{ px: 4, py: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={handleCloseModal} sx={{ color: '#a259ec', textTransform: 'none', fontWeight: 600 }}>Close</Button>
          {openModal && editIndex !== null && (
            <Button onClick={editIndex < members[openModal].length ? handleSaveEdit : handleSaveAdd} sx={{ color: '#fff', background: 'linear-gradient(90deg, #3a8dde 0%, #6f7cf7 100%)', textTransform: 'none', fontWeight: 700, px: 2.5 }}>
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Footer />
    </DashboardLayout>
  );
}
