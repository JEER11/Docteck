import React, { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Header from "./components/Header";
import CarInformations from "./components/CarInformations"; // settings style medical profile popups
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
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';

import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import LocalPharmacyOutlinedIcon from "@mui/icons-material/LocalPharmacyOutlined";
import ContactPhoneOutlinedIcon from "@mui/icons-material/ContactPhoneOutlined";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import SearchIcon from "@mui/icons-material/Search";
import PhoneInTalkOutlinedIcon from "@mui/icons-material/PhoneInTalkOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import getApiBase from "../../lib/apiBase";
import { useAppointments } from "../../context/AppointmentContext";

export default function Family() {
  const API = getApiBase();
  const { addProvider } = useAppointments() || { addProvider: async () => null };
  // State for modals and editing
  const [openModal, setOpenModal] = useState(null); // 'parents', 'spouse', 'children', or null
  const [editIndex, setEditIndex] = useState(null);
  const [members, setMembers] = useState({
    parents: [
      { name: "Jane Doe", relation: "Mother", email: "jane@example.com", phone: "555-1234", blood: "A+", allergies: "None", avatar: '' },
      { name: "John Doe", relation: "Father", email: "john@example.com", phone: "555-5678", blood: "O-", allergies: "Peanuts", avatar: '' },
    ],
    spouse: [
      { name: "Alex Doe", relation: "Spouse", email: "alex@example.com", phone: "555-9999", blood: "B+", allergies: "None", avatar: '' },
    ],
    children: [
      { name: "Lucas Doe", relation: "Son", email: "lucas@example.com", phone: "555-1111", blood: "A-", allergies: "None", avatar: '' },
      { name: "Sophia Doe", relation: "Daughter", email: "sophia@example.com", phone: "555-2222", blood: "O+", allergies: "Milk", avatar: '' },
    ],
  });
  const [editMember, setEditMember] = useState({ name: "", relation: "", email: "", phone: "", blood: "", allergies: "", avatar: '' });
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
    setEditMember({ name: "", relation: "", email: "", phone: "", blood: "", allergies: "", avatar: '' });
  };
  const handleDeleteMember = () => {
    if (openModal == null || editIndex == null) return;
    setMembers(prev => {
      const updated = { ...prev };
      updated[openModal] = updated[openModal].filter((_, i) => i !== editIndex);
      return updated;
    });
    setEditIndex(null);
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

  // Enhanced glassy popup styling (unified across pages)
  const popupPaperSx = {
    background: 'linear-gradient(145deg, rgba(24,26,48,0.92), rgba(22,24,45,0.94))',
    backdropFilter: 'blur(18px) saturate(100%)',
    borderRadius: 5,
    boxShadow: '0 18px 60px -4px rgba(0,0,0,0.65), 0 4px 18px rgba(0,0,0,0.4)',
    border: '1.5px solid rgba(90,98,160,0.35)',
    color: '#fff',
    overflow: 'hidden'
  };

  const sectionCardSx = {
    background: 'linear-gradient(180deg, rgba(24,26,47,0.7) 0%, rgba(22,24,45,0.7) 100%)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 3,
    p: 2,
    mb: 2,
  };

  // Unified enhanced input styling (matches Medical Profile popups)
  const inputSx = {
    width: '100%',
    ml: 0,
    '& .MuiOutlinedInput-root': {
      background: 'linear-gradient(180deg, rgba(34,36,65,0.9) 0%, rgba(30,32,58,0.9) 100%)',
      borderRadius: 2.2,
      border: '1px solid #2b2d55',
      color: '#fff',
      cursor: 'pointer',
      '& fieldset': { borderColor: 'transparent' },
      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.18)' },
      '&.Mui-focused fieldset': { borderColor: '#3b3df2', boxShadow: '0 0 0 1px #3b3df255' }
    },
    '& .MuiInputBase-input': { color: '#e7e9f3', fontSize: 14, fontWeight: 400, padding: '10px 12px', cursor: 'pointer' },
    '& .MuiOutlinedInput-input': { '::placeholder': { color: '#95a0d4', opacity: 1 } },
    '& .MuiInputAdornment-root': { color: '#aeb3d5' },
    '& .MuiInputLabel-root': { color: '#aeb3d5', fontSize: 12, fontWeight: 600 },
    '& .MuiInputLabel-root.Mui-focused': { color: '#e7e9f3' },
    '& .MuiSelect-select': { pr: '36px !important', cursor: 'pointer' },
    '& .MuiSvgIcon-root': { color: '#9fa5cb' }
  };

  // Select Menu theme override (mirrors Medical Profile)
  const selectProps = {
    IconComponent: ExpandMoreRoundedIcon,
    sx: {
      '& .MuiSelect-icon': {
        color: '#9ca3af',
        fontSize: '1.5rem',
        right: 8,
      },
      '& .MuiSelect-select': {
        paddingRight: '40px !important',
      },
    },
    MenuProps: {
      PaperProps: {
        sx: {
          bgcolor: 'rgba(30,32,55,0.96)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 2,
          '& .MuiMenuItem-root': { 
            fontSize: 14,
            color: '#fff',
            '&:hover': {
              backgroundColor: 'rgba(106, 106, 252, 0.1)',
            },
            '&.Mui-selected': {
              backgroundColor: 'rgba(106, 106, 252, 0.2)',
              '&:hover': {
                backgroundColor: 'rgba(106, 106, 252, 0.3)',
              },
            },
          }
        }
      }
    }
  };

  const bloodTypes = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];

  const handleAvatarChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setEditMember(m => ({ ...m, avatar: reader.result }));
    reader.readAsDataURL(file);
  };

  // Reusable date field with custom calendar icon + full-surface click
  const QuickDateField = ({ label = 'Date', value, onChange }) => (
    <TextField
      size='small'
      label={label}
      type='date'
      value={value || ''}
      onChange={(e)=> onChange && onChange(e.target.value)}
      sx={{
        ...inputSx,
        '& input[type="date"]::-webkit-calendar-picker-indicator': { opacity: 0, display: 'none' },
        '& input[type="date"]': { cursor: 'pointer' },
      }}
      InputLabelProps={{ shrink: true }}
      InputProps={{ endAdornment: (<InputAdornment position='end'><CalendarTodayIcon sx={{ fontSize: 18, color: '#9fa5cb' }} /></InputAdornment>) }}
      onMouseDown={(e)=> {
        const input = e.currentTarget.querySelector('input');
        if (input && input.showPicker) { e.preventDefault(); input.showPicker(); }
      }}
    />
  );

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

  // Real provider search state (NPI)
  const [provQuery, setProvQuery] = useState("");
  const [provLoc, setProvLoc] = useState({ city: "", state: "", zip: "" });
  const [provLoading, setProvLoading] = useState(false);
  const [provResults, setProvResults] = useState([]);

  const runProviderSearch = async () => {
    setProvLoading(true);
    try {
      const params = new URLSearchParams();
      if (provQuery) params.set('q', provQuery);
      if (provLoc.city) params.set('city', provLoc.city);
      if (provLoc.state) params.set('state', provLoc.state);
      if (provLoc.zip) params.set('zip', provLoc.zip);
      const r = await fetch(`${API}/api/providers/real-search?${params.toString()}`);
      const j = await r.json();
      setProvResults(Array.isArray(j.providers) ? j.providers : []);
    } catch (_) {
      setProvResults([]);
    }
    setProvLoading(false);
  };

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
            <CarInformations popupVariant='settings' />
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
            <Dialog open={!!openPopup} onClose={() => setOpenPopup(null)} maxWidth='md' fullWidth PaperProps={{ sx: popupPaperSx }}>
              <DialogTitle sx={{ position: 'relative', px: 5, pt: 3.25, pb: 2.25 }}>
                <VuiTypography variant='lg' fontWeight='bold' color='white' sx={{ fontSize: 23, letterSpacing: 0.3 }}>
                  {openPopup}
                </VuiTypography>
                <IconButton aria-label='close' onClick={() => setOpenPopup(null)} sx={{ position: 'absolute', right: 14, top: 12, color: '#9fa3c1', '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.08)' } }}>
                  <CloseRoundedIcon />
                </IconButton>
              </DialogTitle>
              <Divider sx={{ borderColor: '#23244a' }} />
              <DialogContent sx={{ px: 5, py: 3.5 }}>
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
                          <TextField size='small' variant='outlined' placeholder='Family Member' fullWidth sx={inputSx} />
                        </Grid>
                        <Grid item xs={12} sm={4} md={3}>
                          <QuickDateField label='Date' />
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
                        <Grid item xs={12} sm={5} md={6}>
                          <TextField size='small' variant='outlined' placeholder='Doctor name or Specialty (e.g., cardiology)' value={provQuery} onChange={(e)=>setProvQuery(e.target.value)} fullWidth sx={inputSx} InputProps={{ startAdornment: (<InputAdornment position='start'><SearchIcon sx={{ color: '#aeb3d5' }} /></InputAdornment>) }} />
                        </Grid>
                        <Grid item xs={6} sm={3} md={2.5}>
                          <TextField size="small" variant="outlined" placeholder="City" value={provLoc.city} onChange={(e)=>setProvLoc(v=>({...v, city:e.target.value}))} fullWidth sx={inputSx} />
                        </Grid>
                        <Grid item xs={3} sm={2} md={1.5}>
                          <TextField size="small" variant="outlined" placeholder="State" value={provLoc.state} onChange={(e)=>setProvLoc(v=>({...v, state:e.target.value}))} fullWidth sx={inputSx} />
                        </Grid>
                        <Grid item xs={3} sm={2} md={2}>
                          <TextField size="small" variant="outlined" placeholder="ZIP" value={provLoc.zip} onChange={(e)=>setProvLoc(v=>({...v, zip:e.target.value}))} fullWidth sx={inputSx} />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                          <VuiButton size="small" color="info" sx={smallActionBtnSx} onClick={runProviderSearch} disabled={provLoading}>{provLoading? 'Searching…' : 'Search'}</VuiButton>
                        </Grid>
                      </Grid>
                    </VuiBox>
                    <VuiBox sx={sectionCardSx}>
                      <VuiTypography color="white" fontWeight="bold" mb={1} sx={{ fontSize: 18 }}>Results</VuiTypography>
                      {(!provResults || provResults.length === 0) ? (
                        <VuiTypography color="text" sx={{ fontSize: 15 }}>No providers found</VuiTypography>
                      ) : (
                        <VuiBox>
                          {provResults.slice(0,20).map((p, idx) => (
                            <VuiBox key={p.id || idx} sx={{ ...memberRowBoxSx, mb: 1 }}>
                              <Grid container spacing={1.25} alignItems="center">
                                <Grid item xs={12} md={5}>
                                  <VuiTypography color="white" sx={{ fontSize: 14, fontWeight: 700 }}>{p.name}</VuiTypography>
                                  <VuiTypography color="text" sx={{ fontSize: 13 }}>{p.specialty || p.taxonomy || '—'}</VuiTypography>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <PlaceOutlinedIcon sx={{ fontSize: 16, color: '#aeb3d5' }} />
                                    <VuiTypography color="text" sx={{ fontSize: 13 }}>{p.location || [p.city,p.state].filter(Boolean).join(', ')}</VuiTypography>
                                  </Stack>
                                  {p.phone && (
                                    <Stack direction="row" spacing={1} alignItems="center">
                                      <PhoneInTalkOutlinedIcon sx={{ fontSize: 16, color: '#aeb3d5' }} />
                                      <VuiTypography color="text" sx={{ fontSize: 13 }}>{p.phone}</VuiTypography>
                                    </Stack>
                                  )}
                                </Grid>
                                <Grid item xs={12} md={3}>
                                  <Stack direction="row" spacing={1} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                                    <VuiButton size="small" color="info" sx={smallActionBtnSx} onClick={async ()=>{ const saved = await addProvider(p); }}>{'Save'}</VuiButton>
                                    <VuiButton size="small" color="primary" sx={smallActionBtnSx}>Schedule</VuiButton>
                                  </Stack>
                                </Grid>
                              </Grid>
                            </VuiBox>
                          ))}
                        </VuiBox>
                      )}
                    </VuiBox>
                  </>
                )}
              </DialogContent>
              <Divider sx={{ borderColor: '#23244a', mt: 0.5 }} />
              <DialogActions sx={{ px: 5, py: 2.4 }}>
                <Button onClick={() => setOpenPopup(null)} sx={{ color: '#fff', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 2.2, py: 1, background: 'rgba(255,255,255,0.04)', '&:hover': { background: 'rgba(255,255,255,0.08)' } }}>Close</Button>
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
  <Dialog open={!!openModal} onClose={handleCloseModal} maxWidth='md' fullWidth PaperProps={{ sx: { ...popupPaperSx, width:{ xs:'100%', sm:640, md:700 }, minHeight:570 } }}>
        <DialogTitle sx={{ position: 'relative', px: 5, pt: 3.25, pb: 2.25 }}>
          <VuiTypography variant='lg' fontWeight='bold' color='white' sx={{ fontSize: 23, letterSpacing: 0.3 }}>
            {openModal ? `${openModal.charAt(0).toUpperCase() + openModal.slice(1)} Members` : ''}
          </VuiTypography>
          <IconButton aria-label='close' onClick={handleCloseModal} sx={{ position: 'absolute', right: 14, top: 12, color: '#9fa3c1', '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.08)' } }}>
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <Divider sx={{ borderColor: '#23244a' }} />
        <DialogContent sx={{ px: 5, py: 3.5 }}>
          {openModal && editIndex === null && (
            <>
              <VuiBox component="ul" sx={{ listStyle: 'none', p: 0, m: 0, mb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {members[openModal].map((m, i) => (
                  <li key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px',
                    background: 'linear-gradient(180deg, rgba(24,26,47,0.7) 0%, rgba(22,24,45,0.7) 100%)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12
                  }}>
                    <Avatar src={m.avatar || undefined} sx={{ width: 46, height: 46, bgcolor: '#34365e', fontSize: 17, fontWeight: 600 }}>
                      {(m.name||'?').charAt(0)}
                    </Avatar>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600, fontSize: 15 }}>{m.name} <span style={{ color: '#6a6afc', fontWeight: 500 }}>({m.relation})</span></span>
                      <span style={{ fontSize: 12.5, color: '#bdbdfc', marginTop: 2 }}>Email: {m.email} | Phone: {m.phone}</span>
                      <span style={{ fontSize: 12.5, color: '#bdbdfc' }}>Blood: {m.blood} | Allergies: {m.allergies}</span>
                    </div>
                    <Tooltip title="Edit member details"><Button size="small" sx={{ color: '#6a6afc', textTransform: 'none', fontWeight: 600 }} onClick={() => handleEdit(openModal, i)}>Edit</Button></Tooltip>
                  </li>
                ))}
              </VuiBox>
              <Tooltip title="Add a new family member"><Button variant="contained" sx={{ mt: 0.5, background: 'linear-gradient(90deg,#6a6afc,#8b8bfc)', color: '#fff', borderRadius: 2, fontWeight: 700, textTransform: 'none', px: 3, py: 1, boxShadow: '0 2px 8px #6a6afc33' }} onClick={handleAddMember}>Add Member</Button></Tooltip>
            </>
          )}
          {openModal && editIndex !== null && (
            <form style={{ width: '100%' }}>
              <input hidden type="file" id="family-avatar-upload" accept="image/*" onChange={handleAvatarChange} />
              <VuiBox display="flex" alignItems="center" gap={2} mb={3} mt={1}>
                <Tooltip title="Upload photo">
                  <Avatar
                    src={editMember.avatar || undefined}
                    sx={{ width: 62, height: 62, bgcolor: '#2f315a', fontSize: 20, fontWeight: 600, cursor: 'pointer', position: 'relative' }}
                    onClick={() => document.getElementById('family-avatar-upload')?.click()}
                  >
                    {(editMember.name||'?').charAt(0)}
                  </Avatar>
                </Tooltip>
                <VuiTypography color="text" sx={{ fontSize: 13 }}>Click the avatar to upload / change photo.</VuiTypography>
              </VuiBox>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 14, width: '100%' }}>
                <TextField size='small' label="Name" name="name" value={editMember.name} onChange={handleEditChange} fullWidth sx={inputSx} />
                <TextField size='small' label="Relation" name="relation" value={editMember.relation} onChange={handleEditChange} fullWidth sx={inputSx} />
                <TextField size='small' label="Email" name="email" value={editMember.email} onChange={handleEditChange} fullWidth sx={inputSx} />
                <TextField size='small' label="Phone" name="phone" value={editMember.phone} onChange={handleEditChange} fullWidth sx={inputSx} />
                <Autocomplete
                  size='small'
                  options={bloodTypes}
                  value={editMember.blood || null}
                  onChange={(_, val) => setEditMember(prev => ({ ...prev, blood: val || '' }))}
                  autoHighlight
                  clearOnEscape
                  disableClearable
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Blood Type"
                      placeholder="Select blood type"
                      InputLabelProps={{ shrink: true, style: { color: '#aeb3d5' } }}
                      sx={{
                        ...inputSx,
                        '& .MuiOutlinedInput-input': { py: 1 },
                      }}
                    />
                  )}
                  sx={{
                    '& .MuiOutlinedInput-root': { p: 0.25, pr: 1 },
                    '& .MuiAutocomplete-endAdornment': {
                      '& .MuiSvgIcon-root': {
                        color: '#9fa5cb',
                        fontSize: '1.2rem',
                      },
                    },
                  }}
                  ListboxProps={{ 
                    style: { 
                      maxHeight: 240,
                      backgroundColor: 'rgba(30,32,55,0.96)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 8,
                    }
                  }}
                  componentsProps={{
                    paper: {
                      sx: {
                        backgroundColor: 'rgba(30,32,55,0.96)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 2,
                        '& .MuiAutocomplete-option': {
                          color: '#fff',
                          fontSize: 14,
                          '&:hover': {
                            backgroundColor: 'rgba(106, 106, 252, 0.1)',
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'rgba(106, 106, 252, 0.2)',
                          },
                        },
                      },
                    },
                  }}
                />
                <TextField size='small' label="Allergies" name="allergies" value={editMember.allergies} onChange={handleEditChange} fullWidth multiline minRows={2} sx={inputSx} />
              </div>
            </form>
          )}
        </DialogContent>
        <Divider sx={{ borderColor: '#23244a', mt: 0.5 }} />
        <DialogActions sx={{ px: 5, py: 2.4, gap: 1 }}>
          <Button onClick={handleCloseModal} sx={{ color: '#fff', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 2.2, py: 1, background: 'rgba(255,255,255,0.04)', '&:hover': { background: 'rgba(255,255,255,0.08)' } }}>Close</Button>
          {openModal && editIndex !== null && (
            <>
              <Button onClick={() => setEditIndex(null)} sx={{ color: '#fff', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 2.2, py: 1, background: 'rgba(255,255,255,0.04)', '&:hover': { background: 'rgba(255,255,255,0.10)' } }}>Back</Button>
              {editIndex < members[openModal].length && (
                <Button onClick={handleDeleteMember} sx={{ color: '#fff', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 2.2, py: 1, background: 'linear-gradient(90deg,#b92e2e,#d84343)', '&:hover': { background: 'linear-gradient(90deg,#d84343,#b92e2e)' } }}>Delete</Button>
              )}
              <Button onClick={editIndex < members[openModal].length ? handleSaveEdit : handleSaveAdd} sx={{ color: '#fff', borderRadius: 2.2, textTransform: 'none', fontWeight: 700, px: 2.7, py: 1.05, background: 'linear-gradient(90deg,#5353f6,#7d7dfc)', boxShadow: '0 4px 14px -2px #5353f666', '&:hover': { background: 'linear-gradient(90deg,#7d7dfc,#5353f6)' } }}>
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
