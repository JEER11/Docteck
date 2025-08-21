// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
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
import React, { useState } from "react";
import { dateFnsLocalizer } from "react-big-calendar";

// Reuse billing widgets
import Invoices from "layouts/billing/components/Invoices";
import BillingInformation from "layouts/billing/components/BillingInformation";
import SearchIcon from "@mui/icons-material/Search";
import getApiBase from "../../lib/apiBase";

function Tables() {
  const API = getApiBase();
  const { columns, rows } = authorsTableData;
  const { projects, addProject, updateProject, removeProject } = useProjects();
  const { appointments, addAppointment, addProvider } = useAppointments();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ hospital: "", doctors: "", bill: "", completion: 0 });
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuProjectId, setMenuProjectId] = useState(null);

  // Appointment dialog state
  const [apptDialogOpen, setApptDialogOpen] = useState(false);
  const [apptForm, setApptForm] = useState({
    name: "",
    email: "",
    type: "",
    hospital: "",
    status: "Active",
    progress: "In Progress",
    date: ""
  });
  const [editApptIdx, setEditApptIdx] = useState(null);

  // Provider search (HUB box)
  const [provQuery, setProvQuery] = useState("");
  const [provCity, setProvCity] = useState("");
  const [provState, setProvState] = useState("");
  const [provZip, setProvZip] = useState("");
  const [provLoading, setProvLoading] = useState(false);
  const [provResults, setProvResults] = useState([]);
  const [hubProvDialogOpen, setHubProvDialogOpen] = useState(false);
  const runProviderSearch = async () => {
    setProvLoading(true);
    try {
      const params = new URLSearchParams();
      if (provQuery) params.set('q', provQuery);
      if (provCity) params.set('city', provCity);
      if (provState) params.set('state', provState);
      if (provZip) params.set('zip', provZip);
      const r = await fetch(`${API}/api/providers/real-search?${params.toString()}`);
      const j = await r.json();
      setProvResults(Array.isArray(j.providers) ? j.providers : []);
    } catch (_) {
      setProvResults([]);
    }
    setProvLoading(false);
  };

  const handleOpenAdd = () => {
    setEditId(null);
    setForm({ hospital: "", doctors: "", bill: "", completion: 0 });
    setDialogOpen(true);
  };
  const handleOpenEdit = (project) => {
    setEditId(project.id);
    setForm({
      hospital: project.hospital,
      doctors: project.doctors.join ? project.doctors.join(", ") : project.doctors,
      bill: project.bill,
      completion: project.completion,
    });
    setDialogOpen(true);
  };
  const handleClose = () => setDialogOpen(false);
  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = () => {
    const project = {
      hospital: form.hospital,
      doctors: form.doctors.split(",").map(d => d.trim()),
      bill: form.bill,
      completion: Number(form.completion),
    };
    if (editId) updateProject(editId, project);
    else addProject(project);
    setDialogOpen(false);
  };
  const handleDelete = (id) => removeProject(id);
  const handleMenuOpen = (event, id) => {
    setMenuAnchor(event.currentTarget);
    setMenuProjectId(id);
  };
  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuProjectId(null);
  };
  const handleMenuEdit = () => {
    const project = projects.find(p => p.id === menuProjectId);
    handleOpenEdit(project);
    handleMenuClose();
  };
  const handleMenuDelete = () => {
    handleDelete(menuProjectId);
    handleMenuClose();
  };

  // Unified TextField styles (no inner blue bubble). Match Account Settings inputs.
  const fieldSx = {
    width: '100%',
    ml: 0,
    background: '#181a2f',
    borderRadius: 1.5,
    '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #23244a' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#2f3570' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#6a6afc' },
    '& .MuiInputBase-input': { color: '#e7e9f3', fontSize: 14, py: 1, background: 'transparent' },
  };

  // Open dialog for new appointment
  const handleOpenApptAdd = () => {
    setEditApptIdx(null);
    setApptForm({ name: "", email: "", type: "", hospital: "", status: "Active", progress: "In Progress", date: "" });
    setApptDialogOpen(true);
  };
  // Open dialog for edit
  const handleOpenApptEdit = (appt, idx) => {
    setEditApptIdx(idx);
    setApptForm({
      name: appt.doctor?.name || appt.title || "",
      email: appt.doctor?.email || appt.email || "",
      type: appt.doctor?.type || appt.type || "",
      hospital: appt.doctor?.hospital || appt.hospital || "",
      status: appt.doctor?.status || appt.status || "Active",
      progress: appt.doctor?.progress || appt.progress || "In Progress",
      date: appt.start ? new Date(appt.start).toISOString().slice(0,10) : ""
    });
    setApptDialogOpen(true);
  };
  // Save appointment (add or edit)
  const handleApptSave = () => {
    const newAppt = {
      title: apptForm.name,
      email: apptForm.email,
      type: apptForm.type,
      hospital: apptForm.hospital,
      status: apptForm.status, // keep status
      progress: apptForm.status, // set progress to match status
      start: apptForm.date ? new Date(apptForm.date) : new Date(),
      doctor: {
        name: apptForm.name,
        email: apptForm.email,
        type: apptForm.type,
        hospital: apptForm.hospital,
        status: apptForm.status,
        progress: apptForm.status // set progress to match status
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
  // Map appointments to doctor rows
  const apptRows = appointments.map((appt, idx) => {
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
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleOpenApptAdd} 
                sx={{ ml: 2, background: 'rgba(44, 50, 90, 0.65)', boxShadow: 'none', '&:hover': { background: 'rgba(44, 50, 90, 0.85)' } }}
              >
                Add Appointment
              </Button>
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
            <Box>
              <Button 
                variant="contained" 
                color="info" 
                onClick={() => setHubProvDialogOpen(true)}
                sx={{ mr: 1.5, background: 'rgba(44, 50, 90, 0.65)', boxShadow: 'none', '&:hover': { background: 'rgba(44, 50, 90, 0.85)' } }}
              >
                Search Providers
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleOpenAdd} 
                sx={{ background: 'rgba(44, 50, 90, 0.65)', boxShadow: 'none', '&:hover': { background: 'rgba(44, 50, 90, 0.85)' } }}
              >
                Add Info
              </Button>
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
  <Dialog open={dialogOpen} onClose={handleClose} maxWidth="xs" fullWidth
        PaperProps={{
          sx: {
    background: 'rgba(34, 40, 74, 0.65)',
    boxShadow: 24,
    borderRadius: 4,
    color: 'white',
    backdropFilter: 'blur(10px)',
    p: 4,
    minWidth: 400,
    maxWidth: 600,
          }
        }}
      >
    <DialogTitle sx={{ color: 'white', fontWeight: 700, fontSize: 22, pb: 2, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {editId ? "Edit" : "Add info"}
        </DialogTitle>
    <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 1, background: 'transparent', color: 'white', px: 2, minWidth: 400 }}>
          <VuiBox display="flex" flexDirection="column" gap={1}>
            <TextField label="Hospital" name="hospital" value={form.hospital} onChange={handleChange} fullWidth 
              InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }}
              sx={{ ...fieldSx, mt: 2, mb: 0.5, minHeight: 48 }}
            />
            <TextField label="Doctors (comma separated)" name="doctors" value={form.doctors} onChange={handleChange} fullWidth 
              InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }}
              sx={{ ...fieldSx, mb: 0.5 }}
            />
            <TextField label="Bill" name="bill" value={form.bill} onChange={handleChange} fullWidth 
              InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }}
              sx={{ ...fieldSx, mb: 0.5 }}
            />
            <TextField label="Status" name="status" value={form.status || ""} onChange={handleChange} fullWidth 
              InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }}
              sx={{ ...fieldSx, mb: 0.5 }}
            />
            <TextField label="Completion (%)" name="completion" type="number" value={form.completion} onChange={handleChange} fullWidth 
              InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }}
              sx={{ ...fieldSx, mb: 0.5 }}
            />
          </VuiBox>
        </DialogContent>
        <DialogActions sx={{ background: 'transparent', px: 2, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            {editId && (
              <Button onClick={() => handleDelete(editId)} color="error" variant="outlined" sx={{ borderColor: '#e57373', color: '#e57373', fontWeight: 600, fontSize: 14, px: 2, py: 0.5, minWidth: 0 }}>
                Delete
              </Button>
            )}
          </Box>
          <Box>
            <Button onClick={handleClose} sx={{ color: '#bfc6e0', mr: 1 }}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="info" sx={{ borderRadius: 2, px: 3, fontWeight: 600 }}>{editId ? "Save" : "Add"}</Button>
          </Box>
        </DialogActions>
      </Dialog>
      <Dialog 
        open={apptDialogOpen} 
        onClose={() => setApptDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(34, 40, 74, 0.65)', // even more transparent
            boxShadow: 24,
            borderRadius: 4,
            color: 'white',
            backdropFilter: 'blur(10px)',
            p: 4,
            minWidth: 400,
            maxWidth: 600,
          }
        }}
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
            <TextField label="Doctor Name" name="name" value={apptForm.name} onChange={e => setApptForm(f => ({ ...f, name: e.target.value }))} fullWidth 
              InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }}
              sx={{ ...fieldSx, mt: 2, mb: 0.5, minHeight: 48 }}
            />
            <TextField label="Email" name="email" value={apptForm.email} onChange={e => setApptForm(f => ({ ...f, email: e.target.value }))} fullWidth 
              InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }}
              sx={{ ...fieldSx, mb: 0.5 }}
            />
            <TextField label="Type" name="type" value={apptForm.type} onChange={e => setApptForm(f => ({ ...f, type: e.target.value }))} fullWidth 
              InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }}
              sx={{ ...fieldSx, mb: 0.5 }}
            />
            <TextField label="Hospital" name="hospital" value={apptForm.hospital} onChange={e => setApptForm(f => ({ ...f, hospital: e.target.value }))} fullWidth 
              InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }}
              sx={{ ...fieldSx, mb: 0.5 }}
            />
            <TextField label="Status" name="status" value={apptForm.status} onChange={e => setApptForm(f => ({ ...f, status: e.target.value }))} select fullWidth
              InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }}
              sx={{ ...fieldSx, mb: 0.5, color: 'white', '& .MuiSelect-select': { color: '#e7e9f3', py: 1, background: 'transparent' } }}
            >
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Coming Soon">Coming Soon</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </TextField>
            <TextField label="Date" name="date" type="date" value={apptForm.date} onChange={e => setApptForm(f => ({ ...f, date: e.target.value }))} fullWidth 
              InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }}
              sx={{ ...fieldSx, mb: 0.5 }}
            />
          </VuiBox>
        </DialogContent>
        <DialogActions sx={{ background: 'transparent', px: 2, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editApptIdx !== null ? (
            <Button 
              color="error" 
              variant="outlined" 
              onClick={() => {
                // Remove the appointment at editApptIdx
                const updated = appointments.filter((_, idx) => idx !== editApptIdx);
                // You may need to update context directly or expose a removeAppointment function
                if (typeof window !== 'undefined' && window.dispatchEvent) {
                  window.location.reload();
                }
              }}
              sx={{ borderColor: '#e57373', color: '#e57373', fontWeight: 600, fontSize: 14, px: 2, py: 0.5, minWidth: 0 }}
            >
              Delete
            </Button>
          ) : <span />}
          <Box>
            <Button onClick={() => setApptDialogOpen(false)} sx={{ color: '#bfc6e0', mr: 1 }}>Cancel</Button>
            <Button onClick={handleApptSave} variant="contained" color="info" sx={{ borderRadius: 2, px: 3, fontWeight: 600 }}>{editApptIdx !== null ? "Save" : "Add"}</Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Provider Search Dialog for HUB */}
      <Dialog
  open={!!hubProvDialogOpen}
  onClose={() => setHubProvDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(34, 40, 74, 0.65)',
            boxShadow: 24,
            borderRadius: 4,
            color: 'white',
            backdropFilter: 'blur(10px)'
          }
        }}
     >
        <DialogTitle sx={{ color: 'white', fontWeight: 700, fontSize: 22, pb: 1.5 }}>Search Provider</DialogTitle>
        <DialogContent sx={{ px: 2, pt: 1, pb: 2 }}>
          <Grid container spacing={1.5} alignItems="center">
            <Grid item xs={12} sm={6} md={6}>
              <TextField size="small" label="Doctor or Specialty" value={provQuery} onChange={e=>setProvQuery(e.target.value)} fullWidth 
                InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }}
                InputProps={{ startAdornment: (<Box component="span" sx={{ color: '#aeb3d5', mr: 1 }}><SearchIcon fontSize="small" /></Box>) }}
                sx={fieldSx}
              />
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <TextField size="small" label="City" value={provCity} onChange={e=>setProvCity(e.target.value)} fullWidth InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }} sx={fieldSx} />
            </Grid>
            <Grid item xs={3} sm={2} md={1.5}>
              <TextField size="small" label="State" value={provState} onChange={e=>setProvState(e.target.value)} fullWidth InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }} sx={fieldSx} />
            </Grid>
            <Grid item xs={3} sm={2} md={1.5}>
              <TextField size="small" label="ZIP" value={provZip} onChange={e=>setProvZip(e.target.value)} fullWidth InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }} sx={fieldSx} />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Button variant="contained" color="info" onClick={runProviderSearch} disabled={provLoading} sx={{ borderRadius: 2, fontWeight: 600 }}>
                {provLoading ? 'Searching…' : 'Search'}
              </Button>
            </Grid>
          </Grid>
          {provResults?.length > 0 && (
            <Box sx={{ mt: 2, maxHeight: 260, overflowY: 'auto' }}>
              {provResults.slice(0,20).map((p) => (
                <Box key={p.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.75 }}>
                  <Box>
                    <VuiTypography variant="button" color="white" fontWeight="medium">{p.name}</VuiTypography>
                    <VuiTypography variant="caption" color="text"> {p.specialty || p.taxonomy || ''} • {(p.city && p.state) ? `${p.city}, ${p.state}` : p.location || ''}</VuiTypography>
                  </Box>
                  <Button size="small" color="info" variant="outlined" onClick={async ()=>{ await addProvider(p); }} sx={{ borderRadius: 2 }}>Save</Button>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button onClick={() => setHubProvDialogOpen(false)} sx={{ color: '#bfc6e0' }}>Close</Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default Tables;
