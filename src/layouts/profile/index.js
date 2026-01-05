// @mui material components
// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
// Settings action icons
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import HealthAndSafetyOutlinedIcon from "@mui/icons-material/HealthAndSafetyOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
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
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import InputAdornment from "@mui/material/InputAdornment";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Chip from "@mui/material/Chip";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
// Icons for Resources section
import ElderlyIcon from "@mui/icons-material/Elderly";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import FamilyRestroomOutlinedIcon from "@mui/icons-material/FamilyRestroomOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import LocalPharmacyOutlinedIcon from "@mui/icons-material/LocalPharmacyOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import VolunteerActivismOutlinedIcon2 from "@mui/icons-material/VolunteerActivismOutlined";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import AccessibleForwardOutlinedIcon from "@mui/icons-material/AccessibleForwardOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import MilitaryTechOutlinedIcon from "@mui/icons-material/MilitaryTechOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import AddLinkOutlinedIcon from "@mui/icons-material/AddLinkOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
// Icons for Medical & Family library tiles
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
// Use a broadly available group icon to avoid version issues
// (fallback for older @mui/icons-material versions)
// We'll reuse GroupOutlinedIcon already imported above for resources tab
// so no new dependency is needed.
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
// Chat status icons
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import countries from "./countries.json"; // You will need to add a countries.json file with all country names
import { useState, useRef, useEffect } from "react";
import { useAuth } from "hooks/useAuth";
import { auth, db } from "lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import getApiBase from "../../lib/apiBase";
import { searchActionBus } from "lib/searchActions";
import VuiButton from "components/VuiButton";
import MiniDayCalendar from "components/MiniDayCalendar";
import { AppointmentProvider } from "context/AppointmentContext";

// Simple, modern section card for Settings area
function SettingsSection({ title, actions, onAction, onViewAll }) {
  // Map action labels to icons so callers can keep passing simple strings
  const iconMap = {
    // Record
    "Visits": EventNoteOutlinedIcon,
    "Test Results": ScienceOutlinedIcon,
    "End of Life Planning": VolunteerActivismOutlinedIcon,
    "Medical and Family History": ArticleOutlinedIcon,
    "Preventive Care": HealthAndSafetyOutlinedIcon,
    // Communication
    "Messages": ChatBubbleOutlineOutlinedIcon,
    "Ask Questions": HelpOutlineOutlinedIcon,
    "Letters": MailOutlineOutlinedIcon,
  "Community Resources": GroupOutlinedIcon,
    "Report Problems": ReportProblemOutlinedIcon,
  };

  const renderIcon = (label) => {
    const Icon = iconMap[label] || ArrowForwardIosOutlinedIcon;
    return <Icon sx={{ fontSize: 18, opacity: 0.9 }} />;
  };
  return (
    <>
      <VuiTypography color="white" fontWeight="bold" mb={1.25} sx={{ letterSpacing: 0.3 }}>
        {title}
      </VuiTypography>
      <VuiBox display="flex" flexDirection="column" gap={0.75}>
        {actions.map((label, idx) => (
          <VuiTypography
            key={idx}
            role="button"
            tabIndex={0}
            onClick={() => onAction?.(label)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onAction?.(label); }}
            variant="button"
            color="text"
            fontWeight="regular"
            sx={{
              userSelect: 'none',
              cursor: 'pointer',
              letterSpacing: 0.2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 1.25,
              py: 0.75,
              borderRadius: 2,
              backgroundColor: 'transparent',
              boxShadow: 'none',
              transition: 'color .15s ease, background-color .15s ease',
              '&:hover': {
                color: '#e7e9f3',
                backgroundColor: 'rgba(255,255,255,0.03)'
              },
              '&:focus-visible': { outline: '2px solid rgba(0,255,208,0.5)', outlineOffset: 2 },
            }}
          >
            {renderIcon(label)}
            <span>{label}</span>
          </VuiTypography>
        ))}
      </VuiBox>
      <VuiButton variant="text" size="small" sx={{ mt: 1.25, color: "#aeb3d5", fontWeight: 700, px: 0, '&:hover': { color: '#00FFD0' } }} onClick={onViewAll}>VIEW ALL</VuiButton>
    </>
  );
}

