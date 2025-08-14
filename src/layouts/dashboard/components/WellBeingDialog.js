import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import VuiBox from 'components/VuiBox';
import VuiTypography from 'components/VuiTypography';

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
    background: '#181a2f',
    borderRadius: 1.5,
    '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #23244a' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#2f3570' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#6a6afc' },
    '& .MuiInputBase-input': { color: '#e7e9f3', fontSize: 14, py: 1, background: 'transparent' },
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
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
        Log Your Well Being
      </DialogTitle>
      <DialogContent 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 1.5, 
          mt: 1, 
          background: 'transparent',
          color: 'white',
          px: 2,
          minWidth: 400,
        }}
      >
        <VuiBox display="flex" flexDirection="column" gap={1}>
          <TextField
            label="Emotion"
            value={emotion}
            onChange={e => setEmotion(e.target.value)}
            fullWidth
            autoFocus
            InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }}
            sx={{ ...fieldSx, mt: 2, mb: 0.5, minHeight: 48 }}
          />
          <TextField
            label="How strong is this feeling? (1-10)"
            type="number"
            value={intensity}
            onChange={e => setIntensity(Math.max(1, Math.min(10, Number(e.target.value))))}
            inputProps={{ min: 1, max: 10 }}
            InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }}
            fullWidth
            sx={{ ...fieldSx, mb: 0.5 }}
          />
          <TextField
            label="Notes (optional)"
            value={note}
            onChange={e => setNote(e.target.value)}
            fullWidth
            multiline
            minRows={2}
            InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }}
            sx={{ ...fieldSx, mb: 0.5 }}
          />
        </VuiBox>
      </DialogContent>
      <DialogActions sx={{ background: 'transparent', px: 2, pb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={onClose} sx={{ color: '#bfc6e0', mr: 1 }}>Cancel</Button>
        <Button onClick={handleSubmit} variant='contained' color='info' sx={{ borderRadius: 2, px: 3, fontWeight: 600 }}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
