import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Autocomplete, InputAdornment, IconButton, Grow, Slider
} from '@mui/material';
import MoodIcon from '@mui/icons-material/Mood';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import VuiBox from 'components/VuiBox';
import VuiTypography from 'components/VuiTypography';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow ref={ref} {...props} style={{ transformOrigin: 'center top', ...props.style }} timeout={{ appear: 300, enter: 300, exit: 180 }} />;
});

const EMOTION_OPTIONS = [
  'Joyful', 'Content', 'Calm', 'Motivated', 'Neutral',
  'Stressed', 'Anxious', 'Sad', 'Frustrated', 'Exhausted'
];

export default function WellBeingDialog({ open, onClose, onSubmit }) {
  const [emotion, setEmotion] = useState('');
  const [note, setNote] = useState('');
  const [intensity, setIntensity] = useState(5);

  const handleSubmit = () => {
    onSubmit({ emotion, note, intensity });
    setEmotion('');
    setNote('');
    setIntensity(5);
    onClose();
  };

  // Match Caring Hub Appointments dialog UI
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
    '& .MuiInputBase-input': { color: '#e7e9f3', fontSize: 14, py: 1.25, background: 'transparent' },
    '& .MuiSelect-select': { background: 'transparent' },
    '& .MuiInputLabel-root': {
      color: '#6b7199',
      '&.Mui-focused': { color: '#6b7199' },
    },
    minHeight: 54,
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      TransitionComponent={Transition}
      keepMounted
      PaperProps={{
        sx: {
          background: 'linear-gradient(145deg, rgba(30,36,66,0.92) 0%, rgba(22,26,48,0.88) 70%)',
            boxShadow: '0 8px 28px -4px rgba(0,0,0,0.55), 0 4px 12px -2px rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 5,
            color: 'white',
            backdropFilter: 'blur(14px)',
            p: 4,
            minWidth: 480,
        }
      }}
    >
      <DialogTitle sx={{ color: 'white', fontWeight: 700, fontSize: 22, pb: 2 }}>Log Your Well Being</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, px: 2, pt: 1, pb: 1.5 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxWidth: 520, mx: 'auto', width: '100%' }}>
          <Autocomplete
            options={EMOTION_OPTIONS}
            value={emotion ? emotion : null}
            onChange={(_, val) => setEmotion(val || '')}
            autoHighlight
            clearOnEscape
            renderInput={(params) => (
              <TextField
                {...params}
                label="Emotion"
                placeholder="Choose or type"
                autoFocus
                InputLabelProps={{ shrink: true, style: { color: '#6b7199' } }}
                sx={{ ...fieldSx, mt: 1 }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <InputAdornment position="end" sx={{ mr: 0.5 }}>
                      <MoodIcon fontSize="small" sx={{ color: '#9ea6c4' }} />
                      {params.InputProps.endAdornment}
                    </InputAdornment>
                  )
                }}
              />
            )}
            ListboxProps={{ style: { maxHeight: 240 } }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <TextField
              label="Intensity (1-10)"
              type="number"
              value={intensity}
              onChange={e => setIntensity(Math.max(1, Math.min(10, Number(e.target.value))))}
              inputProps={{ min: 1, max: 10 }}
              InputLabelProps={{ shrink: true, style: { color: '#6b7199' } }}
              sx={{ ...fieldSx }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ mr: 0.5 }}>
                    <IconButton size="small" tabIndex={-1} sx={{ color: '#9ea6c4' }}>
                      <LeaderboardIcon fontSize="inherit" />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Slider
              value={intensity}
              onChange={(_, v) => setIntensity(Array.isArray(v) ? v[0] : v)}
              min={1}
              max={10}
              step={1}
              marks={[1,3,5,7,10].map(v => ({ value: v, label: String(v) }))}
              sx={{ mt: -0.5, mx: 0.5, color: '#4b8dfc' }}
            />
          </Box>
          <TextField
            label="Notes (optional)"
            value={note}
            onChange={e => setNote(e.target.value)}
            fullWidth
            multiline
            minRows={3}
            placeholder="Context, triggers, actions…"
            InputLabelProps={{ shrink: true, style: { color: '#6b7199' } }}
            sx={{ ...fieldSx }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 2, pb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={onClose} sx={{ color: '#bfc6e0', mr: 1 }}>Cancel</Button>
        <Button onClick={handleSubmit} variant='contained' color='info' sx={{ borderRadius: 2, px: 3, fontWeight: 600 }}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}
