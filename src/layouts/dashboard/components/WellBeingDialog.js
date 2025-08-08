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

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(34,35,75,0.85)',
          backdropFilter: 'blur(4px)',
          borderRadius: 3,
          p: 3,
          minWidth: 400,
        }
      }}
    >
      <DialogTitle sx={{ color: 'white', fontWeight: 'bold', fontSize: 22, pb: 1.5, mb: 1 }}>Log Your Well Being</DialogTitle>
      <DialogContent>
        <VuiBox display="flex" flexDirection="column" gap={2}>
          <TextField
            label={<span style={{ color: 'white', fontSize: 15 }}>Emotion</span>}
            value={emotion}
            onChange={e => setEmotion(e.target.value)}
            fullWidth
            autoFocus
            InputLabelProps={{ shrink: true }}
            inputProps={{ style: { color: 'white', fontSize: 15, background: 'rgba(255,255,255,0.08)', borderRadius: 4, padding: 10 } }}
            sx={{ mb: 2, mt: 2 }} // add top margin
          />
          <TextField
            label={<span style={{ color: 'white', fontSize: 15 }}>How strong is this feeling? (1-10)</span>}
            type="number"
            value={intensity}
            onChange={e => setIntensity(Math.max(1, Math.min(10, Number(e.target.value))))}
            inputProps={{ min: 1, max: 10, style: { color: 'white', fontSize: 15, background: 'rgba(255,255,255,0.08)', borderRadius: 4, padding: 10 } }}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{ mb: 1 }}
          />
          <TextField
            label={<span style={{ color: 'white', fontSize: 15 }}>Notes (optional)</span>}
            value={note}
            onChange={e => setNote(e.target.value)}
            fullWidth
            multiline
            minRows={2}
            InputLabelProps={{ shrink: true }}
            inputProps={{ style: { color: 'white', fontSize: 15, background: 'rgba(255,255,255,0.08)', borderRadius: 4, padding: 10 } }}
          />
        </VuiBox>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
        <Button onClick={onClose} sx={{ color: '#aaa', fontSize: 15 }}>Cancel</Button>
        <Button onClick={handleSubmit} variant='contained' color='primary' sx={{ fontSize: 15, px: 4, background: 'rgba(33,150,243,0.6)', boxShadow: 'none', '&:hover': { background: 'rgba(33,150,243,0.8)' } }}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