function Overview() {
  const { user } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [careTeamOpen, setCareTeamOpen] = useState(false);
  const [recordOpen, setRecordOpen] = useState(false);
  const [communicationOpen, setCommunicationOpen] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    mobile: "--",
    email: "--",
    location: "United States",
    dateOfBirth: "",
    sex: "",
    bloodType: "",
    wheelchair: "",
  });
  // Onboarding helpers
  const [onboardingSkipped, setOnboardingSkipped] = useState(() => {
    try { return localStorage.getItem('onboardingSkipV1') === '1'; } catch (_) { return false; }
  });
  const [profileSaveError, setProfileSaveError] = useState('');
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);
  // Prefetch dialog deps to speed up first open
  const prefetchProfileDialog = () => {
    try {
      import(/* webpackPrefetch: true */ '@mui/material/Dialog');
      import(/* webpackPrefetch: true */ '@mui/material/TextField');
      import(/* webpackPrefetch: true */ '@mui/material/MenuItem');
    } catch (_) {}
  };
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
  const handleProfileSave = async () => {
    // Enforce required fields unless user chooses Skip
    const requiredMissing = !(
      (profile.firstName && profile.firstName.trim()) &&
      (profile.lastName && profile.lastName.trim()) &&
      (profile.email && profile.email !== '--' && profile.email.trim()) &&
      (profile.dateOfBirth && profile.dateOfBirth.trim())
    );
    if (requiredMissing) {
      setProfileSaveError('Please fill first name, last name, email, and date of birth.');
      return;
    }
    try {
      if (db && auth?.currentUser) {
        const uid = auth.currentUser.uid;
        const ref = doc(db, 'users', uid);
  const toSave = {
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          phoneNumber: profile.mobile && profile.mobile !== '--' ? profile.mobile : '',
          email: profile.email && profile.email !== '--' ? profile.email : (auth.currentUser.email || ''),
          location: profile.location || '',
          dateOfBirth: profile.dateOfBirth || '',
          sex: profile.sex || '',
          bloodType: profile.bloodType || '',
          wheelchair: profile.wheelchair || '',
          updatedAt: new Date().toISOString(),
        };
        await setDoc(ref, toSave, { merge: true });
      }
    } catch (e) { console.error(e); }
    setProfileSaveError('');
    setEditOpen(false);
  };
  const handleSkipForNow = () => {
    try { localStorage.setItem('onboardingSkipV1', '1'); } catch (_) {}
    setOnboardingSkipped(true);
    setProfileSaveError('');
    setEditOpen(false);
  };
  // Prefill from Firebase user / Firestore on load
  useEffect(() => {
    (async () => {
      try {
        const fbu = auth?.currentUser;
        let fsDoc = null;
        if (db && fbu?.uid) {
          try {
            const snap = await getDoc(doc(db, 'users', fbu.uid));
            fsDoc = snap.exists() ? snap.data() : null;
          } catch (_) {}
        }
  const displayName = fsDoc?.displayName || fbu?.displayName || '';
        const email = fsDoc?.email || fbu?.email || '';
        const phone = fsDoc?.phoneNumber || fbu?.phoneNumber || '';
        const parts = (displayName || '').trim().split(/\s+/).filter(Boolean);
        const firstName = fsDoc?.firstName || parts[0] || '';
        const lastName = fsDoc?.lastName || (parts.length > 1 ? parts.slice(1).join(' ') : '');
        setProfile((p) => ({
          ...p,
          firstName,
          lastName,
          email: email || '--',
          mobile: phone || '--',
          location: fsDoc?.location || p.location,
          dateOfBirth: fsDoc?.dateOfBirth || '',
          sex: fsDoc?.sex || '',
          bloodType: fsDoc?.bloodType || '',
          wheelchair: fsDoc?.wheelchair || '',
        }));
        // If required fields missing, open edit dialog
  const missing = !(firstName && lastName && email && (fsDoc?.dateOfBirth || ''));
  if (missing && !onboardingSkipped) setEditOpen(true);
      } catch (e) { console.error(e); }
    })();
  // Trigger a prefetch soon after mount so the dialog opens faster
  // eslint-disable-next-line
  }, []);

  // Trigger a prefetch soon after mount so the dialog opens faster
  useEffect(() => {
    const t = setTimeout(prefetchProfileDialog, 300);
    return () => clearTimeout(t);
  }, []);

  // removed Care Team dialog since section is no longer displayed
  const [recordDialog, setRecordDialog] = useState(false);
  const [communicationDialog, setCommunicationDialog] = useState(false);
  const [commTab, setCommTab] = useState(0);
  const [recordTab, setRecordTab] = useState(0);
  // Records state
  const [records, setRecords] = useState({ notes: { endOfLife: '', medicalFamily: '' }, eol: { notes: '', insurance: { provider: '', policyNumber: '', groupNumber: '', phone: '', memberId: '' }, directives: { healthcareProxyName: '', healthcareProxyPhone: '', livingWillOnFile: false, dnrOnFile: false, preferredHospital: '' }, donorStatus: 'Unknown', documentLinks: [], resources: [] }, visits: [], tests: [], updatedAt: null });
  const [eolDraft, setEolDraft] = useState('');
  const [eol, setEol] = useState({ notes: '', insurance: { provider: '', policyNumber: '', groupNumber: '', phone: '', memberId: '' }, directives: { healthcareProxyName: '', healthcareProxyPhone: '', livingWillOnFile: false, dnrOnFile: false, preferredHospital: '' }, donorStatus: 'Unknown', documentLinks: [], resources: [] });
  const [newDocLabel, setNewDocLabel] = useState('');
  const [newDocUrl, setNewDocUrl] = useState('');
  const [eolSnackbar, setEolSnackbar] = useState(false);
  const [eolSavedAt, setEolSavedAt] = useState(null);
  const [mfDraft, setMfDraft] = useState('');
  const [mfSavedAt, setMfSavedAt] = useState(null);
  const [askForm, setAskForm] = useState({ question: "", email: "", phone: "", category: "General", categoryOther: "", replyEmail: true, replySMS: false });
  const [askFiles, setAskFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [askSnackbar, setAskSnackbar] = useState(false);
  // Report form states
  const [reportForm, setReportForm] = useState({ description: "", email: "", phone: "", category: "Bug", categoryOther: "", severity: "Normal", replyEmail: true, replySMS: false });
  const [reportFiles, setReportFiles] = useState([]);
  const reportFileInputRef = useRef(null);
  const [reportSnackbar, setReportSnackbar] = useState(false);
  // Medical & Family files state
  const [mfFiles, setMfFiles] = useState([]);
  const [mfCategory, setMfCategory] = useState('All'); // legacy filter
  const [mfNewLabel, setMfNewLabel] = useState(''); // legacy label (kept for compatibility)
  const [mfNewCategory, setMfNewCategory] = useState('Self'); // legacy upload category
  // New: simple tile navigation state (null = tile view)
  const [mfSelectedTile, setMfSelectedTile] = useState(null); // 'Self' | 'Family' | 'Pets' | 'Other' | null

  const tileStyle = (active) => ({
    background: active
      ? 'linear-gradient(180deg, rgba(106,106,252,0.2) 0%, rgba(24,26,47,0.9) 100%)'
      : 'linear-gradient(180deg, rgba(24,26,47,0.9) 0%, rgba(22,24,45,0.9) 100%)',
    border: `1px solid ${active ? 'rgba(106,106,252,0.6)' : 'rgba(255,255,255,0.08)'}`,
    borderRadius: '6px',
    p: 2,
    display: 'flex',
    alignItems: 'flex-start',
    gap: 1.25,
    cursor: 'pointer',
    transition: 'transform .15s ease, box-shadow .15s ease, border-color .15s ease',
    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 30px rgba(0,0,0,0.35)', borderColor: '#6a6afc' }
  });

  // helpers
  const isValidEmail = (v) => !v || /[^@\s]+@[^@\s]+\.[^@\s]+/.test(v);
  const isValidPhone = (v) => !v || /[0-9]{7,}/.test((v || '').replace(/\D/g, ''));
  // Prefer explicit env override; otherwise, when running on localhost (any port != 3001), use backend on 3001; else same-origin
  const apiBase = getApiBase();

  // autofill from profile
  useEffect(() => {
    const email = profile.email && profile.email !== '--' ? profile.email : '';
    const phone = profile.mobile && profile.mobile !== '--' ? profile.mobile : '';
    setAskForm((f) => ({ ...f, email: f.email || email, phone: f.phone || phone }));
    setReportForm((f) => ({ ...f, email: f.email || email, phone: f.phone || phone }));
  // eslint-disable-next-line
  }, []);

  // Load records when dialog opens
  useEffect(() => {
    if (!recordDialog) return;
    (async () => {
      try {
        const res = await fetch(`${apiBase}/api/records`);
        if (!res.ok) return;
        const json = await res.json();
        if (json?.ok && json.data) {
          setRecords(json.data);
          const eolData = json.data.eol || { notes: json.data?.notes?.endOfLife || '' };
          setEol({
            notes: eolData.notes || '',
            insurance: { provider: eolData?.insurance?.provider || '', policyNumber: eolData?.insurance?.policyNumber || '', groupNumber: eolData?.insurance?.groupNumber || '', phone: eolData?.insurance?.phone || '', memberId: eolData?.insurance?.memberId || '' },
            directives: { healthcareProxyName: eolData?.directives?.healthcareProxyName || '', healthcareProxyPhone: eolData?.directives?.healthcareProxyPhone || '', livingWillOnFile: !!eolData?.directives?.livingWillOnFile, dnrOnFile: !!eolData?.directives?.dnrOnFile, preferredHospital: eolData?.directives?.preferredHospital || '' },
            donorStatus: eolData?.donorStatus || 'Unknown',
            documentLinks: Array.isArray(eolData?.documentLinks) ? eolData.documentLinks : [],
            resources: Array.isArray(eolData?.resources) ? eolData.resources : [],
          });
          setEolDraft(eolData.notes || json.data.notes?.endOfLife || '');
          setEolSavedAt(json.data.updatedAt || null);
          setMfDraft(json.data.notes?.medicalFamily || '');
          setMfSavedAt(json.data.updatedAt || null);
        }
      } catch (e) { console.error(e); }
      try {
        const list = await fetch(`${apiBase}/api/records/mf-files`);
        if (list.ok) {
          const json = await list.json();
          if (json?.ok) setMfFiles(json.files || []);
        }
      } catch (e) { console.error(e); }
    })();
  // eslint-disable-next-line
  }, [recordDialog]);

  const handleAskSubmit = async () => {
    if ((askForm.replyEmail && !isValidEmail(askForm.email)) || (askForm.replySMS && !isValidPhone(askForm.phone)) || !askForm.question.trim()) return;
    const fd = new FormData();
    fd.append('question', askForm.question.trim());
    fd.append('email', askForm.email || '');
    fd.append('phone', askForm.phone || '');
    fd.append('category', askForm.category);
    fd.append('categoryOther', askForm.category === 'Other' ? (askForm.categoryOther || '') : '');
    fd.append('replyEmail', String(askForm.replyEmail));
    fd.append('replySMS', String(askForm.replySMS));
    askFiles.forEach(f => fd.append('files', f));
    try {
      const res = await fetch(`${apiBase}/api/support/ask`, { method: 'POST', body: fd });
      if (!res.ok) throw new Error('submit failed');
      setAskSnackbar(true);
      setAskForm({ question: '', email: askForm.email, phone: askForm.phone, category: 'General', categoryOther: '', replyEmail: true, replySMS: false });
      setAskFiles([]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleReportSubmit = async () => {
    if ((reportForm.replyEmail && !isValidEmail(reportForm.email)) || (reportForm.replySMS && !isValidPhone(reportForm.phone)) || !reportForm.description.trim()) return;
    const fd = new FormData();
    fd.append('description', reportForm.description.trim());
    fd.append('email', reportForm.email || '');
    fd.append('phone', reportForm.phone || '');
    fd.append('category', reportForm.category);
    fd.append('categoryOther', reportForm.category === 'Other' ? (reportForm.categoryOther || '') : '');
    fd.append('severity', reportForm.severity);
    fd.append('replyEmail', String(reportForm.replyEmail));
    fd.append('replySMS', String(reportForm.replySMS));
    reportFiles.forEach(f => fd.append('files', f));
    try {
      const res = await fetch(`${apiBase}/api/support/report`, { method: 'POST', body: fd });
      if (!res.ok) throw new Error('submit failed');
      setReportSnackbar(true);
      setReportForm({ description: '', email: reportForm.email, phone: reportForm.phone, category: 'Bug', categoryOther: '', severity: 'Normal', replyEmail: true, replySMS: false });
      setReportFiles([]);
    } catch (e) {
      console.error(e);
    }
  };

  // Add state for chat popup and chat logic
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [chatMessages, setChatMessages] = useState({}); // { doctorName: [ {from, text, time, status?} ] }
  const [chatInput, setChatInput] = useState("");
  const messagesContainerRef = useRef(null);
  const doctors = ["Dr. Smith", "Dr. Lee", "Dr. Patel"];
  const doctorDetails = {
  "Dr. Smith": { avatar: team1, hospital: "City Medical Center", email: "smith@hospital.com", phone: "(555) 123-4567", location: "Los Angeles, CA", specialty: "Internal Medicine", status: "online" },
  "Dr. Lee": { avatar: team2, hospital: "Bay Area Health", email: "lee@hospital.com", phone: "(555) 987-6543", location: "San Francisco, CA", specialty: "Cardiology", status: "offline" },
  "Dr. Patel": { avatar: team3, hospital: "Metro Clinic", email: "patel@hospital.com", phone: "(555) 246-8100", location: "New York, NY", specialty: "Family Medicine", status: "online" },
  };

  // Handler to open chat with a doctor
  const [showDoctorInfo, setShowDoctorInfo] = useState(true);
  const handleOpenChat = (doctor) => {
    setSelectedDoctor(doctor);
    setChatOpen(true);
    setShowDoctorInfo(true);
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
        { from: "You", text: chatInput, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), status: 'sent' }
      ]
    }));
    // Schedule status updates: delivered -> read
    setTimeout(() => {
      setChatMessages((prev) => {
        const list = [...(prev[selectedDoctor] || [])];
        const idx = list.length - 1;
        if (idx >= 0 && list[idx].from === 'You') list[idx] = { ...list[idx], status: 'delivered' };
        return { ...prev, [selectedDoctor]: list };
      });
    }, 600);
    setTimeout(() => {
      setChatMessages((prev) => {
        const list = [...(prev[selectedDoctor] || [])];
        const idx = list.length - 1;
        if (idx >= 0 && list[idx].from === 'You') list[idx] = { ...list[idx], status: 'read' };
        return { ...prev, [selectedDoctor]: list };
      });
    }, 1600);
    setChatInput("");
  };

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [chatMessages, selectedDoctor, chatOpen]);

  // Listen for search actions to open dialogs
  useEffect(() => {
    const unsubscribe = searchActionBus.subscribe((action) => {
      if (action.type === 'dialog') {
        if (action.target === 'record') {
          setRecordTab(action.tab || 0);
          setRecordDialog(true);
        } else if (action.target === 'communication') {
          setCommTab(action.tab || 0);
          setCommunicationDialog(true);
        }
      }
    });

    return unsubscribe;
  }, []);

  const renderStatus = (status) => {
    if (!status) return null;
    const iconSx = { fontSize: 12, opacity: 0.8 };
    switch (status) {
      case 'sent':
        return <DoneOutlinedIcon sx={iconSx} titleAccess="Sent" />;
      case 'delivered':
        return <DoneAllOutlinedIcon sx={iconSx} titleAccess="Delivered" />;
      case 'read':
        return <VisibilityOutlinedIcon sx={iconSx} titleAccess="Seen" />;
      default:
        return <AccessTimeOutlinedIcon sx={iconSx} titleAccess="Sending" />;
    }
  };

  // Adjust image style to show only a thin horizontal strip (e.g., 36px tall)
  const cardImageStyle = { objectFit: "cover", objectPosition: "top", height: 36 };

  // Reusable styles for tidy section panels and inputs
  const sectionCardSx = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 2,
    p: 1.5,
  };
  const inputSxSmall = {
    background: '#181a2f',
    borderRadius: 1.5,
  input: { color: '#e7e9f3', fontSize: 13, lineHeight: 1.4, py: 0.75 },
  textarea: { color: '#e7e9f3', fontSize: 13, lineHeight: 1.5, padding: '8px 12px' },
    '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #23244a' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#2f3570' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#6a6afc' },
    '& .MuiFormLabel-root': { color: '#aeb3d5', fontSize: 12 },
    '& .MuiOutlinedInput-root': {
      minHeight: 36,
      '& input': { padding: '8px 12px' },
      '& .MuiSelect-select': { padding: '8px 12px', fontSize: 13, lineHeight: 1.4 },
    },
  };
  // Unified field style used inside the "Complete your profile" dialog so
  // all inputs look identical to the Location select appearance
  const dialogFieldSx = {
    '& .MuiFormLabel-root': { color: '#a6b1e1', fontSize: '0.95rem' },
    '& .MuiOutlinedInput-root': { background: '#181a2f', borderRadius: 2 },
    '& .MuiOutlinedInput-notchedOutline': { border: '2px solid #23244a' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#2f3570' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#6a6afc' },
    '& .MuiInputBase-input': { background: '#181a2f', color: '#fff', borderRadius: 2, fontWeight: 500, padding: '10px 12px' },
    '& .MuiSelect-select': { background: '#181a2f', color: '#fff', borderRadius: 2, fontWeight: 500, padding: '10px 12px' },
  };
  // Consistent small label props to avoid floating label overlap
  const inputLabelPropsSmall = { shrink: true, sx: { color: '#aeb3d5', fontSize: 12 } };

  // Actions for the simplified Settings sections
  const recordActions = [
    "Visits",
    "Test Results",
    "End of Life Planning",
    "Medical and Family History",
    "Preventive Care",
  ];
  const communicationActions = [
    "Messages",
    "Ask Questions",
    "Letters",
    "Community Resources",
    "Report Problems",
  ];

  // Messaging: search/filter doctors
  const [doctorQuery, setDoctorQuery] = useState("");
  const filteredDoctors = doctors.filter((name) => {
    const q = doctorQuery.trim().toLowerCase();
    if (!q) return true;
    const d = doctorDetails[name] || {};
    return (
      name.toLowerCase().includes(q) ||
      (d.specialty || "").toLowerCase().includes(q) ||
      (d.hospital || "").toLowerCase().includes(q) ||
      (d.location || "").toLowerCase().includes(q)
    );
  });

  // Curated, trusted health resources (US government and NIH/CDC/HHS)
  const [resourcesQuery, setResourcesQuery] = useState("");
  const resourceCategories = [
    {
      key: "older-adults",
      title: "Older Adults",
  icon: ElderlyIcon,
      blurb: "Healthy aging, fall prevention, and services for seniors.",
      links: [
        { label: "NIA: Health & Aging", href: "https://www.nia.nih.gov/health" },
        { label: "CDC: Older Adults", href: "https://www.cdc.gov/aging/index.html" },
        { label: "Medicare Preventive Services", href: "https://www.medicare.gov/coverage/preventive-screening-services" },
        { label: "Eldercare Locator (ACL)", href: "https://eldercare.acl.gov/Public/Index.aspx" }
      ]
    },
    {
      key: "coverage",
      title: "Coverage & Low‑Cost Care",
      icon: MedicalServicesOutlinedIcon,
      blurb: "Insurance options and low‑cost community clinics.",
      links: [
        { label: "HealthCare.gov (Marketplace)", href: "https://www.healthcare.gov/" },
        { label: "Medicaid.gov", href: "https://www.medicaid.gov/" },
        { label: "CHIP (Children's Coverage)", href: "https://www.medicaid.gov/chip/index.html" },
        { label: "HRSA: Find a Health Center", href: "https://findahealthcenter.hrsa.gov/" }
      ]
    },
    {
      key: "food-housing",
      title: "Food & Housing Assistance",
      icon: HomeOutlinedIcon,
      blurb: "Help with groceries and safe housing.",
      links: [
        { label: "USDA SNAP (Food Assistance)", href: "https://www.fns.usda.gov/snap/supplemental-nutrition-assistance-program" },
        { label: "USDA WIC (Women, Infants, Children)", href: "https://www.fns.usda.gov/wic" },
        { label: "HUD: Housing Assistance", href: "https://www.hud.gov/topics/rental_assistance" },
        { label: "HUD: Homelessness Resources", href: "https://www.hudexchange.info/homelessness-assistance/" }
      ]
    },
    {
      key: "financial",
      title: "Financial Assistance",
      icon: AccountBalanceWalletOutlinedIcon,
      blurb: "Find benefits and financial support programs.",
      links: [
        { label: "Benefits.gov (Benefit Finder)", href: "https://www.benefits.gov/" },
        { label: "HHS: TANF (Cash Assistance)", href: "https://www.acf.hhs.gov/ofa/programs/tanf" },
        { label: "LIHEAP (Energy Assistance)", href: "https://www.acf.hhs.gov/ocs/programs/liheap" },
        { label: "IRS: Earned Income Tax Credit", href: "https://www.irs.gov/credits-deductions/individuals/earned-income-tax-credit-eitc" }
      ]
    },
    {
      key: "disability",
      title: "Disability Services",
      icon: AccessibleForwardOutlinedIcon,
      blurb: "Rights, accommodations, and disability benefits.",
      links: [
        { label: "ADA.gov (Rights & Accessibility)", href: "https://www.ada.gov/" },
        { label: "SSA: Disability Benefits (SSDI/SSI)", href: "https://www.ssa.gov/benefits/disability/" },
        { label: "ACL: Disability & Aging", href: "https://acl.gov/" }
      ]
    },
    {
      key: "crisis",
      title: "Crisis & Helplines",
      icon: SupportAgentOutlinedIcon,
      blurb: "Free, confidential support when you need it.",
      links: [
        { label: "988 Suicide & Crisis Lifeline", href: "https://988lifeline.org/" },
        { label: "SAMHSA: Disaster Distress Helpline", href: "https://www.samhsa.gov/find-help/disaster-distress-helpline" }
      ]
    },
    {
      key: "veterans",
      title: "Veterans",
      icon: MilitaryTechOutlinedIcon,
      blurb: "Health care, benefits, and housing for veterans.",
      links: [
        { label: "VA Health Care", href: "https://www.va.gov/health-care/" },
        { label: "VA Homeless Programs", href: "https://www.va.gov/homeless/" },
        { label: "VA Caregiver Support", href: "https://www.caregiver.va.gov/" }
      ]
    },
    {
      key: "women",
      title: "Women's Health",
  icon: FemaleIcon,
      blurb: "Evidence-based guidance across life stages.",
      links: [
        { label: "Office on Women's Health", href: "https://www.womenshealth.gov/" },
        { label: "CDC: Women's Health", href: "https://www.cdc.gov/women/index.htm" },
        { label: "MedlinePlus: Women's Health", href: "https://medlineplus.gov/womenshealth.html" }
      ]
    },
    {
      key: "men",
      title: "Men's Health",
  icon: MaleIcon,
      blurb: "Screenings, prevention, and healthy living.",
      links: [
        { label: "CDC: Men's Health", href: "https://www.cdc.gov/family/men/" },
        { label: "MedlinePlus: Men's Health", href: "https://medlineplus.gov/menshealth.html" },
        { label: "HHS: MyHealthfinder", href: "https://health.gov/myhealthfinder" }
      ]
    },
    {
      key: "parenthood",
      title: "Pregnancy & Parenthood",
      icon: FamilyRestroomOutlinedIcon,
      blurb: "Pregnancy, infant care, and child development.",
      links: [
        { label: "CDC: Pregnancy", href: "https://www.cdc.gov/pregnancy/index.html" },
        { label: "OWH: Pregnancy", href: "https://www.womenshealth.gov/pregnancy" },
        { label: "MedlinePlus: Pregnancy", href: "https://medlineplus.gov/pregnancy.html" },
        { label: "CDC: Child Development", href: "https://www.cdc.gov/ncbddd/childdevelopment/index.html" }
      ]
    },
    {
      key: "mental",
      title: "Mental Health",
      icon: PsychologyOutlinedIcon,
      blurb: "Understanding conditions and finding help.",
      links: [
        { label: "NIMH: Mental Health", href: "https://www.nimh.nih.gov/health" },
        { label: "SAMHSA: Find Help", href: "https://www.samhsa.gov/find-help" },
        { label: "CDC: Mental Health", href: "https://www.cdc.gov/mentalhealth/index.htm" }
      ]
    },
    {
      key: "vaccines",
      title: "Vaccines",
  icon: LocalPharmacyOutlinedIcon,
      blurb: "Schedules, recommendations, and where to get vaccinated.",
      links: [
        { label: "Vaccines.gov", href: "https://www.vaccines.gov/" },
        { label: "CDC: Adult Schedule", href: "https://www.cdc.gov/vaccines/schedules/hcp/imz/adult.html" },
        { label: "CDC: Vaccines", href: "https://www.cdc.gov/vaccines/index.html" }
      ]
    },
    {
      key: "chronic",
      title: "Chronic Conditions",
  icon: FavoriteBorderOutlinedIcon,
      blurb: "Diabetes, heart disease, and more.",
      links: [
        { label: "CDC: Diabetes", href: "https://www.cdc.gov/diabetes/index.html" },
        { label: "CDC: Heart Disease", href: "https://www.cdc.gov/heartdisease/index.htm" },
        { label: "NIH: NHLBI", href: "https://www.nhlbi.nih.gov/health" },
        { label: "NIH: NIDDK", href: "https://www.niddk.nih.gov/health-information" }
      ]
    },
    {
      key: "nutrition",
      title: "Nutrition & Activity",
      icon: RestaurantOutlinedIcon,
      blurb: "What to eat and how to move, backed by science.",
      links: [
        { label: "MyPlate", href: "https://www.myplate.gov/" },
        { label: "Physical Activity Guidelines", href: "https://health.gov/our-work/physical-activity/current-guidelines" },
        { label: "Dietary Guidelines", href: "https://www.dietaryguidelines.gov/" }
      ]
    },
    {
      key: "caregiving",
      title: "Caregiving",
      icon: VolunteerActivismOutlinedIcon2,
      blurb: "Support for caregivers and care planning.",
      links: [
        { label: "ACL: Caregiver Support", href: "https://acl.gov/help/caregivers" },
        { label: "CDC: Caregiving", href: "https://www.cdc.gov/aging/caregiving/" },
        { label: "NIA: Caregiving", href: "https://www.nia.nih.gov/health/caregiving" }
      ]
    }
  ];
  const filteredResources = resourceCategories.filter((c) => {
    if (!resourcesQuery.trim()) return true;
    const q = resourcesQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.blurb.toLowerCase().includes(q) ||
      c.links.some((l) => l.label.toLowerCase().includes(q))
    );
  });

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
              <CarInformations popupVariant="settings" />
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
                keepMounted
                transitionDuration={0}
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
                  Complete your profile
                </DialogTitle>
                <DialogContent sx={{ color: '#fff', pb: 2, pt: 1,
                  '& .MuiInput-underline:before, & .MuiInput-underline:after': { display: 'none' },
                  '& .MuiInputBase-root:before, & .MuiInputBase-root:after': { display: 'none' },
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none !important' },
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none !important' },
                  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { border: 'none !important' },
                  '& .MuiOutlinedInput-root': { background: '#181a2f', borderRadius: 8 },
                  '& .MuiInputBase-input': { color: '#fff', fontWeight: 500 },
                }}>
                  {profileSaveError && (
                    <Alert severity="warning" sx={{ mb: 1 }}>
                      {profileSaveError}
                    </Alert>
                  )}
                  <Box mb={2}>
                    <Typography sx={{ color: '#a6b1e1', fontWeight: 600, fontSize: '1rem', mb: 1, letterSpacing: 0.5 }}>Contact Information</Typography>
          <TextField
                      margin="dense"
                      label="First Name"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleProfileChange}
                      fullWidth
                      variant="outlined"
                      placeholder="Enter your first name"
                      sx={dialogFieldSx}
                      InputLabelProps={{ shrink: true, sx: { color: '#a6b1e1', fontSize: '0.95rem' } }}
                    />
                    <TextField
                      margin="dense"
                      label="Last Name"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleProfileChange}
                      fullWidth
                      variant="outlined"
                      placeholder="Enter your last name"
                      sx={dialogFieldSx}
                      InputLabelProps={{ shrink: true, sx: { color: '#a6b1e1', fontSize: '0.95rem' } }}
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
                      sx={dialogFieldSx}
                      InputLabelProps={{ shrink: true, sx: { color: '#a6b1e1', fontSize: '0.95rem' } }}
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
                      sx={dialogFieldSx}
                      InputLabelProps={{ shrink: true, sx: { color: '#a6b1e1', fontSize: '0.95rem' } }}
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
                      sx={dialogFieldSx}
                      InputLabelProps={{ shrink: true, sx: { color: '#a6b1e1', fontSize: '0.95rem' } }}
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
                      InputLabelProps={{ shrink: true, sx: { color: '#a6b1e1', fontSize: '0.95rem' } }}
                      placeholder="yyyy-mm-dd"
                      sx={dialogFieldSx}
                    />
                    <TextField
                      margin="dense"
                      label="Sex"
                      name="sex"
                      select
                      value={profile.sex}
                      onChange={handleProfileChange}
                      fullWidth
                      sx={dialogFieldSx}
                      InputLabelProps={{ shrink: true, sx: { color: '#a6b1e1', fontSize: '0.95rem' } }}
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
                      sx={dialogFieldSx}
                      InputLabelProps={{ shrink: true, sx: { color: '#a6b1e1', fontSize: '0.95rem' } }}
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
                      sx={dialogFieldSx}
                      InputLabelProps={{ shrink: true, sx: { color: '#a6b1e1', fontSize: '0.95rem' } }}
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
                  
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'space-between', pb: 1, px: 2 }}>
                  <Button onClick={handleSkipForNow} sx={{ color: '#a6b1e1', background: 'transparent', borderRadius: 2, px: 2, fontWeight: 500, textTransform: 'none' }}>
                    Skip for now
                  </Button>
                  <Box>
                    <Button onClick={handleEditClose} sx={{ color: '#a259ec', background: 'transparent', borderRadius: 2, px: 2, mr: 1, fontWeight: 500, textTransform: 'none' }}>
                      Close
                    </Button>
                    <Button onClick={handleProfileSave} sx={{ color: '#fff', background: 'linear-gradient(90deg, #3a8dde 0%, #6f7cf7 100%)', borderRadius: 2, px: 2, fontWeight: 600, textTransform: 'none' }}>
                      Save
                    </Button>
                  </Box>
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
                  <Grid item xs={12} md={6} xl={6}>
                    <SettingsSection
                      title="Record"
                      actions={recordActions}
                      onAction={(label) => {
                        // Set the appropriate tab based on the clicked item
                        if (label === "Visits") setRecordTab(0);
                        else if (label === "Test Results") setRecordTab(1);
                        else if (label === "End of Life Planning") setRecordTab(2);
                        else if (label === "Medical and Family History") setRecordTab(3);
                        else if (label === "Preventive Care") setRecordTab(4);
                        setRecordDialog(true);
                      }}
                      onViewAll={() => setRecordDialog(true)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} xl={6}>
                    <SettingsSection
                      title="Communication"
                      actions={communicationActions}
                      onAction={(label) => {
                        // Set the appropriate tab based on the clicked item
                        if (label === "Messages") setCommTab(0);
                        else if (label === "Ask Questions") setCommTab(1);
                        else if (label === "Letters") setCommTab(2);
                        else if (label === "Community Resources") setCommTab(3);
                        else if (label === "Report Problems") setCommTab(4);
                        setCommunicationDialog(true);
                      }}
                      onViewAll={() => setCommunicationDialog(true)}
                    />
                  </Grid>
                </Grid>
              </VuiBox>
            </Card>
          </Grid>
        </Grid>

        <Footer />

  {/* Dialogs for each section */}

        {/* Record Dialog content - modern tabbed layout */}
        <Dialog
          open={recordDialog}
          onClose={() => setRecordDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              background: 'linear-gradient(180deg, rgba(22,24,45,0.85) 0%, rgba(20,22,40,0.85) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 3,
              color: 'white',
              boxShadow: '0 16px 60px rgba(0,0,0,0.45)'
            }
          }}
        >
          <DialogTitle sx={{ fontSize: 22, fontWeight: 700, color: '#fff', pb: 1 }}>Record</DialogTitle>
          <DialogContent sx={{ pt: 0 }}>
            <VuiTypography color="text" variant="button" mb={1.5} sx={{ fontSize: 16 }}>
              Manage your health records, test results, and planning.
            </VuiTypography>

            <Tabs
              value={recordTab}
              onChange={(e, v) => setRecordTab(v)}
              variant="scrollable"
              allowScrollButtonsMobile
              sx={{
                minHeight: 40,
                '& .MuiTab-root': { color: '#aeb3d5', textTransform: 'none', minHeight: 40, fontWeight: 600 },
                '& .Mui-selected': { color: '#ffffff' },
                '& .MuiTabs-indicator': { backgroundColor: '#6a6afc', height: 2 }
              }}
            >
              <Tab icon={<EventNoteOutlinedIcon sx={{ fontSize: 18, mr: 1 }} />} iconPosition="start" label="Visits" />
              <Tab icon={<ScienceOutlinedIcon sx={{ fontSize: 18, mr: 1 }} />} iconPosition="start" label="Test Results" />
              <Tab icon={<VolunteerActivismOutlinedIcon sx={{ fontSize: 18, mr: 1 }} />} iconPosition="start" label="End of Life" />
              <Tab icon={<ArticleOutlinedIcon sx={{ fontSize: 18, mr: 1 }} />} iconPosition="start" label="Medical & Family" />
              <Tab icon={<HealthAndSafetyOutlinedIcon sx={{ fontSize: 18, mr: 1 }} />} iconPosition="start" label="Preventive Care" />
            </Tabs>

            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

            {recordTab === 0 && (
              <VuiBox>
                <VuiTypography variant="button" color="text" mb={1} sx={{ fontSize: 15 }}>
                  Recent visits
                </VuiTypography>
                {records.visits.length === 0 ? (
                  <Box sx={{
                    p: 2,
                    border: '1px dashed rgba(255,255,255,0.12)',
                    borderRadius: 2,
                    textAlign: 'center',
                    color: '#aeb3d5',
                  }}>
                    <VuiTypography color="text" sx={{ fontSize: 14 }}>No visits yet.</VuiTypography>
                    <VuiTypography color="text" sx={{ fontSize: 12, opacity: 0.8 }}>Your appointments will appear here.</VuiTypography>
                  </Box>
                ) : (
                  <Stack spacing={1.25}>
                    {records.visits.map((v, i) => (
                      <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, borderRadius: 2, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <VuiTypography color="white" sx={{ fontSize: 14, fontWeight: 600 }}>{v.title || 'Visit'}</VuiTypography>
                        <VuiTypography color="text" sx={{ fontSize: 12 }}>{v.date || ''}</VuiTypography>
                      </Box>
                    ))}
                  </Stack>
                )}
              </VuiBox>
            )}

            {recordTab === 1 && (
              <VuiBox>
                <VuiTypography variant="button" color="text" mb={1} sx={{ fontSize: 15 }}>
                  Lab and imaging results
                </VuiTypography>
                {records.tests.length === 0 ? (
                  <Box sx={{
                    p: 2,
                    border: '1px dashed rgba(255,255,255,0.12)',
                    borderRadius: 2,
                    textAlign: 'center',
                    color: '#aeb3d5',
                  }}>
                    <VuiTypography color="text" sx={{ fontSize: 14 }}>No test results yet.</VuiTypography>
                    <VuiTypography color="text" sx={{ fontSize: 12, opacity: 0.8 }}>Your lab and imaging results will appear here.</VuiTypography>
                  </Box>
                ) : (
                  <Stack spacing={1.25}>
                    {records.tests.map((t, i) => (
                      <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, borderRadius: 2, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <VuiTypography color="white" sx={{ fontSize: 14, fontWeight: 600 }}>{t.name || 'Result'}</VuiTypography>
                        <VuiTypography color="text" sx={{ fontSize: 12 }}>{t.date || ''}</VuiTypography>
                      </Box>
                    ))}
                  </Stack>
                )}
              </VuiBox>
            )}

            {recordTab === 2 && (
              <VuiBox>
                <VuiTypography variant="button" color="text" mb={1} sx={{ fontSize: 15 }}>
                  End of life planning
                </VuiTypography>

                <Stack spacing={1.25}>
                  

                  {/* Insurance */}
                  <Box sx={sectionCardSx}>
                    <VuiTypography color="text" sx={{ fontSize: 13, mb: 1, opacity: 0.9, fontWeight: 700 }}>Insurance</VuiTypography>
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={6}>
                        <TextField size="small" fullWidth label="Provider" InputLabelProps={inputLabelPropsSmall} value={eol.insurance.provider} onChange={(e) => setEol((p) => ({ ...p, insurance: { ...p.insurance, provider: e.target.value } }))} sx={inputSxSmall} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField size="small" fullWidth label="Member ID" InputLabelProps={inputLabelPropsSmall} value={eol.insurance.memberId} onChange={(e) => setEol((p) => ({ ...p, insurance: { ...p.insurance, memberId: e.target.value } }))} sx={inputSxSmall} />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField size="small" fullWidth label="Policy #" InputLabelProps={inputLabelPropsSmall} value={eol.insurance.policyNumber} onChange={(e) => setEol((p) => ({ ...p, insurance: { ...p.insurance, policyNumber: e.target.value } }))} sx={inputSxSmall} />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField size="small" fullWidth label="Group #" InputLabelProps={inputLabelPropsSmall} value={eol.insurance.groupNumber} onChange={(e) => setEol((p) => ({ ...p, insurance: { ...p.insurance, groupNumber: e.target.value } }))} sx={inputSxSmall} />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField size="small" fullWidth label="Insurer Phone" InputLabelProps={inputLabelPropsSmall} value={eol.insurance.phone} onChange={(e) => setEol((p) => ({ ...p, insurance: { ...p.insurance, phone: e.target.value } }))} sx={inputSxSmall} />
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Directives */}
                  <Box sx={sectionCardSx}>
                    <VuiTypography color="text" sx={{ fontSize: 13, mb: 1, opacity: 0.9, fontWeight: 700 }}>Advance directives</VuiTypography>
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={6}>
                        <TextField size="small" fullWidth label="Healthcare proxy name" InputLabelProps={inputLabelPropsSmall} value={eol.directives.healthcareProxyName} onChange={(e) => setEol((p) => ({ ...p, directives: { ...p.directives, healthcareProxyName: e.target.value } }))} sx={inputSxSmall} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField size="small" fullWidth label="Healthcare proxy phone" InputLabelProps={inputLabelPropsSmall} value={eol.directives.healthcareProxyPhone} onChange={(e) => setEol((p) => ({ ...p, directives: { ...p.directives, healthcareProxyPhone: e.target.value } }))} sx={inputSxSmall} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField size="small" fullWidth label="Preferred hospital" InputLabelProps={inputLabelPropsSmall} value={eol.directives.preferredHospital} onChange={(e) => setEol((p) => ({ ...p, directives: { ...p.directives, preferredHospital: e.target.value } }))} sx={inputSxSmall} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ height: '100%' }}>
                          <FormControlLabel sx={{ '& .MuiFormControlLabel-label': { fontSize: 12.5, color: '#aeb3d5' } }} control={<Switch checked={!!eol.directives.livingWillOnFile} onChange={(e) => setEol((p) => ({ ...p, directives: { ...p.directives, livingWillOnFile: e.target.checked } }))} />} label="Living will on file" />
                          <FormControlLabel sx={{ '& .MuiFormControlLabel-label': { fontSize: 12.5, color: '#aeb3d5' } }} control={<Switch checked={!!eol.directives.dnrOnFile} onChange={(e) => setEol((p) => ({ ...p, directives: { ...p.directives, dnrOnFile: e.target.checked } }))} />} label="DNR on file" />
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Donor Status */}
                  <Box sx={sectionCardSx}>
                    <VuiTypography color="text" sx={{ fontSize: 13, mb: 1, opacity: 0.9, fontWeight: 700 }}>Organ donor</VuiTypography>
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={6}>
                        <TextField select size="small" fullWidth label="Donor status" InputLabelProps={inputLabelPropsSmall} value={eol.donorStatus} onChange={(e) => setEol((p) => ({ ...p, donorStatus: e.target.value }))} sx={inputSxSmall}>
                          <MenuItem value="Yes">Yes</MenuItem>
                          <MenuItem value="No">No</MenuItem>
                          <MenuItem value="Unknown">Unknown</MenuItem>
                        </TextField>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Important Documents */}
                  <Box sx={sectionCardSx}>
                    <VuiTypography color="text" sx={{ fontSize: 13, mb: 1, opacity: 0.9, fontWeight: 700 }}>Important documents (links)</VuiTypography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 1 }}>
                      <TextField size="small" fullWidth placeholder="Label (e.g., Living Will PDF)" value={newDocLabel} onChange={(e) => setNewDocLabel(e.target.value)} sx={inputSxSmall} />
                      <TextField size="small" fullWidth placeholder="https://example.com/document.pdf" value={newDocUrl} onChange={(e) => setNewDocUrl(e.target.value)} sx={inputSxSmall} />
                      <Button size="small" startIcon={<AddLinkOutlinedIcon />} onClick={() => {
                        const url = (newDocUrl || '').trim();
                        const label = (newDocLabel || '').trim() || newDocUrl;
                        if (!/^https?:\/\//i.test(url)) return; // naive URL guard
                        setEol((p) => ({ ...p, documentLinks: [ ...(p.documentLinks || []), { label, url } ] }));
                        setNewDocLabel(''); setNewDocUrl('');
                      }} sx={{ fontWeight: 700 }}>Add</Button>
                    </Stack>
                    <Stack spacing={0.75}>
                      {(eol.documentLinks || []).map((d, i) => (
                        <Box key={`${d.url}-${i}`} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, borderRadius: 1.5, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <LinkOutlinedIcon sx={{ color: '#aeb3d5' }} />
                            <a href={d.url} target="_blank" rel="noreferrer" style={{ color: '#e7e9f3', textDecoration: 'none', fontWeight: 600 }}>{d.label || d.url}</a>
                            <OpenInNewRoundedIcon sx={{ fontSize: 16, color: '#aeb3d5' }} />
                          </Stack>
                          <IconButton size="small" onClick={() => setEol((p) => ({ ...p, documentLinks: p.documentLinks.filter((_, idx) => idx !== i) }))}>
                            <DeleteOutlineOutlinedIcon sx={{ color: '#aeb3d5' }} />
                          </IconButton>
                        </Box>
                      ))}
                      {(!eol.documentLinks || eol.documentLinks.length === 0) && (
                        <Box sx={{ p: 2, border: '1px dashed rgba(255,255,255,0.12)', borderRadius: 1.5, textAlign: 'center', color: '#aeb3d5' }}>
                          <VuiTypography color="text" sx={{ fontSize: 13 }}>No document links yet.</VuiTypography>
                        </Box>
                      )}
                    </Stack>
                  </Box>

                  {/* Trusted Resources */}
                  <Box sx={sectionCardSx}>
                    <VuiTypography color="text" sx={{ fontSize: 13, mb: 1, opacity: 0.9, fontWeight: 700 }}>Trusted resources</VuiTypography>
                    {(() => {
                      const categories = [
                        {
                          key: 'planning',
                          title: 'Planning & Guides',
                          icon: PsychologyOutlinedIcon,
                          blurb: 'Start conversations and plan care preferences.',
                          links: [
                            { label: 'The Conversation Project – Starter Guides', url: 'https://theconversationproject.org/starter-kits/' },
                            { label: 'CDC – Advance Care Planning', url: 'https://www.cdc.gov/aging/advancecareplanning/index.htm' },
                            { label: 'AARP – End‑of‑Life Planning', url: 'https://www.aarp.org/caregiving/financial-legal/info-2017/end-of-life-planning.html' },
                          ]
                        },
                        {
                          key: 'hospice',
                          title: 'Hospice & Palliative Care',
                          icon: MedicalServicesOutlinedIcon,
                          blurb: 'Find local hospice and understand covered services.',
                          links: [
                            { label: 'NHPCO – Find Hospice & Palliative Care', url: 'https://www.nhpco.org/find-hospice/' },
                            { label: 'Medicare – Hospice Benefit', url: 'https://www.medicare.gov/coverage/hospice-care' },
                          ]
                        },
                        {
                          key: 'directives',
                          title: 'Legal & Directives',
                          icon: ArticleOutlinedIcon,
                          blurb: 'Advance directives and health care proxy information.',
                          links: [
                            { label: 'Five Wishes – Advance Directive', url: 'https://fivewishes.org' },
                          ]
                        },
                        {
                          key: 'donation',
                          title: 'Organ Donation',
                          icon: VolunteerActivismOutlinedIcon2,
                          blurb: 'Learn how to become a donor and share your decision.',
                          links: [
                            { label: 'OrganDonor.gov', url: 'https://www.organdonor.gov/' },
                          ]
                        },
                      ];
                      const saved = eol.resources || [];
                      return (
                        <>
                          <Grid container spacing={2} sx={{ mb: 1.25 }}>
                            {categories.map((cat) => {
                              const Icon = cat.icon;
                              return (
                                <Grid item xs={12} sm={6} key={cat.key}>
                                  <Box
                                    sx={{
                                      background: 'linear-gradient(180deg, rgba(24,26,47,0.9) 0%, rgba(22,24,45,0.9) 100%)',
                                      border: '1px solid rgba(255,255,255,0.08)',
                                      borderRadius: 2,
                                      p: 2,
                                      display: 'flex',
                                      flexDirection: 'column',
                                      gap: 1,
                                      transition: 'transform .15s ease, box-shadow .15s ease',
                                      '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 30px rgba(0,0,0,0.35)' }
                                    }}
                                  >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Icon sx={{ color: '#00FFD0', opacity: 0.9 }} />
                                      <VuiTypography color="white" fontWeight="bold" sx={{ fontSize: 16 }}>{cat.title}</VuiTypography>
                                    </Box>
                                    <VuiTypography color="text" sx={{ fontSize: 14 }}>{cat.blurb}</VuiTypography>
                                    <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.08)' }} />
                                    <Stack spacing={1}>
                                      {cat.links.map((lnk) => {
                                        const isSaved = saved.some((s) => s.url === lnk.url);
                                        return (
                                          <Box key={lnk.url} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, borderRadius: 1.5, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                            <Button
                                              onClick={() => window.open(lnk.url, '_blank', 'noopener,noreferrer')}
                                              endIcon={<OpenInNewRoundedIcon sx={{ fontSize: 16 }} />}
                                              sx={{
                                                justifyContent: 'space-between',
                                                color: '#e7e9f3',
                                                textTransform: 'none',
                                                fontSize: 14,
                                                py: 0.5,
                                                px: 1,
                                                borderRadius: 1,
                                                background: 'transparent',
                                                minWidth: 0,
                                                '&:hover': { background: 'rgba(255,255,255,0.06)' }
                                              }}
                                            >
                                              {lnk.label}
                                            </Button>
                                            <Button size="small" variant="outlined" onClick={() => setEol((p) => ({ ...p, resources: isSaved ? p.resources.filter((x) => x.url !== lnk.url) : [ ...(p.resources || []), lnk ] }))} sx={{ borderColor: isSaved ? '#5de4c7' : 'rgba(255,255,255,0.25)', color: isSaved ? '#5de4c7' : '#aeb3d5', fontWeight: 700 }}>
                                              {isSaved ? 'Saved' : 'Save'}
                                            </Button>
                                          </Box>
                                        );
                                      })}
                                    </Stack>
                                  </Box>
                                </Grid>
                              );
                            })}
                          </Grid>
                          <VuiTypography color="text" sx={{ fontSize: 12.5, opacity: 0.9, mb: 1 }}>My saved resources</VuiTypography>
                          <Stack spacing={0.5}>
                            {saved.length === 0 ? (
                              <VuiTypography color="text" sx={{ fontSize: 12.5, opacity: 0.8 }}>None saved yet.</VuiTypography>
                            ) : saved.map((s) => (
                              <Box key={s.url} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, borderRadius: 1.5, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <a href={s.url} target="_blank" rel="noreferrer" style={{ color: '#e7e9f3', textDecoration: 'none', fontWeight: 600 }}>{s.label}</a>
                                <IconButton size="small" onClick={() => setEol((p) => ({ ...p, resources: p.resources.filter((x) => x.url !== s.url) }))}><DeleteOutlineOutlinedIcon sx={{ color: '#aeb3d5' }} /></IconButton>
                              </Box>
                            ))}
                          </Stack>
                        </>
                      );
                    })()}
                  </Box>

                  {/* Save all */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
        <Button onClick={async () => {
                      try {
                        const payload = { ...eol, notes: eolDraft };
                        const res = await fetch(`${apiBase}/api/records/eol`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                        if (res.ok) {
          const savedAt = new Date().toISOString();
          setRecords((r) => ({ ...r, eol: payload, notes: { ...r.notes, endOfLife: eolDraft }, updatedAt: savedAt }));
          setEolSavedAt(savedAt);
                          setEolSnackbar(true);
                        }
                      } catch (e) { console.error(e); }
                    }} color="info" sx={{ fontWeight: 800, px: 2.5 }}>Save All</Button>
                  </Box>

                  {/* Notes & wishes (moved to bottom, polished layout) */}
                  <Box sx={{ ...sectionCardSx, mt: 0.5 }}>
                    <VuiTypography color="text" sx={{ fontSize: 13, mb: 1, opacity: 0.9, fontWeight: 700 }}>Notes & wishes</VuiTypography>
                    {/* Toolbar */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <VuiTypography variant="caption" color="text" sx={{ fontSize: 11, opacity: 0.8 }}>
                        {eolSavedAt ? `Last saved: ${new Date(eolSavedAt).toLocaleString()}` : 'Not saved yet'}
                      </VuiTypography>
                      <Box flexGrow={1} />
                      <Button size="small" variant="outlined" onClick={() => setEolDraft('')} sx={{ borderColor: 'rgba(255,255,255,0.25)', color: '#aeb3d5', fontWeight: 700 }}>Clear</Button>
                      <Button size="small" variant="outlined" onClick={() => setEolDraft(records?.eol?.notes || records?.notes?.endOfLife || '')} sx={{ borderColor: 'rgba(255,255,255,0.25)', color: '#aeb3d5', fontWeight: 700 }}>Load saved</Button>
                      <Button size="small" color="info" onClick={async () => {
                        try {
                          await fetch(`${apiBase}/api/records/notes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ endOfLife: eolDraft, medicalFamily: mfDraft || records.notes.medicalFamily }) });
                          const res2 = await fetch(`${apiBase}/api/records/eol`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ notes: eolDraft }) });
                          if (res2.ok) {
                            const savedAt = new Date().toISOString();
                            setRecords((r) => ({ ...r, notes: { ...r.notes, endOfLife: eolDraft }, eol: { ...(r.eol || {}), notes: eolDraft }, updatedAt: savedAt }));
                            setEolSavedAt(savedAt);
                            setEolSnackbar(true);
                          }
                        } catch (e) { console.error(e); }
                      }} sx={{ fontWeight: 700, px: 2 }}>Save</Button>
                    </Box>
                    <Grid container spacing={1.25}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          multiline
                          minRows={6}
                          size="small"
                          variant="outlined"
                          placeholder="Add any wishes, preferences, or important notes for end‑of‑life planning..."
                          fullWidth
                          value={eolDraft}
                          onChange={(e) => { setEolDraft(e.target.value); setEol((prev) => ({ ...prev, notes: e.target.value })); }}
                          inputProps={{ maxLength: 1000 }}
                          helperText={`${eolDraft.length}/1000`}
                          InputLabelProps={inputLabelPropsSmall}
                          sx={inputSxSmall}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ p: 1.25, borderRadius: 1.5, height: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column' }}>
                          <VuiTypography color="text" sx={{ fontSize: 12, mb: 0.5, opacity: 0.9, fontWeight: 700 }}>Saved preview</VuiTypography>
                          <Box sx={{ flex: 1, overflowY: 'auto' }}>
                            {((records?.eol?.notes) || (records?.notes?.endOfLife)) ? (
                              <VuiTypography color="white" sx={{ fontSize: 13, whiteSpace: 'pre-wrap' }}>
                                {records?.eol?.notes || records?.notes?.endOfLife}
                              </VuiTypography>
                            ) : (
                              <VuiTypography color="text" sx={{ fontSize: 12.5, opacity: 0.8 }}>No saved note yet.</VuiTypography>
                            )}
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Stack>
              </VuiBox>
            )}

            {recordTab === 3 && (
              <VuiBox>
                <Box sx={{ ...sectionCardSx, borderRadius: '6px' }}>
                  <VuiTypography color="text" sx={{ fontSize: 13, mb: 1, opacity: 0.9, fontWeight: 700 }}>Medical and family files</VuiTypography>

                  {/* Tile view */}
                  {!mfSelectedTile && (
                    <>
                      <VuiTypography color="text" sx={{ fontSize: 12.5, mb: 1 }}>
                        Choose a category below. Add files like PDFs or images. No typing needed.
                      </VuiTypography>
                      <Grid container spacing={1.5}>
                        {[
                          { key: 'Self', icon: PersonOutlineOutlinedIcon },
                          { key: 'Family', icon: GroupOutlinedIcon },
                          { key: 'Pets', icon: PetsOutlinedIcon },
                          { key: 'Other', icon: FolderOpenOutlinedIcon },
                        ].map(({ key, icon: Icon }) => {
                          const count = mfFiles.filter((f) => f.category === key).length;
                          return (
                            <Grid key={key} item xs={12} sm={6}>
                              <Box onClick={() => setMfSelectedTile(key)} sx={tileStyle(false)}>
                                <Icon sx={{ color: '#00FFD0', opacity: 0.9 }} />
                                <Box sx={{ minWidth: 0 }}>
                                  <VuiTypography color="white" fontWeight="bold" sx={{ fontSize: 16 }}>{key}</VuiTypography>
                                  <VuiTypography variant="caption" color="text" sx={{ fontSize: 12 }}>{count} item{count===1?'':'s'}</VuiTypography>
                                </Box>
                              </Box>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </>
                  )}

                  {/* Category view */}
                  {!!mfSelectedTile && (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Button startIcon={<ArrowBackRoundedIcon />} onClick={() => setMfSelectedTile(null)} sx={{ mr: 1, color: '#c6c9e5' }}>Back</Button>
                        <VuiTypography color="white" fontWeight="bold" sx={{ fontSize: 16 }}>{mfSelectedTile}</VuiTypography>
                        <Box flexGrow={1} />
                        <Button variant="outlined" component="label" startIcon={<CloudUploadOutlinedIcon />} sx={{ borderColor: 'rgba(106,106,252,0.6)', color: '#c6c9e5' }}>
                          Upload
                          <input hidden type="file" onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const fd = new FormData();
                            fd.append('file', file);
                            fd.append('label', file.name);
                            fd.append('category', mfSelectedTile);
                            try {
                              const res = await fetch(`${apiBase}/api/records/mf-files`, { method: 'POST', body: fd });
                              if (res.ok) {
                                const json = await res.json();
                                if (json?.ok) setMfFiles((prev) => [json.file, ...prev]);
                              }
                            } catch (err) { console.error(err); }
                            e.target.value = '';
                          }} />
                        </Button>
                      </Box>

                      {/* Drag and drop area */}
                      <Box
                        onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }}
                        onDrop={async (e) => {
                          e.preventDefault();
                          const file = e.dataTransfer.files?.[0];
                          if (!file) return;
                          const fd = new FormData();
                          fd.append('file', file);
                          fd.append('label', file.name);
                          fd.append('category', mfSelectedTile);
                          try {
                            const res = await fetch(`${apiBase}/api/records/mf-files`, { method: 'POST', body: fd });
                            if (res.ok) {
                              const json = await res.json();
                              if (json?.ok) setMfFiles((prev) => [json.file, ...prev]);
                            }
                          } catch (err) { console.error(err); }
                        }}
                        sx={{
                          mb: 1.5,
                          p: 2,
                          borderRadius: '6px',
                          border: '1px dashed rgba(255,255,255,0.18)',
                          background: 'rgba(255,255,255,0.03)'
                        }}
                      >
                        <VuiTypography color="text" sx={{ fontSize: 12.5, textAlign: 'center' }}>
                          Drag & drop a file here to upload to {mfSelectedTile}
                        </VuiTypography>
                      </Box>

                      <Grid container spacing={1.5}>
                        {mfFiles.filter((f) => f.category === mfSelectedTile).map((f) => {
                          const isImage = (f.mimetype || '').startsWith('image/');
                          return (
                            <Grid key={f.id} item xs={12} sm={6}>
          <Box sx={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', p: 1.25 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {isImage ? (
            <img src={f.path} alt={f.label} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.12)' }} />
                                  ) : (
                                    <InsertDriveFileOutlinedIcon sx={{ color: '#aeb3d5' }} />
                                  )}
                                  <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <VuiTypography color="white" noWrap sx={{ fontSize: 14, fontWeight: 600 }}>{f.label}</VuiTypography>
                                    <VuiTypography variant="caption" color="text" sx={{ fontSize: 11 }}>{(f.size/1024).toFixed(0)} KB</VuiTypography>
                                  </Box>
                                  <IconButton color="info" size="small" component="a" href={f.path} target="_blank" rel="noreferrer"><OpenInNewRoundedIcon /></IconButton>
                                  <IconButton size="small" onClick={async () => {
                                    try {
                                      const res = await fetch(`${apiBase}/api/records/mf-files/${f.id}`, { method: 'DELETE' });
                                      if (res.ok) setMfFiles(prev => prev.filter(x => x.id !== f.id));
                                    } catch (err) { console.error(err); }
                                  }}><DeleteOutlineOutlinedIcon sx={{ color: '#aeb3d5' }} /></IconButton>
                                </Box>

                                {/* Hidden-by-default tags/notes row (expand on Edit) */}
                                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                  {(f.tags && f.tags.length > 0) ? f.tags.map((t, idx) => (
                                    <Chip key={`${f.id}-tag-${idx}`} label={t} size="small" sx={{ color: '#cfd3f7', borderColor: 'rgba(255,255,255,0.2)' }} variant="outlined" />
                                  )) : (
                                    <VuiTypography variant="caption" color="text" sx={{ fontSize: 11 }}>No tags</VuiTypography>
                                  )}
                                  <Box flexGrow={1} />
                                  <Button size="small" startIcon={<EditOutlinedIcon />} onClick={() => {
                                    const next = { ...f, _editing: !f._editing, _draftTags: (f.tags || []).join(', '), _draftNotes: f.notes || '' };
                                    setMfFiles(prev => prev.map(x => x.id === f.id ? next : x));
                                  }} sx={{ textTransform: 'none' }}>Edit</Button>
                                </Box>

                                {f._editing && (
                                  <Box sx={{ mt: 1, p: 1, borderRadius: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <Stack spacing={1}>
                                      <TextField
                                        size="small"
                                        placeholder="Tags (comma separated)"
                                        value={f._draftTags}
                                        onChange={(e) => setMfFiles(prev => prev.map(x => x.id === f.id ? { ...x, _draftTags: e.target.value } : x))}
                                        sx={inputSxSmall}
                                      />
                                      <TextField
                                        size="small"
                                        placeholder="Quick notes (optional)"
                                        value={f._draftNotes}
                                        onChange={(e) => setMfFiles(prev => prev.map(x => x.id === f.id ? { ...x, _draftNotes: e.target.value } : x))}
                                        sx={inputSxSmall}
                                      />
                                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                        <Button size="small" onClick={() => setMfFiles(prev => prev.map(x => x.id === f.id ? { ...x, _editing: false } : x))}>Cancel</Button>
                                        <Button size="small" startIcon={<SaveOutlinedIcon />} onClick={async () => {
                                          const tags = (f._draftTags || '').split(',').map(s => s.trim()).filter(Boolean);
                                          const notes = f._draftNotes || '';
                                          try {
                                            const res = await fetch(`${apiBase}/api/records/mf-files/${f.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tags, notes }) });
                                            if (res.ok) {
                                              const json = await res.json();
                                              if (json?.ok) setMfFiles(prev => prev.map(x => x.id === f.id ? { ...json.file, _editing: false } : x));
                                            }
                                          } catch (err) { console.error(err); }
                                        }}>Save</Button>
                                      </Box>
                                    </Stack>
                                  </Box>
                                )}
                              </Box>
                            </Grid>
                          );
                        })}
                      </Grid>

                      {mfFiles.filter((f) => f.category === mfSelectedTile).length === 0 && (
                        <Box sx={{ p: 2, border: '1px dashed rgba(255,255,255,0.12)', borderRadius: '6px', textAlign: 'center', color: '#aeb3d5', mt: 1 }}>
                          <VuiTypography color="text" sx={{ fontSize: 13 }}>No files yet for {mfSelectedTile}. Click Upload to add one.</VuiTypography>
                        </Box>
                      )}
                    </>
                  )}
                </Box>
              </VuiBox>
            )}

            {recordTab === 4 && (
              <VuiBox>
                <VuiTypography variant="button" color="text" mb={1} sx={{ fontSize: 15 }}>
                  Preventive care reminders
                </VuiTypography>
                <VuiTypography color="text" sx={{ fontSize: 16 }}>No preventive care records.</VuiTypography>
              </VuiBox>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              // Export JSON
              const blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'records.json';
              a.click();
              URL.revokeObjectURL(url);
            }} color="primary" sx={{ fontSize: 15, fontWeight: 600, px: 3, py: 1, mr: 1 }}>Export</Button>
            <Button onClick={() => window.print()} color="primary" sx={{ fontSize: 15, fontWeight: 600, px: 3, py: 1, mr: 1 }}>Print</Button>
            <Button onClick={() => setRecordDialog(false)} color="primary" sx={{ fontSize: 15, fontWeight: 600, px: 3, py: 1 }}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* EOL Saved Snackbar */}
        <Snackbar open={eolSnackbar} autoHideDuration={3000} onClose={() => setEolSnackbar(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={() => setEolSnackbar(false)} severity="success" sx={{ width: '100%' }}>
            End of Life details saved.
          </Alert>
        </Snackbar>

        {/* Communication Dialog content - modern, simple tabbed layout */}
        <Dialog
          open={communicationDialog}
          onClose={() => setCommunicationDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              background: 'linear-gradient(180deg, rgba(22,24,45,0.85) 0%, rgba(20,22,40,0.85) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 3,
              color: 'white',
              boxShadow: '0 16px 60px rgba(0,0,0,0.45)'
            }
          }}
        >
          <DialogTitle sx={{ fontSize: 22, fontWeight: 700, color: '#fff', pb: 1 }}>Communication</DialogTitle>
          <DialogContent sx={{ pt: 0 }}>
            <VuiTypography color="text" variant="button" mb={1.5} sx={{ fontSize: 16 }}>
              Manage your messages, questions, and resources.
            </VuiTypography>

            <Tabs
              value={commTab}
              onChange={(e, v) => setCommTab(v)}
              variant="scrollable"
              allowScrollButtonsMobile
              sx={{
                minHeight: 40,
                '& .MuiTab-root': { color: '#aeb3d5', textTransform: 'none', minHeight: 40, fontWeight: 600 },
                '& .Mui-selected': { color: '#ffffff' },
                '& .MuiTabs-indicator': { backgroundColor: '#6a6afc', height: 2 }
              }}
            >
              <Tab icon={<ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 18, mr: 1 }} />} iconPosition="start" label="Messages" />
              <Tab icon={<HelpOutlineOutlinedIcon sx={{ fontSize: 18, mr: 1 }} />} iconPosition="start" label="Ask" />
              <Tab icon={<MailOutlineOutlinedIcon sx={{ fontSize: 18, mr: 1 }} />} iconPosition="start" label="Letters" />
              <Tab icon={<GroupOutlinedIcon sx={{ fontSize: 18, mr: 1 }} />} iconPosition="start" label="Resources" />
              <Tab icon={<ReportProblemOutlinedIcon sx={{ fontSize: 18, mr: 1 }} />} iconPosition="start" label="Report" />
            </Tabs>

            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

            {commTab === 0 && (
              <VuiBox>
                <VuiTypography variant="button" color="text" mb={1} sx={{ fontSize: 15 }}>
                  Your Care Team
                </VuiTypography>
                <TextField
                  fullWidth
                  value={doctorQuery}
                  onChange={(e) => setDoctorQuery(e.target.value)}
                  placeholder="Search doctors, specialties, or hospitals"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRoundedIcon sx={{ color: '#aeb3d5' }} />
                      </InputAdornment>
                    )
                  }}
                  InputLabelProps={inputLabelPropsSmall}
                  sx={{ ...inputSxSmall, mb: 1.5, '& .MuiOutlinedInput-notchedOutline': { border: '2px solid #23244a' } }}
                />

                <Grid container spacing={1.5}>
                  {filteredDoctors.map((doc) => {
                    const d = doctorDetails[doc] || {};
                    const online = d.status === 'online';
                    return (
                      <Grid item xs={12} sm={6} key={doc}>
                        <Box
                          sx={{
                            background: 'linear-gradient(180deg, rgba(24,26,47,0.9) 0%, rgba(22,24,45,0.9) 100%)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: 2,
                            p: 1.25,
                            display: 'flex',
                            gap: 1,
                            alignItems: 'center',
                            transition: 'transform .15s ease, box-shadow .15s ease',
                            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 30px rgba(0,0,0,0.35)' }
                          }}
                        >
                          <Avatar src={d.avatar} alt={doc} sx={{ width: 44, height: 44 }} />
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                              <VuiTypography color="white" fontWeight="bold" noWrap sx={{ fontSize: 15 }}>{doc}</VuiTypography>
                              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                                <FiberManualRecordIcon sx={{ fontSize: 10, color: online ? '#1de9b6' : '#6b708d' }} />
                                <VuiTypography variant="caption" color="text" sx={{ fontSize: 11, opacity: 0.8 }}>{online ? 'Online' : 'Offline'}</VuiTypography>
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25, flexWrap: 'wrap' }}>
                              <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 0.75, py: 0.25, borderRadius: 1, background: 'rgba(106,106,252,0.12)', border: '1px solid rgba(106,106,252,0.25)' }}>
                                <LocalHospitalRoundedIcon sx={{ fontSize: 14, mr: 0.5, opacity: 0.9 }} />
                                <VuiTypography variant="caption" color="white" sx={{ fontSize: 11 }}>{d.specialty || 'General'}</VuiTypography>
                              </Box>
                              <VuiTypography variant="caption" color="text" noWrap sx={{ fontSize: 12 }}>{d.hospital}</VuiTypography>
                            </Box>
                          </Box>
                          <Button
                            onClick={() => handleOpenChat(doc)}
                            size="small"
                            sx={{
                              textTransform: 'none',
                              fontWeight: 700,
                              color: '#fff',
                              background: 'rgba(106,106,252,0.2)',
                              border: '1px solid rgba(106,106,252,0.4)',
                              borderRadius: 2,
                              px: 1.5,
                              '&:hover': { background: 'rgba(106,106,252,0.3)' }
                            }}
                          >
                            Message
                          </Button>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>

                {filteredDoctors.length === 0 && (
                  <VuiTypography color="text" sx={{ mt: 1 }}>No doctors found.</VuiTypography>
                )}
              </VuiBox>
            )}

            {commTab === 1 && (
              <VuiBox>
                <VuiTypography variant="button" color="text" mb={1} sx={{ fontSize: 15 }}>
                  Ask a quick question and we’ll get back to you.
                </VuiTypography>
                <Stack spacing={2}>
                  {/* Question */}
                  <TextField
                    multiline
                    minRows={3}
                    value={askForm.question}
                    onChange={(e) => setAskForm({ ...askForm, question: e.target.value })}
                    variant="outlined"
                    placeholder="Your question..."
                    fullWidth
                    helperText={`${askForm.question.length}/500`}
                    inputProps={{ maxLength: 500 }}
                    InputLabelProps={inputLabelPropsSmall}
                    sx={inputSxSmall}
                  />

                  {/* Contact details */}
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      label="Email (optional)"
                      type="email"
                      value={askForm.email}
                      onChange={(e) => setAskForm({ ...askForm, email: e.target.value })}
                      placeholder="name@example.com"
                      fullWidth
                      error={askForm.replyEmail && !isValidEmail(askForm.email)}
                      helperText={askForm.replyEmail && !isValidEmail(askForm.email) ? 'Enter a valid email' : undefined}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailRoundedIcon sx={{ fontSize: 18, color: '#a6b1e1' }} />
                          </InputAdornment>
                        )
                      }}
                      InputLabelProps={inputLabelPropsSmall}
                      sx={inputSxSmall}
                    />
                    <TextField
                      label="Phone (optional)"
                      type="tel"
                      value={askForm.phone}
                      onChange={(e) => setAskForm({ ...askForm, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                      fullWidth
                      error={askForm.replySMS && !isValidPhone(askForm.phone)}
                      helperText={askForm.replySMS && !isValidPhone(askForm.phone) ? 'Enter a valid phone' : undefined}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneRoundedIcon sx={{ fontSize: 18, color: '#a6b1e1' }} />
                          </InputAdornment>
                        )
                      }}
                      InputLabelProps={inputLabelPropsSmall}
                      sx={inputSxSmall}
                    />
                  </Stack>

                  {/* Preferences and category */}
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                    <TextField
                      select
                      label="Category"
                      value={askForm.category}
                      onChange={(e) => setAskForm({ ...askForm, category: e.target.value })}
                      InputLabelProps={inputLabelPropsSmall}
                      sx={{ ...inputSxSmall, minWidth: 200 }}
                    >
                      {['General','Appointments','Billing','Medical Records','Prescriptions','Referrals','Technical Support','Other'].map(opt => (
                        <MenuItem key={opt} value={opt} sx={{ background: '#181a2f', color: '#fff' }}>{opt}</MenuItem>
                      ))}
                    </TextField>
                    {askForm.category === 'Other' && (
                      <TextField
                        label="Category (other)"
                        value={askForm.categoryOther}
                        onChange={(e) => setAskForm({ ...askForm, categoryOther: e.target.value })}
                        placeholder="Type a category"
                        InputLabelProps={inputLabelPropsSmall}
                        sx={inputSxSmall}
                      />
                    )}
                    <FormControlLabel control={<Switch color="info" checked={askForm.replyEmail} onChange={(e) => setAskForm({ ...askForm, replyEmail: e.target.checked })} />} label={<VuiTypography variant="button" color="text">Reply by Email</VuiTypography>} />
                    <FormControlLabel control={<Switch color="info" checked={askForm.replySMS} onChange={(e) => setAskForm({ ...askForm, replySMS: e.target.checked })} />} label={<VuiTypography variant="button" color="text">Reply by SMS</VuiTypography>} />
                  </Stack>

                  {/* Actions */}
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }}>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.gif,.txt,.csv,.doc,.docx"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const limitMB = 10;
                        const filtered = files.filter(f => f.size <= limitMB * 1024 * 1024);
                        setAskFiles(prev => [...prev, ...filtered].slice(0, 5));
                        e.target.value = '';
                      }}
                    />
                    <Button
                      variant="outlined"
                      color="info"
                      startIcon={<AttachFileOutlinedIcon />}
                      onClick={() => fileInputRef.current?.click()}
                      sx={{ color: '#c6c9e5', borderColor: 'rgba(106,106,252,0.6)', '&:hover': { borderColor: '#6a6afc', background: 'rgba(106,106,252,0.08)' } }}
                    >
                      Attach files
                    </Button>
                    <Box flexGrow={1} />
                    <VuiTypography variant="button" color="text">We typically respond within 1–2 business days.</VuiTypography>
                    <Button color="info" endIcon={<SendRoundedIcon />} disabled={!askForm.question.trim() || (askForm.replyEmail && !isValidEmail(askForm.email)) || (askForm.replySMS && !isValidPhone(askForm.phone))} sx={{ fontWeight: 700, px: 2, py: 1 }} onClick={handleAskSubmit}>
                      Ask
                    </Button>
                  </Stack>

                  {/* Selected files */}
                  {askFiles.length > 0 && (
                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                      {askFiles.map((f, idx) => (
                        <Chip
                          key={`${f.name}-${idx}`}
                          variant="outlined"
                          icon={<InsertDriveFileOutlinedIcon sx={{ fontSize: 18 }} />}
                          label={`${f.name} · ${Math.ceil(f.size/1024)} KB`}
                          onDelete={() => setAskFiles(prev => prev.filter((_, i) => i !== idx))}
                          sx={{ color: '#cfd3f7', borderColor: 'rgba(255,255,255,0.2)' }}
                        />
                      ))}
                    </Stack>
                  )}

                  {/* Coming soon note */}
                  <Alert severity="info" variant="outlined" sx={{ background: 'rgba(24,26,47,0.6)', color: '#cfd3f7', borderColor: 'rgba(255,255,255,0.15)' }}>
                    A dedicated Q/A page with searchable answers and topics is coming soon.
                  </Alert>
                </Stack>
              </VuiBox>
            )}

            {commTab === 2 && (
              <VuiBox>
                <VuiTypography variant="button" color="text" sx={{ fontSize: 15 }}>
                  No letters available.
                </VuiTypography>
              </VuiBox>
            )}

            {commTab === 3 && (
              <VuiBox>
                <VuiTypography variant="button" color="text" sx={{ fontSize: 15 }}>
                  No resources found.
                </VuiTypography>
              </VuiBox>
            )}

            {commTab === 3 && (
              <VuiBox>
                <VuiTypography variant="button" color="text" mb={1} sx={{ fontSize: 15 }}>
                  Trusted resources curated from U.S. government and NIH/CDC/HHS sites.
                </VuiTypography>
                {/* Quick search */}
                  <TextField
                  fullWidth
                  placeholder="Search topics (e.g., diabetes, pregnancy, vaccines)"
                  value={resourcesQuery}
                  onChange={(e) => setResourcesQuery(e.target.value)}
                  variant="outlined"
                  size="small"
                  InputLabelProps={inputLabelPropsSmall}
                  sx={{ ...inputSxSmall, my: 1.5, '& .MuiOutlinedInput-notchedOutline': { border: '2px solid #23244a' } }}
                />

                <Grid container spacing={2}>
                  {filteredResources.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <Grid item xs={12} sm={6} key={cat.key}>
                        <Box
                          sx={{
                            background: 'linear-gradient(180deg, rgba(24,26,47,0.9) 0%, rgba(22,24,45,0.9) 100%)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: 2,
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                            transition: 'transform .15s ease, box-shadow .15s ease',
                            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 30px rgba(0,0,0,0.35)' }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Icon sx={{ color: '#00FFD0', opacity: 0.9 }} />
                            <VuiTypography color="white" fontWeight="bold" sx={{ fontSize: 16 }}>{cat.title}</VuiTypography>
                          </Box>
                          <VuiTypography color="text" sx={{ fontSize: 14 }}>{cat.blurb}</VuiTypography>
                          <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.08)' }} />
                          <Stack spacing={1}>
                            {cat.links.map((lnk) => (
                              <Button
                                key={lnk.href}
                                onClick={() => window.open(lnk.href, '_blank', 'noopener,noreferrer')}
                                endIcon={<OpenInNewRoundedIcon sx={{ fontSize: 16 }} />}
                                sx={{
                                  justifyContent: 'space-between',
                                  color: '#e7e9f3',
                                  textTransform: 'none',
                                  fontSize: 14,
                                  py: 0.75,
                                  px: 1,
                                  borderRadius: 1.5,
                                  background: 'rgba(255,255,255,0.02)',
                                  border: '1px solid rgba(255,255,255,0.06)',
                                  '&:hover': { background: 'rgba(255,255,255,0.08)' }
                                }}
                              >
                                {lnk.label}
                              </Button>
                            ))}
                          </Stack>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>

                {filteredResources.length === 0 && (
                  <VuiTypography color="text" sx={{ mt: 1 }}>No resources found.</VuiTypography>
                )}
              </VuiBox>
            )}

            {commTab === 4 && (
              <VuiBox>
                <VuiTypography variant="button" color="text" mb={1} sx={{ fontSize: 15 }}>
                  Report an issue you’re experiencing.
                </VuiTypography>
                <Stack spacing={2}>
                  {/* Description */}
                  <TextField
                    multiline
                    minRows={3}
                    value={reportForm.description}
                    onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                    variant="outlined"
                    placeholder="Describe the problem..."
                    fullWidth
                    helperText={`${reportForm.description.length}/500`}
                    inputProps={{ maxLength: 500 }}
                    InputLabelProps={inputLabelPropsSmall}
                    sx={inputSxSmall}
                  />

                  {/* Contact details */}
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      label="Email (optional)"
                      type="email"
                      value={reportForm.email}
                      onChange={(e) => setReportForm({ ...reportForm, email: e.target.value })}
                      placeholder="name@example.com"
                      fullWidth
                      error={reportForm.replyEmail && !isValidEmail(reportForm.email)}
                      helperText={reportForm.replyEmail && !isValidEmail(reportForm.email) ? 'Enter a valid email' : undefined}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailRoundedIcon sx={{ fontSize: 18, color: '#a6b1e1' }} />
                          </InputAdornment>
                        )
                      }}
                      InputLabelProps={inputLabelPropsSmall}
                      sx={inputSxSmall}
                    />
                    <TextField
                      label="Phone (optional)"
                      type="tel"
                      value={reportForm.phone}
                      onChange={(e) => setReportForm({ ...reportForm, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                      fullWidth
                      error={reportForm.replySMS && !isValidPhone(reportForm.phone)}
                      helperText={reportForm.replySMS && !isValidPhone(reportForm.phone) ? 'Enter a valid phone' : undefined}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneRoundedIcon sx={{ fontSize: 18, color: '#a6b1e1' }} />
                          </InputAdornment>
                        )
                      }}
                      InputLabelProps={inputLabelPropsSmall}
                      sx={inputSxSmall}
                    />
                  </Stack>

                  {/* Category, Severity, Preferences */}
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                    <TextField
                      select
                      label="Category"
                      value={reportForm.category}
                      onChange={(e) => setReportForm({ ...reportForm, category: e.target.value })}
                      InputLabelProps={inputLabelPropsSmall}
                      sx={{ ...inputSxSmall, minWidth: 200 }}
                    >
                      {['Bug','Appointments','Billing','Medical Records','Prescriptions','Referrals','Technical','Other'].map(opt => (
                        <MenuItem key={opt} value={opt} sx={{ background: '#181a2f', color: '#fff' }}>{opt}</MenuItem>
                      ))}
                    </TextField>
                    {reportForm.category === 'Other' && (
                      <TextField
                        label="Category (other)"
                        value={reportForm.categoryOther}
                        onChange={(e) => setReportForm({ ...reportForm, categoryOther: e.target.value })}
                        placeholder="Type a category"
                        InputLabelProps={inputLabelPropsSmall}
                        sx={inputSxSmall}
                      />
                    )}
                    <TextField
                      select
                      label="Severity"
                      value={reportForm.severity}
                      onChange={(e) => setReportForm({ ...reportForm, severity: e.target.value })}
                      InputLabelProps={inputLabelPropsSmall}
                      sx={{ ...inputSxSmall, minWidth: 160 }}
                    >
                      {['Low','Normal','High','Critical'].map(opt => (
                        <MenuItem key={opt} value={opt} sx={{ background: '#181a2f', color: '#fff' }}>{opt}</MenuItem>
                      ))}
                    </TextField>
                    <FormControlLabel control={<Switch color="info" checked={reportForm.replyEmail} onChange={(e) => setReportForm({ ...reportForm, replyEmail: e.target.checked })} />} label={<VuiTypography variant="button" color="text">Reply by Email</VuiTypography>} />
                    <FormControlLabel control={<Switch color="info" checked={reportForm.replySMS} onChange={(e) => setReportForm({ ...reportForm, replySMS: e.target.checked })} />} label={<VuiTypography variant="button" color="text">Reply by SMS</VuiTypography>} />
                  </Stack>

                  {/* Attachments */}
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }}>
                    <input
                      ref={reportFileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.gif,.txt,.csv,.doc,.docx,.log"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const limitMB = 10;
                        const filtered = files.filter(f => f.size <= limitMB * 1024 * 1024);
                        setReportFiles(prev => [...prev, ...filtered].slice(0, 5));
                        e.target.value = '';
                      }}
                    />
                    <Button
                      variant="outlined"
                      color="info"
                      startIcon={<AttachFileOutlinedIcon />}
                      onClick={() => reportFileInputRef.current?.click()}
                      sx={{ color: '#c6c9e5', borderColor: 'rgba(106,106,252,0.6)', '&:hover': { borderColor: '#6a6afc', background: 'rgba(106,106,252,0.08)' } }}
                    >
                      Attach files
                    </Button>
                    <Box flexGrow={1} />
                    <VuiTypography variant="button" color="text">Include screenshots if possible.</VuiTypography>
                    <Button color="info" endIcon={<SendRoundedIcon />} disabled={!reportForm.description.trim() || (reportForm.replyEmail && !isValidEmail(reportForm.email)) || (reportForm.replySMS && !isValidPhone(reportForm.phone))} sx={{ fontWeight: 700, px: 2, py: 1 }} onClick={handleReportSubmit}>
                      Report
                    </Button>
                  </Stack>

                  {/* Selected files */}
                  {reportFiles.length > 0 && (
                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                      {reportFiles.map((f, idx) => (
                        <Chip
                          key={`${f.name}-${idx}`}
                          variant="outlined"
                          icon={<InsertDriveFileOutlinedIcon sx={{ fontSize: 18 }} />}
                          label={`${f.name} · ${Math.ceil(f.size/1024)} KB`}
                          onDelete={() => setReportFiles(prev => prev.filter((_, i) => i !== idx))}
                          sx={{ color: '#cfd3f7', borderColor: 'rgba(255,255,255,0.2)' }}
                        />
                      ))}
                    </Stack>
                  )}

                  {/* Note */}
                  <Alert severity="info" variant="outlined" sx={{ background: 'rgba(24,26,47,0.6)', color: '#cfd3f7', borderColor: 'rgba(255,255,255,0.15)' }}>
                    Thanks for helping us improve. Your report is reviewed by our team.
                  </Alert>
                </Stack>
              </VuiBox>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 2.5, pb: 2.5 }}>
            <Button onClick={() => setCommunicationDialog(false)} color="primary" sx={{ fontSize: 15, fontWeight: 600, px: 3, py: 1 }}>Close</Button>
          </DialogActions>
        </Dialog>
        {/* Report submit snackbar */}
        <Snackbar
          open={reportSnackbar}
          autoHideDuration={3000}
          onClose={() => setReportSnackbar(false)}
          message="Issue reported! Thank you."
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
        {/* Ask submit snackbar */}
        <Snackbar
          open={askSnackbar}
          autoHideDuration={3000}
          onClose={() => setAskSnackbar(false)}
          message="Question sent! We'll reach out soon."
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />

        {/* independent chat popup - modernized */}
        <Dialog
          open={chatOpen}
          onClose={handleCloseChat}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              background: 'linear-gradient(180deg, rgba(22,24,45,0.92) 0%, rgba(20,22,40,0.92) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 3,
              color: 'white',
              minWidth: 520,
              maxWidth: 760,
            }
          }}
        >
          {/* Header */}
          <VuiBox display="flex" alignItems="center" justifyContent="space-between" px={2.25} pt={1.5} pb={1} sx={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <VuiBox display="flex" alignItems="center" gap={1.25}>
              <VuiBox position="relative">
                <Avatar src={selectedDoctor ? doctorDetails[selectedDoctor]?.avatar : undefined} alt={selectedDoctor || ''} sx={{ width: 40, height: 40 }} />
                <Box sx={{ position: 'absolute', right: 0, bottom: 0, width: 10, height: 10, bgcolor: '#1de9b6', border: '2px solid #17192f', borderRadius: '50%' }} />
              </VuiBox>
              <VuiBox>
                <VuiTypography color="white" fontWeight="bold" sx={{ fontSize: 18 }}>{selectedDoctor || ''}</VuiTypography>
                <VuiTypography color="text" sx={{ fontSize: 13 }}>{selectedDoctor ? doctorDetails[selectedDoctor]?.hospital : ''}</VuiTypography>
              </VuiBox>
            </VuiBox>
            <VuiBox display="flex" alignItems="center" gap={0.5}>
              <Tooltip title={showDoctorInfo ? 'Hide info' : 'Show info'}>
                <IconButton color="info" size="small" onClick={() => setShowDoctorInfo(v => !v)}>
                  <InfoOutlinedIcon />
                </IconButton>
              </Tooltip>
              <IconButton color="info" size="small" onClick={handleCloseChat}>
                <CloseRoundedIcon />
              </IconButton>
            </VuiBox>
          </VuiBox>

          {/* Content grid: messages + optional info panel */}
          <DialogContent sx={{ p: 0 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: showDoctorInfo ? '2fr 1fr' : '1fr' }, gap: 0, minHeight: 380 }}>
              {/* Messages area */}
              <Box ref={messagesContainerRef} sx={{ p: 2, maxHeight: { xs: 420, sm: 420 }, overflowY: 'auto' }}>
                {(chatMessages[selectedDoctor] || []).map((msg, idx, arr) => {
                  const isYou = msg.from === 'You';
                  const prev = arr[idx - 1];
                  const showName = !isYou && (!prev || prev.from !== msg.from);
                  return (
                    <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', alignItems: isYou ? 'flex-end' : 'flex-start', mb: 1 }}>
                      <Box
                        sx={{
                          maxWidth: '68%',
                          background: isYou ? 'rgba(106,106,252,0.14)' : 'rgba(255,255,255,0.045)',
                          color: '#e7e9f3',
                          border: isYou ? '1px solid rgba(106,106,252,0.22)' : '1px solid rgba(255,255,255,0.06)',
                          borderRadius: isYou ? '12px 12px 8px 12px' : '12px 12px 12px 8px',
                          boxShadow: 'none',
                          padding: '8px 12px',
                        }}
                      >
                        {showName && (
                          <VuiTypography variant="caption" color="text" sx={{ display: 'block', mb: 0.25, opacity: 0.75 }}>
                            {msg.from}
                          </VuiTypography>
                        )}
                        <VuiTypography color="white" sx={{ fontSize: 14, lineHeight: 1.5 }}>
                          {msg.text}
                        </VuiTypography>
                      </Box>
                      {/* Time + status below bubble */}
                      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
                        <VuiTypography variant="caption" color="text" sx={{ fontSize: 10, opacity: 0.65 }}>
                          {msg.time}
                        </VuiTypography>
                        {isYou && (
                          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25, color: 'rgba(231,233,243,0.8)' }}>
                            {renderStatus(msg.status)}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </Box>

              {/* Info panel */}
              {showDoctorInfo && (
                <Box sx={{ borderLeft: { sm: '1px solid rgba(255,255,255,0.08)' }, p: 2 }}>
                  <VuiTypography color="white" fontWeight="bold" mb={1} sx={{ fontSize: 16 }}>Doctor Info</VuiTypography>
                  <Stack spacing={1.25}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LocalHospitalRoundedIcon sx={{ fontSize: 18, opacity: 0.9 }} />
                      <VuiTypography variant="button" color="text" sx={{ fontSize: 14 }}>{selectedDoctor ? doctorDetails[selectedDoctor]?.hospital : ''}</VuiTypography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <EmailRoundedIcon sx={{ fontSize: 18, opacity: 0.9 }} />
                      <VuiTypography variant="button" color="text" sx={{ fontSize: 14 }}>{selectedDoctor ? doctorDetails[selectedDoctor]?.email : ''}</VuiTypography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PhoneRoundedIcon sx={{ fontSize: 18, opacity: 0.9 }} />
                      <VuiTypography variant="button" color="text" sx={{ fontSize: 14 }}>{selectedDoctor ? doctorDetails[selectedDoctor]?.phone : ''}</VuiTypography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LocationOnRoundedIcon sx={{ fontSize: 18, opacity: 0.9 }} />
                      <VuiTypography variant="button" color="text" sx={{ fontSize: 14 }}>{selectedDoctor ? doctorDetails[selectedDoctor]?.location : ''}</VuiTypography>
                    </Stack>
                  </Stack>
                </Box>
              )}
            </Box>
          </DialogContent>

          {/* Input area */}
          <DialogActions sx={{ px: 2, pb: 2, pt: 1 }}>
            <TextField
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              label="Message"
              fullWidth
              size="medium"
              variant="outlined"
              placeholder="Type a message..."
              sx={{
                background: '#181a2f',
                borderRadius: 2,
                border: '1px solid #23244a',
                input: { color: '#fff', fontWeight: 500 },
                label: { color: '#a6b1e1', fontSize: '0.95rem' },
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiOutlinedInput-root': { background: '#181a2f', borderRadius: 2 },
              }}
              onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
            />
            <Button onClick={handleSendMessage} color="info" sx={{ fontWeight: 700, ml: 1.25, px: 2.5 }}>Send</Button>
          </DialogActions>
        </Dialog>
      </DashboardLayout>
    </AppointmentProvider>
  );
}

export default Overview;
