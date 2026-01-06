import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Box,
  Autocomplete,
  InputAdornment,
  IconButton,
  Grow,
} from "@mui/material";
import { LineLabelTextField } from 'layouts/profile';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useAppointments } from "../context/AppointmentContext";
import MiniDayCalendar from 'components/MiniDayCalendar';

// Smooth open/close animation for the dialog (fade + subtle scale)
const Transition = React.forwardRef(function Transition(props, ref) {
  return (
    <Grow
      ref={ref}
      {...props}
      style={{ transformOrigin: 'center top', ...props.style }}
      timeout={{ appear: 320, enter: 320, exit: 180 }}
    />
  );
});

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
  const [showCalendar, setShowCalendar] = useState(false);
  // Refs for invoking native pickers programmatically
  const dateRef = useRef(null);
  const fromRef = useRef(null);
  const toRef = useRef(null);

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
    // Ensure a non-empty title so the event is visible in the calendar
    const safeTitle = (form.title && form.title.trim()) || (form.doctor ? `Visit with ${form.doctor}` : (form.reason ? form.reason : 'Appointment'));
    onSubmit({ ...form, title: safeTitle, providerId });
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

  // Glassy paper style aligned with Caring Hub appointment popup
  const paperSx = {
    background: 'linear-gradient(135deg, rgba(26,30,58,0.92) 0%, rgba(20,22,40,0.94) 100%)',
    backdropFilter: 'blur(14px) saturate(100%)',
    WebkitBackdropFilter: 'blur(14px) saturate(100%)',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 8px 28px -6px rgba(0,0,0,0.55), 0 2px 6px rgba(0,0,0,0.3)',
    borderRadius: 3,
    color: 'white',
    p: 3,
    overflow: 'hidden',
    minWidth: 440,
    maxWidth: 720,
  };

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
    '& .MuiInputBase-input': { color: '#e7e9f3', fontSize: 14, py: 1.35, background: 'transparent' },
    '& .MuiSelect-select': { background: 'transparent' },
    '& .MuiInputLabel-root': {
      color: '#6b7199',
      '&.Mui-focused': { color: '#6b7199' },
    },
    minHeight: 54,
    '& input[type="date"]::-webkit-calendar-picker-indicator': { display: 'none' },
    '& input[type="time"]::-webkit-calendar-picker-indicator': { display: 'none' },
  };

  const formatDate = (d) => {
    if (!d) return '';
    const dt = d instanceof Date ? d : new Date(d);
    const y = dt.getFullYear();
    const m = String(dt.getMonth()+1).padStart(2,'0');
    const day = String(dt.getDate()).padStart(2,'0');
    return `${y}-${m}-${day}`;
  };

  const { selectedDate: globalSelectedDate, setSelectedDate } = useAppointments();

  useEffect(() => {
    if (showCalendar && globalSelectedDate) {
      setForm(f => ({ ...f, date: formatDate(globalSelectedDate) }));
      setShowCalendar(false);
    }
  }, [globalSelectedDate]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: paperSx }}
      TransitionComponent={Transition}
      keepMounted
    >
      <DialogTitle sx={{ px: 3, py: 2.5, m: 0, typography: 'h6', fontWeight: 700 }}>Edit Event</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, px: 3, pt: 0.5, pb: 1.5 }}>
        <Tabs
          value={tab}
          onChange={handleTab}
          sx={{ mb: 2, background: 'rgba(255,255,255,0.02)', borderRadius: 3, p: 0.5 }}
          TabIndicatorProps={{ sx: { display: 'none' } }}
        >
          <Tab label="Event" sx={{ color: '#e7e9f3', fontWeight: 700, textTransform: 'none', minWidth: 120 }} />
          <Tab label="My To Do" sx={{ color: '#bfc6e0', fontWeight: 600, textTransform: 'none', minWidth: 120 }} />
        </Tabs>
        {tab === 0 ? (
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxWidth: 560, mx: 'auto', width: '100%' }}>
            <LineLabelTextField label="Title" name="title" value={form.title} onChange={handleChange} fullWidth placeholder="Optional – we'll infer one" sx={{ ...fieldSx, mt: 2, mb: 0.5 }} />
            <LineLabelTextField
              label="Date"
              name="date"
              type="date"
              value={form.date}
              inputRef={dateRef}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ mr: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => { setShowCalendar(true); if (form.date) try { setSelectedDate(new Date(form.date)); } catch(_) {} }}
                      tabIndex={-1}
                      sx={{ color: '#9ea6c4', '&:hover': { color: '#c2cae6' } }}
                    >
                      <CalendarTodayIcon fontSize="inherit" />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ ...fieldSx, mb: 0.5, cursor: 'pointer' }}
              onClick={() => { setShowCalendar(true); if (form.date) try { setSelectedDate(new Date(form.date)); } catch(_) {} }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <LineLabelTextField
                label="From"
                name="from"
                type="time"
                value={form.from}
                inputRef={fromRef}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" sx={{ mr: 0.25 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); if (fromRef.current) { if (fromRef.current.showPicker) fromRef.current.showPicker(); else fromRef.current.focus(); } }}
                        tabIndex={-1}
                        sx={{ color: '#9ea6c4', '&:hover': { color: '#c2cae6' } }}
                      >
                        <AccessTimeIcon fontSize="inherit" />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{ ...fieldSx, flex: 1, cursor: 'pointer' }}
                onClick={() => { if (fromRef.current) { if (fromRef.current.showPicker) fromRef.current.showPicker(); else fromRef.current.focus(); } }}
              />
              <LineLabelTextField
                label="To"
                name="to"
                type="time"
                value={form.to}
                inputRef={toRef}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" sx={{ mr: 0.25 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); if (toRef.current) { if (toRef.current.showPicker) toRef.current.showPicker(); else toRef.current.focus(); } }}
                        tabIndex={-1}
                        sx={{ color: '#9ea6c4', '&:hover': { color: '#c2cae6' } }}
                      >
                        <AccessTimeIcon fontSize="inherit" />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{ ...fieldSx, flex: 1, cursor: 'pointer' }}
                onClick={() => { if (toRef.current) { if (toRef.current.showPicker) toRef.current.showPicker(); else toRef.current.focus(); } }}
              />
            </Box>
            <Autocomplete
              size="small"
              options={(providers?.length ? providers.map(p => p.name) : doctorsFallback)}
              value={form.doctor ? form.doctor : null}
              onChange={(_, val) => setForm(f => ({ ...f, doctor: val || '' }))}
              autoHighlight
              clearOnEscape
              disableClearable
              renderInput={(params) => (
                <LineLabelTextField
                  {...params}
                  label="Doctor"
                  placeholder="Select Doctor"
                  InputLabelProps={{ shrink: true }}
                  sx={{ ...fieldSx, mb: 0.5, '& .MuiOutlinedInput-input': { py: 1 } }}
                />
              )}
              sx={{ mb: 0.5, '& .MuiOutlinedInput-root': { p: 0.25, pr: 1 } }}
              ListboxProps={{ style: { maxHeight: 240 } }}
            />
            {!!slots.length && (
              <Box sx={{ fontSize: 12, color: '#bfc6e0', mb: 0.5 }}>
                Suggested: {slots.slice(0,4).map(s => new Date(s.start).toLocaleString()).join('  •  ')}
              </Box>
            )}
            <LineLabelTextField label="Location" name="location" value={form.location} onChange={handleChange} fullWidth sx={{ ...fieldSx, mb: 0.5 }} />
            <Autocomplete
              size="small"
              options={reasons}
              value={form.reason ? form.reason : null}
              onChange={(_, val) => setForm(f => ({ ...f, reason: val || '' }))}
              autoHighlight
              clearOnEscape
              disableClearable
              renderInput={(params) => (
                <LineLabelTextField
                  {...params}
                  label="Reason"
                  placeholder="Select Reason"
                  InputLabelProps={{ shrink: true }}
                  sx={{ ...fieldSx, mb: 0.5, '& .MuiOutlinedInput-input': { py: 1 } }}
                />
              )}
              sx={{ mb: 0.5, '& .MuiOutlinedInput-root': { p: 0.25, pr: 1 } }}
              ListboxProps={{ style: { maxHeight: 240 } }}
            />
          </Box>
        ) : (
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxWidth: 560, mx: 'auto', width: '100%' }}>
            <LineLabelTextField label="Title" name="title" value={form.title} onChange={handleChange} fullWidth placeholder="Optional – we'll infer one" sx={{ ...fieldSx, mt: 2, mb: 0.5 }} />
            <LineLabelTextField
              label="Date"
              name="date"
              type="date"
              value={form.date}
              inputRef={dateRef}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ mr: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => { 
                        if (dateRef.current) { 
                          try {
                            if (dateRef.current.showPicker) {
                              dateRef.current.showPicker();
                            } else {
                              dateRef.current.focus();
                            }
                          } catch (error) {
                            // Fallback to focus if showPicker fails (e.g., no user gesture)
                            dateRef.current.focus();
                          }
                        } 
                      }}
                      tabIndex={-1}
                      sx={{ color: '#9ea6c4', '&:hover': { color: '#c2cae6' } }}
                    >
                      <CalendarTodayIcon fontSize="inherit" />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ ...fieldSx, mb: 0.5, cursor: 'pointer' }}
              onClick={() => { 
                if (dateRef.current) { 
                  try {
                    if (dateRef.current.showPicker) {
                      dateRef.current.showPicker();
                    } else {
                      dateRef.current.focus();
                    }
                  } catch (error) {
                    // Fallback to focus if showPicker fails (e.g., no user gesture)
                    dateRef.current.focus();
                  }
                } 
              }}
            />
            <LineLabelTextField
              label="Time"
              name="from"
              type="time"
              value={form.from}
              inputRef={fromRef}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ mr: 0.25 }}>
                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); if (fromRef.current) { if (fromRef.current.showPicker) fromRef.current.showPicker(); else fromRef.current.focus(); } }}
                      tabIndex={-1}
                      sx={{ color: '#9ea6c4', '&:hover': { color: '#c2cae6' } }}
                    >
                      <AccessTimeIcon fontSize="inherit" />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ ...fieldSx, mb: 0.5, cursor: 'pointer' }}
              onClick={() => { if (fromRef.current) { if (fromRef.current.showPicker) fromRef.current.showPicker(); else fromRef.current.focus(); } }}
            />
            {/* Calendar dialog to match Appointments/HUB style */}
            <Dialog
              open={showCalendar}
              onClose={() => setShowCalendar(false)}
              maxWidth="sm"
              fullWidth
              TransitionComponent={Transition}
              keepMounted
              PaperProps={{ sx: {
                background: 'linear-gradient(145deg, rgba(24,26,48,0.92) 0%, rgba(22,24,45,0.94) 70%)',
                boxShadow: '0 8px 28px -4px rgba(0,0,0,0.55), 0 4px 12px -2px rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 5,
                color: 'white',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                p: 3,
                minWidth: 520
              } }}
            >
              <DialogTitle sx={{ color: 'white', fontWeight: 700, fontSize: 20, pb: 1.5 }}>Pick a date</DialogTitle>
              <DialogContent sx={{ p: 0, px: 2, pt: 1 }}>
                <Box sx={{ width: '100%', p: 1 }}>
                  <MiniDayCalendar />
                </Box>
              </DialogContent>
              <DialogActions sx={{ px: 2, pb: 2 }}>
                <Button onClick={() => setShowCalendar(false)} sx={{ textTransform: 'none', color: '#bfc6e0' }}>Cancel</Button>
                <Button onClick={() => { if (globalSelectedDate) setForm(f => ({ ...f, date: formatDate(globalSelectedDate) })); setShowCalendar(false); }} variant="contained" color="info">Select</Button>
              </DialogActions>
            </Dialog>
            <Autocomplete
              size="small"
              options={(providers?.length ? providers.map(p => p.name) : doctorsFallback)}
              value={form.doctor ? form.doctor : null}
              onChange={(_, val) => setForm(f => ({ ...f, doctor: val || '' }))}
              autoHighlight
              clearOnEscape
              disableClearable
              renderInput={(params) => (
                <LineLabelTextField
                  {...params}
                  label="Doctor"
                  placeholder="Select Doctor"
                  InputLabelProps={{ shrink: true }}
                  sx={{ ...fieldSx, mb: 0.5, '& .MuiOutlinedInput-input': { py: 1 } }}
                />
              )}
              sx={{ mb: 0.5, '& .MuiOutlinedInput-root': { p: 0.25, pr: 1 } }}
              ListboxProps={{ style: { maxHeight: 240 } }}
            />
            <LineLabelTextField label="Details" name="details" value={form.details} onChange={handleChange} fullWidth multiline minRows={3} sx={{ ...fieldSx, mb: 0.5, '& .MuiInputBase-input': { py: 1.1 } }} />
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 1.75, borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'flex-end' }}>
        <Box sx={{ flex: 1 }} />
        <Box>
          <Button onClick={onClose} sx={{ color: '#bfc6e0', mr: 1, textTransform: 'none', fontWeight: 500 }}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="info" sx={{ borderRadius: 2.5, px: 3.5, fontWeight: 600, boxShadow: '0 4px 14px -2px rgba(76,119,255,0.45)', background: 'rgba(44, 50, 90, 0.85)' }}>Submit</Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
