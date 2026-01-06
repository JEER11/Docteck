import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Autocomplete, InputAdornment, IconButton, Grow, Tooltip, Fade
} from '@mui/material';
import { LineLabelTextField } from 'layouts/profile';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
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

  const reset = () => { setType('Note'); setLabel(''); setDesc(''); setDate(''); setTime(''); setShowTime(false); };

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

  const fieldSx = {
    width: '100%',
    ml: 0,
    background: '#181a2f',
    borderRadius: 2,
    '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #272c4c' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#343d68' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#6a6afc', boxShadow: '0 0 0 1px #6a6afc40' },
    '& .MuiInputBase-input': { color: '#e7e9f3', fontSize: 14, py: 1.3, background: 'transparent' },
    '& .MuiInputBase-root': { alignItems: 'center' },
    minHeight: 54,
    transition: 'border-color .18s, box-shadow .18s, background .25s',
    // Hide native calendar/time indicators across browsers (use !important for stubborn UAs)
    '&& input[type="date"]::-webkit-calendar-picker-indicator, && input[type="time"]::-webkit-calendar-picker-indicator': { display: 'none !important', WebkitAppearance: 'none', appearance: 'none' },
    '&& .MuiInputBase-input::-webkit-calendar-picker-indicator, && .MuiInputBase-input::-webkit-clear-button': { display: 'none !important' },
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
              onClick={() => {
                if (!dateRef.current || dateRef.current.readOnly || dateRef.current.disabled) return;
                try {
                  if (dateRef.current.showPicker) dateRef.current.showPicker(); else dateRef.current.focus();
                } catch (_) { try { dateRef.current.focus(); } catch(e){} }
              }}
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
                          onClick={() => {
                            if (!timeRef.current) return;
                            try {
                              if (timeRef.current.showPicker) {
                                timeRef.current.showPicker();
                              } else {
                                try { timeRef.current.focus(); timeRef.current.click(); } catch(e){ timeRef.current.focus(); }
                              }
                            } catch (err) {
                              try { timeRef.current.focus(); } catch (_) {}
                            }
                          }}
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
                onClick={() => { if (timeRef.current) { if (timeRef.current.showPicker) timeRef.current.showPicker(); else timeRef.current.focus(); } }}
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
