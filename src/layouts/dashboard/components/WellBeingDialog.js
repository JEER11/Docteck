import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Autocomplete, InputAdornment, IconButton, Grow, Slider
} from '@mui/material';
import MoodIcon from '@mui/icons-material/Mood';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import VuiBox from 'components/VuiBox';
import VuiTypography from 'components/VuiTypography';
import { LineLabelTextField } from 'layouts/profile';

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
  };

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
      <DialogTitle sx={{ px: 3, py: 2.5, m: 0, typography: 'h6', fontWeight: 700 }}>Log Your Well Being</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, px: 3, pt: 0.5, pb: 1.5 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxWidth: 520, mx: 'auto', width: '100%' }}>
          <Autocomplete
            options={EMOTION_OPTIONS}
            value={emotion ? emotion : null}
            onChange={(_, val) => setEmotion(val || '')}
            autoHighlight
            clearOnEscape
            renderInput={(params) => (
              <LineLabelTextField
                {...params}
                label="Emotion"
                placeholder="Choose or type"
                autoFocus
                InputLabelProps={{ shrink: true }}
                sx={{ ...fieldSx, mt: 2, mb: 0.25 }}
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
            <LineLabelTextField
              label="Intensity (1-10)"
              type="number"
              value={intensity}
              name="intensity"
              onChange={e => setIntensity(Math.max(1, Math.min(10, Number(e.target.value))))}
              inputProps={{ min: 1, max: 10 }}
              InputLabelProps={{ shrink: true }}
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
          <LineLabelTextField
            label="Notes (optional)"
            value={note}
            onChange={e => setNote(e.target.value)}
            fullWidth
            multiline
            minRows={3}
            placeholder="Context, triggers, actions…"
            InputLabelProps={{ shrink: true }}
            sx={{ ...fieldSx }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 1.75, borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'flex-end' }}>
        <VuiBox sx={{ flex: 1 }} />
        <VuiBox>
          <Button onClick={onClose} sx={{ color: '#bfc6e0', mr: 1, textTransform: 'none', fontWeight: 500 }}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="info" sx={{ borderRadius: 2.5, px: 3.5, fontWeight: 600, boxShadow: '0 4px 14px -2px rgba(76,119,255,0.45)', background: 'rgba(44, 50, 90, 0.85)' }}>Add</Button>
        </VuiBox>
      </DialogActions>
    </Dialog>
  );
}
