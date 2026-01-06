// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import { LineLabelTextField } from "../profile/index";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiProgress from "components/VuiProgress";
import VuiBadge from "components/VuiBadge";
import VuiAvatar from "components/VuiAvatar";
import VuiButton from "components/VuiButton";

// Vision UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import { useProjects } from "../../context/ProjectsContext";
import { useAppointments } from "../../context/AppointmentContext";

// Icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { FaEllipsisH } from 'react-icons/fa';
import React, { useState } from "react";
import { dateFnsLocalizer } from "react-big-calendar";

// Reuse billing widgets
import Invoices from "layouts/billing/components/Invoices";
import BillingInformation from "layouts/billing/components/BillingInformation";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import getApiBase from "../../lib/apiBase";
import insuranceOptions from "lib/insuranceOptions";

function Tables() {
  const API = getApiBase();
  const { columns, rows } = authorsTableData;
  const { projects, addProject, updateProject, removeProject } = useProjects();
  const { appointments, addAppointment, addProvider } = useAppointments();
  // General dialog and form state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ hospital: "", doctors: "", bill: "", completion: 0 });
  const [dialogMode, setDialogMode] = useState('pharmacy');
  const [menuAnchor, setMenuAnchor] = useState(null);
  // Appointment dialog state
  const [apptForm, setApptForm] = useState({
    hospital: "",
    doctor: "",
    bill: "",
    status: "Active",
    completion: "",
    progress: "In Progress",
    date: ""
  });
  const [apptDialogOpen, setApptDialogOpen] = useState(false);
  const [editApptIdx, setEditApptIdx] = useState(null);
  const [apptMenuAnchor, setApptMenuAnchor] = useState(null);
  const [apptFilterStatus, setApptFilterStatus] = useState('all');
  const [viewAllApptOpen, setViewAllApptOpen] = useState(false);
  const [viewAllHubOpen, setViewAllHubOpen] = useState(false);
  // HUB provider dialog state
  const [hubProvDialogOpen, setHubProvDialogOpen] = useState(false);
  // Provider search state
  const [provQuery, setProvQuery] = useState("");
  const [provInsurance, setProvInsurance] = useState("");
  const [provZip, setProvZip] = useState("");
  const [provLoading, setProvLoading] = useState(false);
  const [provResults, setProvResults] = useState([]);
  const [provSearchAttempted, setProvSearchAttempted] = useState(false);

  // Handlers for add/edit
  const handleOpenEdit = (appt, idx) => handleOpenApptEdit(appt, idx);
  const handleOpenAdd = () => handleOpenApptAdd();
  const handleOpenHubAdd = () => {
    setEditId(null);
    setForm({ hospital: "", doctors: "", bill: "", completion: 0, status: "Active" });
    setDialogMode('hub');
    setDialogOpen(true);
  };
  // Generic close handler
  const handleClose = () => {
    setDialogOpen(false);
    setApptDialogOpen(false);
    setHubProvDialogOpen(false);
    setEditId(null);
    setEditApptIdx(null);
  };
  // Generic change handler for forms
  const handleChange = (e) => {
    const { name, value } = e.target;
    setApptForm((prev) => ({ ...prev, [name]: value }));
  };
  // Delete handler stub
  const handleDelete = (id) => {
    // Implement delete logic as needed
  };
  // Submit handler stub
  const handleSubmit = () => {
    // Implement submit logic as needed
  };
  // Provider search stub
  const runProviderSearch = () => {
    setProvLoading(true);
    setProvSearchAttempted(true);
    // Simulate async search
    setTimeout(() => {
      setProvResults([]);
      setProvLoading(false);
    }, 1000);
  };

  // Placeholder handlers for "View All" actions
  const handleViewAllAppointments = () => setViewAllApptOpen(true);

  // Appointment menu handlers (similar to TODO TRACK)
  const handleApptMenuOpen = (event) => {
    setApptMenuAnchor(event.currentTarget);
  };

  const handleApptMenuClose = () => {
    setApptMenuAnchor(null);
  };

  const handleApptStatusFilter = (status) => {
    setApptFilterStatus(status);
    handleApptMenuClose();
  };
  const handleViewAllHub = () => setViewAllHubOpen(true);

  // Unified TextField styles (no inner blue bubble). Match Account Settings inputs.
  const fieldSx = {
    width: '100%',
    ml: 0,
    borderRadius: 1.5,
    '& .MuiOutlinedInput-root': {
      background: '#0a0c1a',
      '&:hover': {
        background: '#0d0f1f',
      },
    },
    '& .MuiOutlinedInput-notchedOutline': { border: '1px solid rgba(255, 255, 255, 0.06)' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.12)' },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(106, 106, 252, 0.4)' },
    '& .MuiInputBase-input': { color: '#e7e9f3', fontSize: 14, py: 1, background: 'transparent' },
    '& .MuiSelect-select': { background: 'transparent' },
    '& .MuiInputLabel-root': {
      color: '#6b7199',
      '&.Mui-focused': { color: '#6b7199' },
    },
  };

  const glassPaper = {
    background: 'linear-gradient(135deg, rgba(26,30,58,0.92) 0%, rgba(20,22,40,0.94) 100%)',
    backdropFilter: 'blur(14px) saturate(100%)',
    WebkitBackdropFilter: 'blur(14px) saturate(100%)',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 8px 28px -6px rgba(0,0,0,0.55), 0 2px 6px rgba(0,0,0,0.3)',
    borderRadius: 3,
    color: 'white',
    p: 0,
    overflow: 'hidden'
  };

  // Open dialog for new appointment
  const handleOpenApptAdd = () => {
    setEditApptIdx(null);
    setApptForm({ hospital: "", doctor: "", bill: "", status: "Active", completion: "", progress: "In Progress", date: "" });
    setApptDialogOpen(true);
  };
  // Open dialog for edit
  const handleOpenApptEdit = (appt, idx) => {
    setEditApptIdx(idx);
    setApptForm({
      doctor: appt.doctor?.name || appt.title || "",
      bill: appt.bill || appt.type || "",
      hospital: appt.doctor?.hospital || appt.hospital || "",
      status: appt.doctor?.status || appt.status || "Active",
      completion: appt.doctor?.completion || appt.completion || "",
      progress: appt.doctor?.progress || appt.progress || "In Progress",
      date: appt.start ? new Date(appt.start).toISOString().slice(0,10) : ""
    });
    setApptDialogOpen(true);
  };
  // Save appointment (add or edit)
  const handleApptSave = () => {
    const newAppt = {
      title: apptForm.doctor,
      bill: apptForm.bill,
      type: apptForm.bill,
      hospital: apptForm.hospital,
      status: apptForm.status,
      progress: apptForm.status,
      start: new Date(),
      completion: apptForm.completion,
      doctor: {
        name: apptForm.doctor,
        status: apptForm.status,
        progress: apptForm.status,
        completion: apptForm.completion,
      }
    };
    addAppointment(newAppt);
    setApptDialogOpen(false);
  };

  // Columns for interactive HUB table
  const prCols = [
    { name: "hospital", align: "left", label: "Hospital" },
    { name: "doctors", align: "left", label: "Doctors" },
    { name: "bill", align: "center", label: "Bill" },
    { name: "status", align: "center", label: "Status" },
    { name: "completion", align: "center", label: "Completion" },
    { name: "actions", align: "center", label: "Actions" },
  ];
  const prRows = projects.map((p, idx) => ({
    hospital: p.hospital,
    doctors: p.doctors.join ? p.doctors.join(", ") : p.doctors,
    bill: p.bill,
    status: (
      <VuiTypography variant="button" color="white" fontWeight="medium">
        {p.status || "Working"}
      </VuiTypography>
    ),
    completion: (
      <VuiBox display="flex" flexDirection="column" alignItems="flex-start">
        <VuiTypography variant="button" color="white" fontWeight="medium" mb="4px">
          {p.completion}%
        </VuiTypography>
        <VuiBox width="8rem">
          <VuiProgress
            value={p.completion}
            color="info"
            variant="gradient"
            label={false}
            sx={{
              background: "#2D2E5F",
              '& .MuiLinearProgress-bar': {
                backgroundImage: 'linear-gradient(90deg, #0A2E7B 0%, #3FA9F5 50%, #0A2E7B 100%) !important',
              },
            }}
          />
        </VuiBox>
      </VuiBox>
    ),
    actions: (
      <VuiTypography
        component="button"
        variant="caption"
        color="info"
        fontWeight="medium"
        sx={{ cursor: "pointer", background: "none", border: 0, p: 0 }}
        onClick={() => handleOpenEdit(p)}
      >
        Edit
      </VuiTypography>
    ),
  }));

  // Doctor/appointment table columns
  const apptCols = [
    { name: "doctor", align: "left", label: "Doctor" },
    { name: "function", align: "left", label: "Type & Hospital" },
    { name: "status", align: "center", label: "Status" },
    { name: "date", align: "center", label: "Date" },
    { name: "action", align: "center", label: "Action" },
  ];
  
  // Filter appointments based on status (similar to TODO TRACK)
  const filteredAppointments = appointments.filter(appt => {
    if (apptFilterStatus === 'all') return true;
    
    const apptDate = appt.start ? new Date(appt.start) : new Date();
    const currentDate = new Date();
    const status = appt.status || appt.doctor?.status || 'Active';
    
    if (apptFilterStatus === 'past') {
      return apptDate < currentDate;
    } else if (apptFilterStatus === 'ongoing') {
      return apptDate >= currentDate && status !== 'Completed';
    } else if (apptFilterStatus === 'completed') {
      return status === 'Completed';
    }
    
    return true;
  });
  
  // Map filtered appointments to doctor rows
  const apptRows = filteredAppointments.map((appt, idx) => {
    // Example doctor info (replace with real data if available)
    const doctor = appt.doctor || {
      name: appt.title || "Doctor Name",
      email: appt.email || "doctor@email.com",
      type: appt.type || "General Practitioner",
      hospital: appt.hospital || "Unknown Hospital",
      avatar: appt.avatar || null,
      status: appt.status || (appt.active ? "Active" : "Inactive"),
      progress: appt.progress || "In Progress", // new field
    };
    // Status badge color logic
    let statusColor = "info";
    if (doctor.progress === "Inactive") statusColor = "secondary";
    else if (doctor.progress === "Active") statusColor = "success";
    else if (doctor.progress === "Coming Soon") statusColor = "warning";
    else if (doctor.progress === "Completed") statusColor = "primary";
    else if (doctor.progress === "In Progress") statusColor = "info";
    return {
      doctor: (
        <VuiBox display="flex" alignItems="center" px={1} py={0.5}>
          <VuiBox mr={2}>
            <VuiAvatar src={doctor.avatar} alt={doctor.name} size="sm" variant="rounded" />
          </VuiBox>
          <VuiBox display="flex" flexDirection="column">
            <VuiTypography variant="button" color="white" fontWeight="medium">
              {doctor.name}
            </VuiTypography>
            <VuiTypography variant="caption" color="text">
              {doctor.email}
            </VuiTypography>
          </VuiBox>
        </VuiBox>
      ),
      function: (
        <VuiBox display="flex" flexDirection="column">
          <VuiTypography variant="caption" fontWeight="medium" color="white">
            {doctor.type}
          </VuiTypography>
          <VuiTypography variant="caption" color="text">
            {doctor.hospital}
          </VuiTypography>
        </VuiBox>
      ),
      status: (
        <VuiBadge
          variant="standard"
          badgeContent={doctor.progress}
          color={statusColor}
          size="xs"
          container
          sx={({ palette: { white, info, success, secondary, warning, primary }, borders: { borderRadius, borderWidth } }) => ({
            background:
              statusColor === "info" ? info.main :
              statusColor === "success" ? success.main :
              statusColor === "secondary" ? secondary.main :
              statusColor === "warning" ? warning.main :
              statusColor === "primary" ? primary.main : info.main,
            border: `${borderWidth[1]} solid ` + (
              statusColor === "info" ? info.main :
              statusColor === "success" ? success.main :
              statusColor === "secondary" ? secondary.main :
              statusColor === "warning" ? warning.main :
              statusColor === "primary" ? primary.main : info.main
            ),
            borderRadius: borderRadius.md,
            color: white.main,
            opacity: ["In Progress", "Coming Soon", "Completed"].includes(doctor.progress) ? 0.7 : 1,
          })}
        />
      ),
      date: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          {appt.start ? new Date(appt.start).toLocaleDateString() : "-"}
        </VuiTypography>
      ),
      action: (
        <VuiTypography
          component="button"
          variant="caption"
          color="info"
          fontWeight="medium"
          sx={{ cursor: "pointer", background: "none", border: 0, p: 0 }}
          onClick={() => handleOpenApptEdit(appt, idx)}
        >
          Edit
        </VuiTypography>
      ),
    };
  });

  return (
    <DashboardLayout>
      {/* Full-page background gradient that always covers the viewport, including scroll */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          minHeight: "100dvh",
          minWidth: "100vw",
          zIndex: -1,
          background: "radial-gradient(ellipse at 60% 0%, #2a2e5a 60%, #1a1c3a 100%)",
        }}
      />
      <DashboardNavbar />
      <VuiBox py={3} minHeight="calc(100vh - 120px)">
        <VuiBox mb={3}>
          <Card sx={{ minHeight: 220, height: 320, display: 'flex', flexDirection: 'column' }}>
            <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="22px">
              <VuiTypography variant="lg" color="white">
                Appointments
              </VuiTypography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 0, alignItems: 'center', marginRight: 12 }}>
                  <VuiButton
                    variant="contained"
                    color="info"
                    size="small"
                    onClick={handleViewAllAppointments}
                    style={{
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                      minWidth: 36,
                      padding: '6px 14px',
                      fontWeight: 600,
                      letterSpacing: 0.5,
                      fontSize: 13,
                      opacity: 0.7,
                      background: 'rgba(32,34,64,0.7)',
                      color: '#e0e0e0',
                      boxShadow: 'none',
                      height: 36,
                    }}
                  >
                    VIEW ALL
                  </VuiButton>
                  <VuiButton
                    variant="contained"
                    color="info"
                    size="small"
                    onClick={handleOpenApptAdd}
                    style={{
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                      minWidth: 36,
                      padding: 0,
                      opacity: 0.7,
                      background: 'rgba(32,34,64,0.7)',
                      color: '#e0e0e0',
                      boxShadow: 'none',
                      height: 36,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AddIcon />
                  </VuiButton>
                </div>
                {/* Three dots menu for appointment filtering */}
                <VuiBox 
                  display='flex' 
                  justifyContent='center' 
                  alignItems='center' 
                  bgColor='#22234B' 
                  sx={{ 
                    width: '37px', 
                    height: '37px', 
                    cursor: 'pointer', 
                    borderRadius: '12px', 
                    ml: 1, 
                    userSelect: 'auto',
                    '&:hover': { background: '#2a2c5a' }
                  }}
                  onClick={handleApptMenuOpen}
                >
                  <FaEllipsisH color="#6C63FF" size='18px' />
                </VuiBox>
                <Menu
                  anchorEl={apptMenuAnchor}
                  open={Boolean(apptMenuAnchor)}
                  onClose={handleApptMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  PaperProps={{
                    sx: {
                      background: '#22234B',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: 2,
                      '& .MuiMenuItem-root': {
                        color: '#fff',
                        fontSize: 14,
                        '&:hover': {
                          background: 'rgba(165,138,255,0.15)',
                        }
                      }
                    }
                  }}
                >
                  <MenuItem onClick={() => handleApptStatusFilter('all')}>
                    All Appointments
                  </MenuItem>
                  <MenuItem onClick={() => handleApptStatusFilter('past')}>
                    Past
                  </MenuItem>
                  <MenuItem onClick={() => handleApptStatusFilter('ongoing')}>
                    Ongoing
                  </MenuItem>
                  <MenuItem onClick={() => handleApptStatusFilter('completed')}>
                    Completed
                  </MenuItem>
                </Menu>
              </Box>
            </VuiBox>
            <VuiBox
              sx={{
                flex: 1,
                minHeight: 0,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                // Make the TableContainer own the scrollbar at the very bottom
                '& .MuiTableContainer-root': {
                  flex: 1,
                  minHeight: 0,
                  overflowX: 'auto',
                  overflowY: 'hidden',
                },
                '& .MuiTableContainer-root table': { minWidth: 650 },
                // Simplified, consistent scrollbar styling (like dashboard)
                '& .MuiTableContainer-root::-webkit-scrollbar': { height: 8, background: 'transparent' },
                '& .MuiTableContainer-root::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.13)', borderRadius: 6 },
                '& .MuiTableContainer-root::-webkit-scrollbar-track': { background: 'transparent' },
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(255,255,255,0.13) transparent',
                // Table borders
                '& th': {
                  borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
                    `${borderWidth[1]} solid ${grey[700]}`,
                },
                '& .MuiTableRow-root:not(:last-child)': {
                  '& td': {
                    borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
                      `${borderWidth[1]} solid ${grey[700]}`,
                  },
                },
              }}
            >
              <Table columns={apptCols} rows={apptRows} />
            </VuiBox>
          </Card>
        </VuiBox>
        <Card sx={{ display: 'flex', flexDirection: 'column', height: 420, minHeight: 420 }}>
          <VuiBox display="flex" justifyContent="space-between" alignItems="center" px={2} pt={2} pb={1}>
            <VuiTypography variant="lg" color="white">
              HUB
            </VuiTypography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* Search Providers now on the left */}
              {/* Search Providers button restyled to visually align with VIEW ALL / + buttons */}
              <VuiButton
                variant="contained"
                color="info"
                size="small"
                onClick={() => setHubProvDialogOpen(true)}
                style={{
                  marginRight: 12,
                  minWidth: 36,
                  padding: '6px 14px',
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  fontSize: 13,
                  opacity: 0.7,
                  background: 'rgba(32,34,64,0.7)',
                  color: '#e0e0e0',
                  boxShadow: 'none',
                  height: 36,
                }}
              >
                SEARCH PROVIDERS
              </VuiButton>
              {/* View All + group moved to far right */}
              <div style={{ display: 'flex', gap: 0, alignItems: 'center' }}>
                <VuiButton
                  variant="contained"
                  color="info"
                  size="small"
                  onClick={handleViewAllHub}
                  style={{
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    minWidth: 36,
                    padding: '6px 14px',
                    fontWeight: 600,
                    letterSpacing: 0.5,
                    fontSize: 13,
                    opacity: 0.7,
                    background: 'rgba(32,34,64,0.7)',
                    color: '#e0e0e0',
                    boxShadow: 'none',
                    height: 36,
                  }}
                >
                  VIEW ALL
                </VuiButton>
                <VuiButton
                  variant="contained"
                  color="info"
                  size="small"
                  onClick={handleOpenAdd}
                  style={{
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    minWidth: 36,
                    padding: 0,
                    opacity: 0.7,
                    background: 'rgba(32,34,64,0.7)',
                    color: '#e0e0e0',
                    boxShadow: 'none',
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AddIcon />
                </VuiButton>
              </div>
            </Box>
          </VuiBox>
          <VuiBox sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <VuiBox
              sx={{
                flex: 1,
                minHeight: 0,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                '& .MuiTableContainer-root': {
                  flex: 1,
                  minHeight: 0,
                  overflowX: 'auto',
                  overflowY: 'hidden',
                },
                '& .MuiTableContainer-root table': { minWidth: 650 },
                // Simplified, consistent scrollbar styling (like dashboard)
                '& .MuiTableContainer-root::-webkit-scrollbar': { height: 8, background: 'transparent' },
                '& .MuiTableContainer-root::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.13)', borderRadius: 6 },
                '& .MuiTableContainer-root::-webkit-scrollbar-track': { background: 'transparent' },
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(255,255,255,0.13) transparent',
              }}
            >
              <Table columns={prCols} rows={prRows} />
            </VuiBox>
          </VuiBox>
        </Card>
        {/* Replicated boxes from Billing page: Pharmacy Information and Prescriptions */}
        <VuiBox my={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <BillingInformation />
            </Grid>
            <Grid item xs={12} md={5}>
              <Invoices />
            </Grid>
          </Grid>
        </VuiBox>
      </VuiBox>
      <Footer />
  <Dialog
    open={dialogOpen}
    onClose={handleClose}
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
      {dialogMode === 'hub' ? (editId ? 'Edit Healthcare Info' : 'Add Healthcare Info') : (editId ? "Edit Pharmacy Info" : "Add Pharmacy Info")}
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
      <Box mb={2}>
        <LineLabelTextField
          label="Hospital"
          name="hospital"
          value={form.hospital || ""}
          onChange={handleChange}
          fullWidth
          placeholder="Enter hospital name"
        />
        <LineLabelTextField
          label="Doctor"
          name="doctors"
          value={form.doctors || ""}
          onChange={handleChange}
          fullWidth
          placeholder="Enter doctor(s)"
        />
        <LineLabelTextField
          label="Bill"
          name="bill"
          value={form.bill || ""}
          onChange={handleChange}
          fullWidth
          placeholder="Enter bill amount"
        />
        {dialogMode === 'hub' && (
          <Autocomplete
            size="small"
            options={["In Progress", "Inactive", "Active", "Coming Soon", "Completed"]}
            value={form.status || null}
            onChange={(_, val) => setForm(f => ({ ...f, status: val || 'Active' }))}
            autoHighlight
            clearOnEscape
            disableClearable
            renderInput={(params) => (
              <LineLabelTextField
                {...params}
                label="Status"
                placeholder="Select status"
                fullWidth
                sx={{ ...fieldSx, mb: 0.5 }}
              />
            )}
            sx={{ '& .MuiOutlinedInput-root': { p: 0.25, pr: 1 } }}
          />
        )}
        <LineLabelTextField
          label="Completion (%)"
          name="completion"
          type="number"
          value={form.completion || ""}
          onChange={handleChange}
          fullWidth
          placeholder="Enter completion %"
        />
      </Box>
    </DialogContent>
        <DialogActions sx={{ background: 'transparent', px: 2, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            {editId && (
              <Button onClick={() => handleDelete(editId)} color="error" sx={{ color: '#ff8080' }}>
                Delete
              </Button>
            )}
          </Box>
          <Box>
            <Button onClick={handleClose} sx={{ color: '#bfc6e0', mr: 1 }}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ background: 'rgba(44, 50, 90, 0.85)', boxShadow: 'none', borderRadius: 2, px: 3, fontWeight: 600 }}>{editId ? "Save" : "Add"}</Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* View All Appointments */}
      <Dialog
        open={!!viewAllApptOpen}
        onClose={() => setViewAllApptOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(34, 40, 74, 0.65)',
            boxShadow: 24,
            borderRadius: 4,
            color: 'white',
            backdropFilter: 'blur(10px)',
            height: '92vh',
            maxHeight: '92vh',
            mt: '2vh'
          }
        }}
      >
        <DialogTitle sx={{ color: 'white', fontWeight: 700, fontSize: 22, pb: 1.25, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          All Appointments
          <IconButton
            onClick={handleApptMenuOpen}
            sx={{ color: 'white', '&:hover': { color: '#00E4FF' } }}
          >
            <FaEllipsisH />
          </IconButton>
        </DialogTitle>
        
        {/* Appointment Filter Menu */}
        <Menu
          anchorEl={apptMenuAnchor}
          open={Boolean(apptMenuAnchor)}
          onClose={handleApptMenuClose}
          PaperProps={{
            sx: {
              background: 'rgba(34, 40, 74, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              mt: 1
            }
          }}
        >
          <MenuItem 
            onClick={() => handleApptStatusFilter('all')}
            sx={{ 
              color: apptFilterStatus === 'all' ? '#00E4FF' : 'white',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            All Appointments
          </MenuItem>
          <MenuItem 
            onClick={() => handleApptStatusFilter('past')}
            sx={{ 
              color: apptFilterStatus === 'past' ? '#00E4FF' : 'white',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            Past
          </MenuItem>
          <MenuItem 
            onClick={() => handleApptStatusFilter('ongoing')}
            sx={{ 
              color: apptFilterStatus === 'ongoing' ? '#00E4FF' : 'white',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            Ongoing
          </MenuItem>
          <MenuItem 
            onClick={() => handleApptStatusFilter('completed')}
            sx={{ 
              color: apptFilterStatus === 'completed' ? '#00E4FF' : 'white',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            Completed
          </MenuItem>
        </Menu>
        
        <DialogContent sx={{ px: 2, pt: 0.5, pb: 2 }}>
          <Box sx={{
            maxHeight: 'calc(92vh - 140px)', // nearly full-height scroll
            overflowY: 'auto',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 1.5,
          }}>
            <Box sx={{ display:'flex', alignItems:'center', px: 2, py: 1, position:'sticky', top:0, background:'rgba(22,24,48,.9)', borderBottom:'1px solid rgba(255,255,255,.08)' }}>
              <VuiTypography variant="caption" color="text" sx={{ flex: 1.6 }}>Doctor</VuiTypography>
              <VuiTypography variant="caption" color="text" sx={{ flex: 1.3 }}>Function</VuiTypography>
              <VuiTypography variant="caption" color="text" sx={{ width: 120, textAlign:'center' }}>Status</VuiTypography>
              <VuiTypography variant="caption" color="text" sx={{ width: 180, textAlign:'center' }}>Date</VuiTypography>
              <VuiTypography variant="caption" color="text" sx={{ width: 100, textAlign:'right' }}>Actions</VuiTypography>
            </Box>
            {filteredAppointments.length === 0 && (
              <VuiTypography variant="caption" color="text" sx={{ p: 2, display:'block' }}>No appointments yet.</VuiTypography>
            )}
            {filteredAppointments.map((appt, idx) => {
              const doctor = appt.doctor || {};
              const name = doctor.name || appt.title || 'Doctor';
              const email = doctor.email || appt.email || '';
              const type = doctor.type || appt.type || '';
              const hospital = doctor.hospital || appt.hospital || '';
              const dateStr = appt.start ? new Date(appt.start).toLocaleString() : '';
              const progress = doctor.progress || appt.status || 'In Progress';
              let statusColor = 'info';
              if (progress === 'Inactive') statusColor = 'secondary';
              else if (progress === 'Active') statusColor = 'success';
              else if (progress === 'Coming Soon') statusColor = 'warning';
              else if (progress === 'Completed') statusColor = 'primary';
              return (
                <Box key={(appt.id || idx) + '-row'} sx={{ display:'flex', alignItems:'center', px: 2, py: 1.1, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <Box sx={{ flex: 1.6, display:'flex', alignItems:'center', gap: 1.25, minWidth: 240 }}>
                    <VuiAvatar src={doctor.avatar} alt={name} size="sm" variant="rounded" />
                    <Box sx={{ display:'flex', flexDirection:'column' }}>
                      <VuiTypography variant="button" color="white" fontWeight="medium">{name}</VuiTypography>
                      <VuiTypography variant="caption" color="text">{email || '-'}</VuiTypography>
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1.3, minWidth: 240, display:'flex', flexDirection:'column' }}>
                    <VuiTypography variant="caption" fontWeight="medium" color="white">{type || '-'}</VuiTypography>
                    <VuiTypography variant="caption" color="text">{hospital || ''}</VuiTypography>
                  </Box>
                  <Box sx={{ width: 120, display:'flex', justifyContent:'center' }}>
                    <VuiBadge variant="standard" badgeContent={progress} color={statusColor} size="xs" container />
                  </Box>
                  <VuiTypography variant="caption" color="white" fontWeight="medium" sx={{ width: 180, textAlign:'center' }}>{dateStr}</VuiTypography>
                  <Box sx={{ width: 100, textAlign:'right' }}>
                    <Button size="small" color="info" variant="outlined" onClick={() => handleOpenApptEdit(appt, idx)} sx={{ borderRadius: 2 }}>Edit</Button>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button onClick={() => setViewAllApptOpen(false)} sx={{ color: '#bfc6e0' }}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* View All HUB */}
      <Dialog
        open={!!viewAllHubOpen}
        onClose={() => setViewAllHubOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(34, 40, 74, 0.65)',
            boxShadow: 24,
            borderRadius: 4,
            color: 'white',
            backdropFilter: 'blur(10px)',
            height: '92vh',
            maxHeight: '92vh',
            mt: '2vh'
          }
        }}
      >
        <DialogTitle sx={{ color: 'white', fontWeight: 700, fontSize: 22, pb: 1.25 }}>All HUB Items</DialogTitle>
        <DialogContent sx={{ px: 2, pt: 0.5, pb: 2 }}>
          <Box sx={{
            maxHeight: 'calc(92vh - 140px)',
            overflowY: 'auto',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 1.5,
          }}>
            <Box sx={{ display:'flex', alignItems:'center', px: 2, py: 1, position:'sticky', top:0, background:'rgba(22,24,48,.9)', borderBottom:'1px solid rgba(255,255,255,.08)' }}>
              <VuiTypography variant="caption" color="text" sx={{ flex: 1.5 }}>Hospital</VuiTypography>
              <VuiTypography variant="caption" color="text" sx={{ flex: 1.4 }}>Doctors</VuiTypography>
              <VuiTypography variant="caption" color="text" sx={{ width: 80, textAlign:'center' }}>Bill</VuiTypography>
              <VuiTypography variant="caption" color="text" sx={{ width: 120, textAlign:'center' }}>Status</VuiTypography>
              <VuiTypography variant="caption" color="text" sx={{ width: 140, textAlign:'center' }}>Completion</VuiTypography>
              <VuiTypography variant="caption" color="text" sx={{ width: 100, textAlign:'right' }}>Actions</VuiTypography>
            </Box>
            {projects.length === 0 && (
              <VuiTypography variant="caption" color="text" sx={{ p: 2, display:'block' }}>No items yet.</VuiTypography>
            )}
            {projects.map((p) => (
              <Box key={p.id} sx={{ display:'flex', alignItems:'center', px: 2, py: 1.1, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <VuiTypography variant="button" color="white" fontWeight="medium" sx={{ flex: 1.5, minWidth: 200 }}>{p.hospital}</VuiTypography>
                <VuiTypography variant="caption" color="text" sx={{ flex: 1.4, minWidth: 220 }}>{Array.isArray(p.doctors) ? p.doctors.join(', ') : p.doctors}</VuiTypography>
                <VuiTypography variant="caption" color="white" fontWeight="medium" sx={{ width: 80, textAlign:'center' }}>{p.bill || '$'}</VuiTypography>
                <Box sx={{ width: 120, display:'flex', justifyContent:'center' }}>
                  <VuiBadge variant="standard" badgeContent={p.status || 'Working'} color={'info'} size="xs" container />
                </Box>
                <VuiTypography variant="caption" color="text" sx={{ width: 140, textAlign:'center' }}>{typeof p.completion === 'number' ? `${p.completion}%` : ''}</VuiTypography>
                <Box sx={{ width: 100, textAlign:'right' }}>
                  <Button size="small" color="info" variant="outlined" onClick={() => handleOpenEdit(p)} sx={{ borderRadius: 2 }}>Edit</Button>
                </Box>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button onClick={() => setViewAllHubOpen(false)} sx={{ color: '#bfc6e0' }}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog 
        open={apptDialogOpen} 
        onClose={() => setApptDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { ...glassPaper, width: { xs: '100%', sm: 600 }, maxWidth: 640 } }}
      >
        <DialogTitle sx={{ color: 'white', fontWeight: 700, fontSize: 22, pb: 2, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>{editApptIdx !== null ? "Edit Appointment" : "Add Appointment"}</span>
        </DialogTitle>
        <DialogContent 
          sx={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: 1.5, 
            mt: 1, 
            background: 'transparent',
            color: 'white',
            px: 2,
            minWidth: 400,
          }}
        >
            <VuiBox display="flex" flexDirection="column" gap={1}>
            <VuiBox sx={{ mt: 2 }}>
              <LineLabelTextField label="Hospital" name="hospital" value={apptForm.hospital} onChange={e => setApptForm(f => ({ ...f, hospital: e.target.value }))} fullWidth sx={fieldSx} />
            </VuiBox>
            <LineLabelTextField label="Doctor" name="doctor" value={apptForm.doctor} onChange={e => setApptForm(f => ({ ...f, doctor: e.target.value }))} fullWidth sx={{ ...fieldSx, mb: 0.5 }} />
            <LineLabelTextField label="Bill" name="bill" value={apptForm.bill} onChange={e => setApptForm(f => ({ ...f, bill: e.target.value }))} fullWidth sx={{ ...fieldSx, mb: 0.5 }} />
            <Autocomplete
              size="small"
              options={["In Progress", "Inactive", "Active", "Coming Soon", "Completed"]}
              value={apptForm.status || null}
              onChange={(_, val) => setApptForm(f => ({ ...f, status: val || 'Active' }))}
              autoHighlight
              clearOnEscape
              disableClearable
              renderInput={(params) => (
                <LineLabelTextField
                  {...params}
                  label="Status"
                  placeholder="Select status"
                  fullWidth
                  sx={{ ...fieldSx, mb: 0.5 }}
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
            <LineLabelTextField
              label="Completion (%)"
              name="completion"
              type="number"
              value={apptForm.completion}
              onChange={e => setApptForm(f => ({ ...f, completion: e.target.value }))}
              fullWidth
              sx={{ ...fieldSx, mb: 0.5 }}
            />
          </VuiBox>
        </DialogContent>
        <DialogActions sx={{ background: 'transparent', px: 2, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editApptIdx !== null ? (
            <Button
              color="error"
              onClick={() => {
                const updated = appointments.filter((_, idx) => idx !== editApptIdx);
                if (typeof window !== 'undefined' && window.dispatchEvent) {
                  window.location.reload();
                }
              }}
              sx={{ color: '#ff8080' }}
            >
              Delete
            </Button>
          ) : <span />}
          <Box>
            <Button onClick={() => setApptDialogOpen(false)} sx={{ color: '#bfc6e0', mr: 1 }}>Cancel</Button>
            <Button onClick={handleApptSave} variant="contained" color="primary" sx={{ background: 'rgba(44, 50, 90, 0.85)', boxShadow: 'none', borderRadius: 2, px: 3, fontWeight: 600 }}>{editApptIdx !== null ? "Save" : "Add"}</Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Provider Search Dialog for HUB */}
      <Dialog
        open={!!hubProvDialogOpen}
        onClose={() => setHubProvDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { ...glassPaper, height: '80vh', maxHeight: '80vh', mt: '5vh', display: 'flex', flexDirection: 'column', p: 3 } }}
      >
        <DialogTitle sx={{ color: 'white', fontWeight: 700, fontSize: 24, pb: 1, pr: 6 }}>
          Search Providers
          <VuiTypography component="span" variant="button" color="text" sx={{ ml: 1, fontSize: 12, letterSpacing: .5 }}>
            Find and add providers to your HUB
          </VuiTypography>
        </DialogTitle>
        <DialogContent
          sx={{
            px: 2.5,
            pt: 1,
            pb: 1.5,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            overflow: 'hidden'
          }}
        >
          {/* Search Form */}
          <Box
            sx={{
              background: 'rgba(16,20,38,0.55)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 2,
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5
            }}
          >
              <Grid container spacing={1.5} alignItems="center">
              <Grid item xs={12} md={6} lg={5}>
                <LineLabelTextField
                  label="Doctor or Specialty"
                  value={provQuery}
                  onChange={e=>setProvQuery(e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true, style: { color: '#6b7199' } }}
                  InputProps={{ startAdornment: (<Box component="span" sx={{ color: '#aeb3d5', mr: 1 }}><SearchIcon fontSize="small" /></Box>) }}
                  sx={fieldSx}
                />
              </Grid>
              <Grid item xs={6} sm={4} md={3} lg={3}>
                <Autocomplete
                  size="small"
                  options={[...new Set([...(Array.isArray(window?.__ACCOUNT_INSURANCE__)? window.__ACCOUNT_INSURANCE__: []), ...insuranceOptions])].slice(0,300)}
                  getOptionLabel={(o)=> typeof o === 'string' ? o : (o.label || '')}
                  value={provInsurance || null}
                  onChange={(e,val)=> setProvInsurance(val || "")}
                  renderInput={(params)=>(
                    <TextField
                      {...params}
                      label="Insurance"
                      placeholder="Type or choose"
                      InputLabelProps={{ shrink: true, style: { color: '#6b7199' } }}
                      sx={fieldSx}
                    />
                  )}
                  ListboxProps={{ style: { maxHeight: 260 } }}
                  filterSelectedOptions
                  clearOnEscape
                  autoHighlight
                />
              </Grid>
              <Grid item xs={6} sm={4} md={2} lg={2}>
                <LineLabelTextField size="small" label="ZIP" value={provZip} onChange={e=>setProvZip(e.target.value)} fullWidth InputLabelProps={{ shrink: true, style: { color: '#6b7199' } }} sx={fieldSx} />
              </Grid>
              <Grid item xs={12} md={2} lg={2} sx={{ display: 'flex', alignItems: 'stretch' }}>
                <Button
                  variant="contained"
                  color="info"
                  onClick={runProviderSearch}
                  disabled={provLoading}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                    px: 3,
                    minHeight: 40,
                    flex: 1,
                    background: 'linear-gradient(90deg, rgba(36,99,235,0.9) 0%, rgba(13,148,210,0.95) 100%)'
                  }}
                >
                  {provLoading ? 'Searching…' : 'Search'}
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* Results Section */}
          <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: .5 }}>
              <VuiTypography variant="button" color="white" sx={{ letterSpacing: .5, opacity: .85 }}>
                {provResults.length ? `Results (${provResults.length})` : 'Results'}
              </VuiTypography>
              {provResults.length > 0 && (
                <VuiTypography variant="caption" color="text" sx={{ fontSize: 11 }}>
                  Showing first {Math.min(provResults.length, 50)} items
                </VuiTypography>
              )}
            </Box>
            <Box
              sx={{
                position: 'relative',
                flex: 1,
                minHeight: 0,
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 2,
                overflowY: 'auto',
                background: 'rgba(16,20,38,0.45)',
                px: 1.25,
                py: 1,
                '&::-webkit-scrollbar': { width: 8 },
                '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.15)', borderRadius: 4 },
              }}
            >
              {provLoading && (
                <VuiTypography variant="caption" color="text">Searching…</VuiTypography>
              )}
              {!provLoading && provResults.length === 0 && provSearchAttempted && (
                <Box sx={{ textAlign: 'center', mt: 4, opacity: .7 }}>
                  <VuiTypography variant="button" color="text">No providers found</VuiTypography>
                  <VuiTypography variant="caption" color="text" sx={{ display: 'block', mt: .5 }}>
                    Adjust your search terms or broaden the filters.
                  </VuiTypography>
                </Box>
              )}
              {!provLoading && provResults.slice(0,50).map((p) => (
                <Box key={p.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.75, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <Box sx={{ pr: 2, minWidth: 0 }}>
                    <VuiTypography variant="button" color="white" fontWeight="medium" sx={{ display: 'block', fontSize: 13, lineHeight: 1.2 }}>
                      {p.name}
                    </VuiTypography>
                    <VuiTypography variant="caption" color="text" sx={{ fontSize: 11, lineHeight: 1.2 }}>
                      {(p.specialty || p.taxonomy || 'Specialty Unknown')}
                      {' • '}
                      {(p.city && p.state) ? `${p.city}, ${p.state}` : (p.location || 'Location Unknown')}
                    </VuiTypography>
                  </Box>
                  <Button
                    size="small"
                    color="info"
                    variant="outlined"
                    onClick={async ()=>{ await addProvider(p); }}
                    sx={{ borderRadius: 2, fontSize: 12, fontWeight: 600, minWidth: 64 }}
                  >
                    Add
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, py: 1.25, mt: 'auto' }}>
          <Button onClick={() => setHubProvDialogOpen(false)} sx={{ color: '#bfc6e0', fontWeight: 600 }}>Close</Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default Tables;
