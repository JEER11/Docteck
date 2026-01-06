import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Autocomplete, InputAdornment, IconButton, Grow, Tooltip, Fade
} from '@mui/material';
import { LineLabelTextField } from 'layouts/profile';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MiniDayCalendar from 'components/MiniDayCalendar';
import { useAppointments } from 'context/AppointmentContext';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotesIcon from '@mui/icons-material/Notes';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CategoryIcon from '@mui/icons-material/Category';

// Smooth open/close animation (consistent with other dialogs)
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow ref={ref} {...props} style={{ transformOrigin: 'center top', ...props.style }} timeout={{ appear: 300, enter: 300, exit: 180 }} />;
});

// Basic category suggestions (can be expanded later / localized)
const TYPE_OPTIONS = [
  'Note', 'Task', 'Reminder', 'Medicine', 'Appointment', 'Follow-up'
];

export default function AddTodoDialog({ open, onClose, onAdd }) {
  const [type, setType] = useState('Note');
  const [label, setLabel] = useState(''); // short label / title
  const [desc, setDesc] = useState(''); // optional details
  const [date, setDate] = useState(''); // yyyy-mm-dd
  const [time, setTime] = useState(''); // HH:MM
  const [showTime, setShowTime] = useState(false);

  const dateRef = useRef(null);
  const timeRef = useRef(null);
  const [showCalendar, setShowCalendar] = useState(false);

  // Use global appointment calendar selection to pick a date in the popup
  const { selectedDate: globalSelectedDate, setSelectedDate } = useAppointments();

  const reset = () => { setType('Note'); setLabel(''); setDesc(''); setDate(''); setTime(''); setShowTime(false); };

  // Robust helper to open the native time picker even if the input is currently readonly.
  const openTimePicker = () => {
    const el = timeRef.current;
    if (!el) return;
    try {
      const wasReadOnly = !!el.readOnly;
      if (wasReadOnly) el.readOnly = false;
      if (typeof el.showPicker === 'function') {
        el.showPicker();
      } else {
        el.focus();
        try { el.click(); } catch (_) { /* ignore */ }
      }
      if (wasReadOnly) setTimeout(() => { try { el.readOnly = true; } catch (_) {} }, 50);
    } catch (err) {
      try { el.focus(); } catch (_) {}
    }
  };

  // Keyboard shortcut: Ctrl/Cmd + Enter to submit while dialog open
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, type, label, desc, date, time]);

  const handleSubmit = () => {
    if (!label.trim() && !desc.trim()) return; // require some content
    let dt;
    if (date) {
      dt = new Date(`${date}T${time || '00:00'}`);
    }
    const baseType = type ? type.toLowerCase() : 'note';
    const finalLabel = label.trim() || (desc.trim().length < 60 ? desc.trim() : desc.trim().slice(0,57) + '…');
    const payload = { type: baseType, label: finalLabel, date: dt };
    if (desc.trim()) payload.details = desc.trim();
    onAdd && onAdd(payload);
    reset();
    onClose();
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

  const formatDate = (d) => {
    if (!d) return '';
    const dt = d instanceof Date ? d : new Date(d);
    const y = dt.getFullYear();
    const m = String(dt.getMonth()+1).padStart(2,'0');
    const day = String(dt.getDate()).padStart(2,'0');
    return `${y}-${m}-${day}`;
  };

  // If user selects a date from the global MiniDayCalendar, update local date and close dialog
  useEffect(() => {
    if (showCalendar && globalSelectedDate) {
      setDate(formatDate(globalSelectedDate));
      setShowCalendar(false);
    }
  }, [globalSelectedDate]);

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
    transition: 'border-color .18s, box-shadow .18s, background .25s',
  };

  return (
    <Dialog
      open={open}
      onClose={() => { reset(); onClose(); }}
      fullWidth
      maxWidth="sm"
      TransitionComponent={Transition}
      keepMounted
      PaperProps={{ sx: { ...glassPaper, p: 3, minWidth: 440, maxWidth: 560, maxHeight: '72vh' } }}
    >
      <DialogTitle sx={{ px: 3, py: 2.5, m: 0, typography: 'h6', fontWeight: 700 }}>Add To Do</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.75, px: 3, pt: 0.5, pb: 1.5 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.35, maxWidth: 560, mx: 'auto', width: '100%' }}>
          <Autocomplete
            size="small"
            sx={{ mt: 2 }}
            popupIcon={<KeyboardArrowDownIcon sx={{ color: '#9ea6c4' }} />}
            options={TYPE_OPTIONS}
            value={type || null}
            onChange={(_, v) => setType(v || 'Note')}
            autoHighlight
            disableClearable
            renderInput={(params) => (
              <LineLabelTextField
                {...params}
                label="Type"
                placeholder="Select type"
                InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }}
                sx={{ ...fieldSx, mt: 0.5, '& .MuiOutlinedInput-root': { p: 0.2 }, '& .MuiOutlinedInput-input': { py: 1 } }}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start" sx={{ pl: 1, pr: 0.5, color: '#9ea6c4' }}>
                      <CategoryIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: params.InputProps.endAdornment
                }}
              />
            )}
            ListboxProps={{ style: { maxHeight: 240 } }}
          />
          <LineLabelTextField
            label="Title"
            value={label}
            onChange={e => setLabel(e.target.value)}
            fullWidth
            autoFocus
            placeholder="Refill prescription, Call Dr. Lee, Morning walk..."
            onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit(); }}
            sx={{ ...fieldSx }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ pl: 1, pr: 0.75, color: '#9ea6c4' }}>
                  <NotesIcon fontSize="small" />
                </InputAdornment>
              )
            }}
          />
          <LineLabelTextField
            label="Description (optional)"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            fullWidth
            multiline
            minRows={3}
            placeholder="Extra details, instructions, context..."
            sx={{ ...fieldSx, '& .MuiInputBase-input': { py: 1.1 } }}
          />
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <LineLabelTextField
              label="Date"
              type="date"
              value={date}
              inputRef={dateRef}
              inputProps={{ style: { WebkitAppearance: 'none', MozAppearance: 'textfield', appearance: 'none' } }}
              onChange={e => { setDate(e.target.value); if (!e.target.value) { setTime(''); setShowTime(false); } }}
              InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ mr: 0.5 }}>
                    <Tooltip title="Pick a date" TransitionComponent={Fade} placement="top" arrow>
                      <IconButton
                        size="small"
                        onClick={() => {
                          if (!dateRef.current || dateRef.current.readOnly || dateRef.current.disabled) return;
                          try {
                            if (dateRef.current.showPicker) {
                              dateRef.current.showPicker();
                            } else {
                              dateRef.current.focus();
                            }
                          } catch (err) {
                            // Some browsers require a direct user gesture for showPicker()
                            // or may throw for immutable controls — fall back to focusing input.
                            try { dateRef.current.focus(); } catch (_) {}
                          }
                        }}
                        tabIndex={-1}
                        sx={{ color: '#9ea6c4', '&:hover': { color: '#c2cae6' } }}
                      >
                        <CalendarTodayIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                )
              }}
              sx={{ ...fieldSx, flex: 1, cursor: 'pointer' }}
              onClick={(e) => { e.preventDefault(); setShowCalendar(true); }}
            />
              {showTime && (
              <LineLabelTextField
                label="Time"
                type="time"
                value={time}
                inputRef={timeRef}
                inputProps={{ style: { WebkitAppearance: 'none', MozAppearance: 'textfield', appearance: 'none' }, readOnly: !date }}
                onChange={e => setTime(e.target.value)}
                InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" sx={{ mr: 0.25 }}>
                      <Tooltip title="Pick a time" TransitionComponent={Fade} placement="top" arrow>
                        <IconButton
                          size="small"
                          onClick={openTimePicker}
                          tabIndex={-1}
                          sx={{ color: '#9ea6c4', '&:hover': { color: '#c2cae6' } }}
                        >
                          <AccessTimeIcon fontSize="inherit" />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  )
                }}
                sx={{ ...fieldSx, width: 100, minWidth: 92, flex: '0 0 100px', cursor: 'pointer', opacity: date ? 1 : 0.55 }}
                onClick={() => { openTimePicker(); }}
              />
            )}
            {!showTime && (
              <LineLabelTextField
                label=""
                placeholder="+ Time"
                value={time}
                onClick={() => setShowTime(true)}
                onFocus={() => setShowTime(true)}
                readOnly
                sx={{ ...fieldSx, width: 100, minWidth: 92, borderRadius: 2, textAlign: 'center', '& .MuiInputBase-input': { textAlign: 'center' } }}
                InputProps={{
                  disableUnderline: true,
                }}
              />
            )}
          </Box>
          <Box sx={{ fontSize: 12.5, color: '#b7bfd9', mt: -0.5, lineHeight: 1.4 }}>
            Date & Time are <strong>optional</strong>
          </Box>
        </Box>
      </DialogContent>
      {/* Calendar dialog: match Caring Hub / Appointments popup styling */}
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
          <Button onClick={() => {
            if (globalSelectedDate) setDate(formatDate(globalSelectedDate));
            setShowCalendar(false);
          }} variant="contained" color="info">Select</Button>
        </DialogActions>
      </Dialog>
      <DialogActions sx={{ px: 3, py: 1.75, borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
        <Box sx={{ flex: 1 }} />
        <Box>
          <Button onClick={() => { reset(); onClose(); }} sx={{ color: '#bfc6e0', mr: 1, textTransform: 'none', fontWeight: 500 }}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!label.trim() && !desc.trim()} variant='contained' color='info' sx={{ borderRadius: 2.5, px: 3.5, fontWeight: 600, boxShadow: '0 4px 14px -2px rgba(76,119,255,0.45)', background: 'rgba(44, 50, 90, 0.85)' }}>Add</Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
