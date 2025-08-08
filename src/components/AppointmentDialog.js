import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Tabs,
  Tab,
  MenuItem,
  Box,
  Select,
  InputLabel,
  FormControl,
  Typography
} from "@mui/material";

const doctors = ["Dr. Smith", "Dr. Johnson", "Dr. Lee"];
const reasons = ["Consultation", "Follow-up", "Prescription", "Other"];

export default function AppointmentDialog({ open, onClose, onSubmit }) {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({
    title: "",
    date: "",
    from: "",
    to: "",
    doctor: "",
    location: "",
    reason: "",
    details: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTab = (_, v) => setTab(v);

  const handleSubmit = () => {
    onSubmit(form);
    setForm({
      title: "",
      date: "",
      from: "",
      to: "",
      doctor: "",
      location: "",
      reason: "",
      details: ""
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { bgcolor: "#12002b", color: "#fff", borderRadius: 2, border: "1px solid #A58AFF" } }}>
      <DialogTitle sx={{ color: "#A58AFF", fontWeight: 700, fontSize: 20, borderBottom: "1px solid #2d004d", bgcolor: "#1a0033" }}>Edit Event</DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Tabs value={tab} onChange={handleTab} sx={{ mb: 2 }}>
          <Tab label="Event" sx={{ color: tab === 0 ? "#A58AFF" : "#fff", fontWeight: 600 }} />
          <Tab label="My To Do" sx={{ color: tab === 1 ? "#A58AFF" : "#fff", fontWeight: 600 }} />
        </Tabs>
        {tab === 0 ? (
          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField label="Title" name="title" value={form.title} onChange={handleChange} fullWidth variant="standard" margin="normal" InputLabelProps={{ shrink: true, style: { color: "#A58AFF" } }} sx={{ input: { bgcolor: "#2d004d", color: "#fff" }, label: { color: "#A58AFF" } }} />
            <TextField label="Date" name="date" type="date" value={form.date} onChange={handleChange} fullWidth variant="standard" margin="normal" InputLabelProps={{ shrink: true, style: { color: "#A58AFF" } }} sx={{ input: { bgcolor: "#2d004d", color: "#fff" }, label: { color: "#A58AFF" } }} />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField label="From" name="from" type="time" value={form.from} onChange={handleChange} variant="standard" margin="normal" InputLabelProps={{ shrink: true, style: { color: "#A58AFF" } }} sx={{ flex: 1, input: { bgcolor: "#2d004d", color: "#fff" }, label: { color: "#A58AFF" } }} />
              <TextField label="To" name="to" type="time" value={form.to} onChange={handleChange} variant="standard" margin="normal" InputLabelProps={{ shrink: true, style: { color: "#A58AFF" } }} sx={{ flex: 1, input: { bgcolor: "#2d004d", color: "#fff" }, label: { color: "#A58AFF" } }} />
            </Box>
            <FormControl variant="standard" fullWidth margin="normal">
              <InputLabel shrink sx={{ color: "#A58AFF" }}>Doctor</InputLabel>
              <Select
                name="doctor"
                value={form.doctor}
                onChange={handleChange}
                displayEmpty
                sx={{ bgcolor: "#2d004d", color: "#fff" }}
                inputProps={{ 'aria-label': 'Doctor' }}
              >
                <MenuItem value=""><em>Select Doctor</em></MenuItem>
                {doctors.map((d) => (
                  <MenuItem value={d} key={d}>{d}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField label="Location" name="location" value={form.location} onChange={handleChange} fullWidth variant="standard" margin="normal" InputLabelProps={{ shrink: true, style: { color: "#A58AFF" } }} sx={{ input: { bgcolor: "#2d004d", color: "#fff" }, label: { color: "#A58AFF" } }} />
            <FormControl variant="standard" fullWidth margin="normal">
              <InputLabel shrink sx={{ color: "#A58AFF" }}>Reason</InputLabel>
              <Select
                name="reason"
                value={form.reason}
                onChange={handleChange}
                displayEmpty
                sx={{ bgcolor: "#2d004d", color: "#fff" }}
                inputProps={{ 'aria-label': 'Reason' }}
              >
                <MenuItem value=""><em>Select Reason</em></MenuItem>
                {reasons.map((r) => (
                  <MenuItem value={r} key={r}>{r}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        ) : (
          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField label="Title" name="title" value={form.title} onChange={handleChange} fullWidth variant="standard" margin="normal" InputLabelProps={{ shrink: true, style: { color: "#A58AFF" } }} sx={{ input: { bgcolor: "#2d004d", color: "#fff" }, label: { color: "#A58AFF" } }} />
            <TextField label="Date" name="date" type="date" value={form.date} onChange={handleChange} fullWidth variant="standard" margin="normal" InputLabelProps={{ shrink: true, style: { color: "#A58AFF" } }} sx={{ input: { bgcolor: "#2d004d", color: "#fff" }, label: { color: "#A58AFF" } }} />
            <TextField label="Time" name="from" type="time" value={form.from} onChange={handleChange} fullWidth variant="standard" margin="normal" InputLabelProps={{ shrink: true, style: { color: "#A58AFF" } }} sx={{ input: { bgcolor: "#2d004d", color: "#fff" }, label: { color: "#A58AFF" } }} />
            <FormControl variant="standard" fullWidth margin="normal">
              <InputLabel shrink sx={{ color: "#A58AFF" }}>Doctor</InputLabel>
              <Select
                name="doctor"
                value={form.doctor}
                onChange={handleChange}
                displayEmpty
                sx={{ bgcolor: "#2d004d", color: "#fff" }}
                inputProps={{ 'aria-label': 'Doctor' }}
              >
                <MenuItem value=""><em>Select Doctor</em></MenuItem>
                {doctors.map((d) => (
                  <MenuItem value={d} key={d}>{d}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField label="Details" name="details" value={form.details} onChange={handleChange} fullWidth multiline minRows={3} variant="standard" margin="normal" InputLabelProps={{ shrink: true, style: { color: "#A58AFF" } }} sx={{ input: { bgcolor: "#2d004d", color: "#fff" }, label: { color: "#A58AFF" } }} />
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ bgcolor: "#1a0033", borderTop: "1px solid #2d004d" }}>
        <Button onClick={onClose} sx={{ color: "#fff", borderColor: "#A58AFF" }}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" sx={{ bgcolor: "#A58AFF", color: "#fff", '&:hover': { bgcolor: "#7c4dff" } }}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}
