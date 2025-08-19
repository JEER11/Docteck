import React, { useState, useEffect } from "react";
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
} from "@mui/material";

import { useAppointments } from "../context/AppointmentContext";
const doctorsFallback = ["Dr. Smith", "Dr. Johnson", "Dr. Lee"];
const reasons = ["Consultation", "Follow-up", "Prescription", "Other"];

export default function AppointmentDialog({ open, onClose, onSubmit }) {
  const { providers, suggestSlots } = useAppointments() || { providers: [], suggestSlots: async () => [] };
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
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    // Suggest slots when doctor and date are set
    (async () => {
      const prov = (providers || []).find(p => p.name === form.doctor);
      if (prov && form.date) {
        const s = await suggestSlots(prov.id, form.date);
        setSlots(s);
      } else {
        setSlots([]);
      }
    })();
  }, [form.doctor, form.date, providers, suggestSlots]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTab = (_, v) => setTab(v);

  const handleSubmit = () => {
    const providerId = (providers || []).find(p => p.name === form.doctor)?.id || null;
    onSubmit({ ...form, providerId });
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

  // Match Caring Hub Appointments dialog UI
  const paperSx = {
    background: 'rgba(34, 40, 74, 0.65)',
    boxShadow: 24,
    borderRadius: 4,
    color: 'white',
    backdropFilter: 'blur(10px)',
    p: 4,
    minWidth: 400,
    maxWidth: 600,
  };

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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: paperSx }}>
      <DialogTitle sx={{ color: 'white', fontWeight: 700, fontSize: 22, pb: 2, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>Edit Event</DialogTitle>
      <DialogContent sx={{ p: 0, px: 2, pt: 1, pb: 2 }}>
        <Tabs value={tab} onChange={handleTab} sx={{ mb: 2 }}>
          <Tab label="Event" sx={{ color: 'white', fontWeight: 600 }} />
          <Tab label="My To Do" sx={{ color: 'white', fontWeight: 600 }} />
        </Tabs>
        {tab === 0 ? (
          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <TextField label="Title" name="title" value={form.title} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }} sx={{ ...fieldSx, mt: 2, mb: 0.5, minHeight: 48 }} />
            <TextField label="Date" name="date" type="date" value={form.date} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }} sx={{ ...fieldSx, mb: 0.5 }} />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField label="From" name="from" type="time" value={form.from} onChange={handleChange} InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }} sx={{ ...fieldSx, flex: 1 }} />
              <TextField label="To" name="to" type="time" value={form.to} onChange={handleChange} InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }} sx={{ ...fieldSx, flex: 1 }} />
            </Box>
            <TextField label="Doctor" name="doctor" value={form.doctor} onChange={handleChange} select fullWidth InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }} sx={{ ...fieldSx, mb: 0.5, color: 'white', '& .MuiSelect-select': { color: '#e7e9f3', py: 1, background: 'transparent' } }}>
              <MenuItem value=""><em>Select Doctor</em></MenuItem>
              {(providers?.length ? providers.map(p => p.name) : doctorsFallback).map((d) => (
                <MenuItem value={d} key={d}>{d}</MenuItem>
              ))}
            </TextField>
            {!!slots.length && (
              <Box sx={{ fontSize: 12, color: '#bfc6e0', mb: 0.5 }}>
                Suggested: {slots.slice(0,4).map(s => new Date(s.start).toLocaleString()).join('  •  ')}
              </Box>
            )}
            <TextField label="Location" name="location" value={form.location} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }} sx={{ ...fieldSx, mb: 0.5 }} />
            <TextField label="Reason" name="reason" value={form.reason} onChange={handleChange} select fullWidth InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }} sx={{ ...fieldSx, mb: 0.5, color: 'white', '& .MuiSelect-select': { color: '#e7e9f3', py: 1, background: 'transparent' } }}>
              <MenuItem value=""><em>Select Reason</em></MenuItem>
              {reasons.map((r) => (
                <MenuItem value={r} key={r}>{r}</MenuItem>
              ))}
            </TextField>
          </Box>
        ) : (
          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <TextField label="Title" name="title" value={form.title} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }} sx={{ ...fieldSx, mt: 2, mb: 0.5, minHeight: 48 }} />
            <TextField label="Date" name="date" type="date" value={form.date} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }} sx={{ ...fieldSx, mb: 0.5 }} />
            <TextField label="Time" name="from" type="time" value={form.from} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }} sx={{ ...fieldSx, mb: 0.5 }} />
            <TextField label="Doctor" name="doctor" value={form.doctor} onChange={handleChange} select fullWidth InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }} sx={{ ...fieldSx, mb: 0.5, color: 'white', '& .MuiSelect-select': { color: '#e7e9f3', py: 1, background: 'transparent' } }}>
              <MenuItem value=""><em>Select Doctor</em></MenuItem>
              {(providers?.length ? providers.map(p => p.name) : doctorsFallback).map((d) => (
                <MenuItem value={d} key={d}>{d}</MenuItem>
              ))}
            </TextField>
            <TextField label="Details" name="details" value={form.details} onChange={handleChange} fullWidth multiline minRows={3} InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }} sx={{ ...fieldSx, mb: 0.5 }} />
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ background: 'transparent', px: 2, pb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={onClose} sx={{ color: '#bfc6e0', mr: 1 }}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="info" sx={{ borderRadius: 2, px: 3, fontWeight: 600 }}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}
