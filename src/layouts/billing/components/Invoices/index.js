// @mui material components
import Card from "@mui/material/Card";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";
import IconButton from '@mui/material/IconButton';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Tooltip from "@mui/material/Tooltip";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiButton from "components/VuiButton";

// Billing page components
import Invoice from "layouts/billing/components/Invoice";
import React, { useState } from "react";
import { auth } from "lib/firebase";
import { onPrescriptions, addPrescription, updatePrescription, deletePrescription } from "lib/caringHubData";
import { uploadUserFile, deleteUserFile } from "lib/storage";
// ReactDOM no longer needed; using MUI Dialogs
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";

function Invoices() {
  const DEMO_PRESCRIPTIONS = [
    { medicine: 'Lisinopril 10mg', price: '12.00', date: new Date().toISOString().slice(0,10), info: null },
    { medicine: 'Levothyroxine 50mcg', price: '18.50', date: new Date(Date.now() + 86400000).toISOString().slice(0,10), info: null },
  ];
  // Match HUB dialog input style (no inner bubbles)
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
    '& .MuiInputBase-input': { color: '#e7e9f3', fontSize: 14, py: 1, background: 'transparent' },
    '& .MuiSelect-select': { background: 'transparent' },
    '& .MuiInputLabel-root': {
      color: '#6b7199',
      '&.Mui-focused': { color: '#6b7199' },
    },
  };
  // Save changes in the Edit modal
  const handleEditSave = async () => {
    if (editIdx == null) return;
    if (auth && auth.currentUser && prescriptions[editIdx]?.id) {
      // Persist fields; if a new File was provided for info, upload to Firebase Storage and include metadata
      const { medicine, price, date } = editPrescription || {};
      let infoPatch = {};
      try {
        if (editPrescription?.info instanceof File) {
          const file = editPrescription.info;
          const { url, path } = await uploadUserFile(file, "prescriptions");
          infoPatch = {
            infoUrl: url,
            infoPath: path,
            infoName: file.name,
            infoType: file.type || "",
            infoSize: file.size || 0,
          };
        }
      } catch (_) { /* ignore upload errors for now */ }
      try { await updatePrescription(prescriptions[editIdx].id, { medicine, price, date, ...infoPatch }); } catch (_) {}
    } else {
      setPrescriptions(prev => {
        const next = prev.map((rx, idx) => idx === editIdx ? { ...editPrescription } : rx);
        try { localStorage.setItem('prescriptions', JSON.stringify(next)); } catch (_) {}
        return next;
      });
    }
    handleEditClose();
  };
  // Handle changes in the Edit modal
  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    setEditPrescription(prev => ({
      ...prev,
      [name]: name === "info" ? files[0] : value
    }));
  };
  // Prescriptions state; subscribe to Firestore when signed-in, fallback to localStorage
  const [prescriptions, setPrescriptions] = useState(() => {
    try {
      const raw = localStorage.getItem('prescriptions');
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) && list.length ? list : DEMO_PRESCRIPTIONS;
    } catch(_) { return DEMO_PRESCRIPTIONS; }
  });
  React.useEffect(() => {
    if (auth && auth.currentUser) {
      const unsub = onPrescriptions({}, (items) => {
        if (Array.isArray(items) && items.length) setPrescriptions(items);
      });
      return () => unsub && unsub();
    }
    try {
      const raw = localStorage.getItem('prescriptions');
      const list = raw ? JSON.parse(raw) : [];
      if (Array.isArray(list) && list.length) setPrescriptions(list);
      else {
        if (!localStorage.getItem('prescriptions_seeded')) {
          const samples = [
            { medicine: 'Lisinopril 10mg', price: '12.00', date: new Date().toISOString().slice(0,10), info: null },
            { medicine: 'Levothyroxine 50mcg', price: '18.50', date: new Date(Date.now() + 86400000).toISOString().slice(0,10), info: null }
          ];
          setPrescriptions(samples);
          try {
            localStorage.setItem('prescriptions', JSON.stringify(samples));
            localStorage.setItem('prescriptions_seeded', '1');
          } catch(_) {}
        }
      }
    } catch (_) {}
  }, []);
  const [open, setOpen] = useState(false);
  const [newPrescription, setNewPrescription] = useState({ medicine: "", price: "", date: "", info: null });
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuIdx, setMenuIdx] = useState(null);
  const [viewAllOpen, setViewAllOpen] = useState(false);
  const MAX_VISIBLE = 5; // Show up to 5 prescriptions in the main box
  const visiblePrescriptions = prescriptions.slice(0, MAX_VISIBLE);
  const extraPrescriptions = prescriptions.length > MAX_VISIBLE ? prescriptions.slice(MAX_VISIBLE) : [];

  // Assistant-triggered add prescription
  React.useEffect(() => {
    const onAddRx = async (e) => {
      const rx = e.detail || {};
      if (!rx.medicine || !rx.date) return;
      if (auth && auth.currentUser) {
        try { await addPrescription({ medicine: rx.medicine, price: rx.price || '', date: rx.date, info: null }); } catch (_) {}
      } else {
        setPrescriptions(prev => {
          const next = [...prev, { medicine: rx.medicine, price: rx.price || '', date: rx.date, info: null }];
          try { localStorage.setItem('prescriptions', JSON.stringify(next)); } catch (_) {}
          return next;
        });
      }
    };
    window.addEventListener('assistant:add_prescription', onAddRx);
    // Drain queued
    try {
      const list = JSON.parse(localStorage.getItem('assistant_queue_add_prescription') || '[]');
      if (Array.isArray(list)) list.forEach((p) => onAddRx({ detail: p }));
      localStorage.removeItem('assistant_queue_add_prescription');
    } catch (_) {}
    return () => window.removeEventListener('assistant:add_prescription', onAddRx);
  }, []);

  // Edit modal state
  const [editIdx, setEditIdx] = useState(null);
  const [editPrescription, setEditPrescription] = useState({ medicine: '', price: '', date: '', info: null });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewPrescription({ medicine: "", price: "", date: "", info: null });
  };
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setNewPrescription({
      ...newPrescription,
      [name]: name === "info" ? files[0] : value
    });
  };
  const handleAdd = async () => {
    if (!newPrescription.medicine || !newPrescription.price || !newPrescription.date) return;
    if (auth && auth.currentUser) {
      try {
        let infoMeta = {};
        if (newPrescription.info instanceof File) {
          try {
            const { url, path } = await uploadUserFile(newPrescription.info, "prescriptions");
            infoMeta = {
              infoUrl: url,
              infoPath: path,
              infoName: newPrescription.info.name,
              infoType: newPrescription.info.type || "",
              infoSize: newPrescription.info.size || 0,
            };
          } catch (_) { /* ignore upload errors; proceed without info */ }
        }
        await addPrescription({ medicine: newPrescription.medicine, price: newPrescription.price, date: newPrescription.date, ...infoMeta });
      } catch (_) {}
    } else {
      const next = [
        ...prescriptions,
        { medicine: newPrescription.medicine, price: newPrescription.price, date: newPrescription.date, info: newPrescription.info }
      ];
      setPrescriptions(next);
      try { localStorage.setItem('prescriptions', JSON.stringify(next)); } catch (_) {}
    }
    handleClose();
  };
  const handleMenuOpen = (event, idx) => {
    setMenuAnchor(event.currentTarget);
    setMenuIdx(idx);
  };
  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuIdx(null);
  };
  const handleEditOpen = (idx) => {
    setEditIdx(idx);
    setEditPrescription({ ...prescriptions[idx] });
    handleMenuClose();
  };

  // Fix: Define handleEditClose to close the edit modal
  const handleEditClose = () => {
    setEditIdx(null);
    setEditPrescription({ medicine: '', price: '', date: '', info: null });
  };
  const handleDelete = async () => {
    if (auth && auth.currentUser && prescriptions[menuIdx]?.id) {
      try { await deletePrescription(prescriptions[menuIdx].id); } catch (_) {}
    } else {
      const next = prescriptions.filter((_, i) => i !== menuIdx);
      setPrescriptions(next);
      try { localStorage.setItem('prescriptions', JSON.stringify(next)); } catch (_) {}
    }
    handleMenuClose();
  };
  // Direct delete by index (used inside View All rows where no menu is opened)
  const handleDeleteAtIndex = async (idx) => {
    if (auth && auth.currentUser && prescriptions[idx]?.id) {
      try { await deletePrescription(prescriptions[idx].id); } catch (_) {}
    } else {
      setPrescriptions(prev => {
        const next = prev.filter((_, i) => i !== idx);
        try { localStorage.setItem('prescriptions', JSON.stringify(next)); } catch (_) {}
        return next;
      });
    }
  };
  const handleViewAllOpen = () => setViewAllOpen(true);
  const handleViewAllClose = () => setViewAllOpen(false);

  // Document modal state
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [docModalIdx, setDocModalIdx] = useState(null);
  const [docModalFile, setDocModalFile] = useState(null); // Can be File or { url, type }

  // Handle Info click
  const handleInfoClick = (idx) => {
    setDocModalIdx(idx);
    const rx = prescriptions[idx];
    if (rx?.infoUrl) setDocModalFile({ url: rx.infoUrl, type: rx.infoType || "" });
    else setDocModalFile(rx?.info || null);
    setDocModalOpen(true);
  };
  const handleDocModalClose = () => {
    setDocModalOpen(false);
    setDocModalIdx(null);
    setDocModalFile(null);
  };
  const handleDocUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || docModalIdx == null) return;
    if (auth && auth.currentUser && prescriptions[docModalIdx]?.id) {
      try {
        const { url, path } = await uploadUserFile(file, "prescriptions");
        const patch = { infoUrl: url, infoPath: path, infoName: file.name, infoType: file.type || "", infoSize: file.size || 0 };
        await updatePrescription(prescriptions[docModalIdx].id, patch);
        // update local state for immediate UI
        setPrescriptions(prev => prev.map((rx, i) => i === docModalIdx ? { ...rx, ...patch } : rx));
        setDocModalFile({ url, type: file.type || "" });
      } catch (_) { /* ignore */ }
    } else {
      // Guest mode: store File locally
      setPrescriptions(prev => prev.map((rx, idx) => idx === docModalIdx ? { ...rx, info: file } : rx));
      setDocModalFile(file);
      try { localStorage.setItem('prescriptions', JSON.stringify(prescriptions.map((rx, idx) => idx === docModalIdx ? { ...rx, info: file } : rx))); } catch (_) {}
    }
  };

  // Document Dialog
  const DocDialog = (
    <Dialog open={docModalOpen} onClose={handleDocModalClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { background: 'rgba(34, 40, 74, 0.65)', boxShadow: 24, borderRadius: 4, color: 'white', backdropFilter: 'blur(10px)', p: 4, minWidth: 400, maxWidth: 640, height: '80vh', maxHeight: '80vh', mt: '5vh' } }}
    >
      <DialogTitle sx={{ color: 'white', fontWeight: 700, fontSize: 22, pb: 2, pr: 5 }}>
        Prescription Document
        <IconButton aria-label="close" onClick={handleDocModalClose} sx={{ position: 'absolute', right: 8, top: 8, color: '#bfc6e0' }}>
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 1, background: 'transparent', color: 'white', px: 2, minWidth: 400, maxHeight: 'calc(80vh - 140px)', overflowY: 'auto' }}>
        {docModalFile ? (
          // If docModalFile is a File, use URL.createObjectURL; if it's an object with url, use that
          (docModalFile instanceof File ? (docModalFile.type || '').startsWith('image') : (docModalFile.type || '').startsWith('image')) ? (
            <img src={docModalFile instanceof File ? URL.createObjectURL(docModalFile) : docModalFile.url} alt="Prescription" style={{ maxWidth: '100%', maxHeight: 380, borderRadius: 12, display: 'block', margin: '0 auto' }} />
          ) : (docModalFile instanceof File ? (docModalFile.type === 'application/pdf') : (docModalFile.type === 'application/pdf')) ? (
            <iframe src={docModalFile instanceof File ? URL.createObjectURL(docModalFile) : docModalFile.url} title="Prescription PDF" style={{ width: '100%', height: 400, border: 'none', borderRadius: 12, background: '#222' }} />
          ) : (
            <VuiTypography color="white" style={{ textAlign: 'center', margin: '24px 0' }}>Cannot preview this file type.</VuiTypography>
          )
        ) : (
          <VuiBox display="flex" flexDirection="column" alignItems="center" gap={2}>
            <VuiTypography color="white">No document attached</VuiTypography>
            <input type="file" accept="image/*,application/pdf" onChange={handleDocUpload} style={{ color: '#fff' }} />
          </VuiBox>
        )}
      </DialogContent>
      <DialogActions sx={{ background: 'transparent', px: 2, pb: 2 }}>
        <Button onClick={handleDocModalClose} sx={{ color: '#bfc6e0' }}>Close</Button>
      </DialogActions>
    </Dialog>
  );
  const medicineOptions = [
    "Atorvastatin 20mg", "Lisinopril 10mg", "Metformin 500mg", "Levothyroxine 50mcg", "Amlodipine 5mg", "Simvastatin 40mg", "Omeprazole 20mg", "Losartan 50mg", "Gabapentin 300mg", "Hydrochlorothiazide 25mg", "Sertraline 50mg", "Furosemide 40mg", "Metoprolol 50mg", "Pantoprazole 40mg", "Escitalopram 10mg", "Rosuvastatin 10mg", "Tamsulosin 0.4mg", "Alprazolam 0.5mg", "Citalopram 20mg", "Ciprofloxacin 500mg", "Duloxetine 30mg", "Fluoxetine 20mg", "Atenolol 50mg", "Clopidogrel 75mg", "Doxycycline 100mg", "Enalapril 10mg", "Glipizide 5mg", "Insulin Glargine 100U/mL", "Lamotrigine 100mg", "Lansoprazole 30mg", "Levetiracetam 500mg", "Levocetirizine 5mg", "Loratadine 10mg", "Meloxicam 15mg", "Montelukast 10mg", "Naproxen 500mg", "Olmesartan 20mg", "Paroxetine 20mg", "Pioglitazone 30mg", "Pravastatin 40mg", "Prednisone 20mg", "Pregabalin 75mg", "Propranolol 40mg", "Quetiapine 100mg", "Ranitidine 150mg", "Rivaroxaban 20mg", "Sitagliptin 100mg", "Spironolactone 25mg", "Trazodone 50mg", "Valsartan 80mg", "Venlafaxine 75mg", "Warfarin 5mg", "Zolpidem 10mg", "Amoxicillin 500mg", "Azithromycin 250mg", "Baclofen 10mg", "Bisoprolol 5mg", "Budesonide 200mcg", "Carvedilol 12.5mg", "Cetirizine 10mg", "Chlorthalidone 25mg", "Clonazepam 1mg", "Clonidine 0.1mg", "Colchicine 0.6mg", "Desvenlafaxine 50mg", "Diazepam 5mg", "Digoxin 0.25mg", "Diphenhydramine 25mg", "Divalproex 250mg", "Donepezil 10mg", "Dulcolax 5mg", "Empagliflozin 10mg", "Esomeprazole 40mg", "Famotidine 20mg", "Finasteride 5mg", "Fluticasone 50mcg", "Folic Acid 1mg", "Gliclazide 80mg", "Glyburide 5mg", "Hydralazine 25mg", "Hydroxyzine 25mg", "Indapamide 2.5mg", "Irbesartan 150mg", "Isosorbide 30mg", "Ketorolac 10mg", "Labetalol 100mg", "Lactulose 10g", "Lidocaine 5%", "Linagliptin 5mg", "Liraglutide 1.2mg", "Magnesium Oxide 400mg", "Memantine 10mg", "Methotrexate 2.5mg", "Methylprednisolone 4mg", "Mirtazapine 15mg", "Mometasone 50mcg", "Nebivolol 5mg", "Nitrofurantoin 100mg", "Olanzapine 10mg", "Ondansetron 4mg", "Oxcarbazepine 300mg", "Phenytoin 100mg", "Pramipexole 0.25mg", "Rabeprazole 20mg", "Ramipril 5mg", "Risperidone 2mg", "Saxagliptin 5mg", "Sildenafil 50mg", "Sotalol 80mg", "Terazosin 5mg", "Topiramate 25mg", "Tramadol 50mg", "Valacyclovir 500mg", "Valsartan 160mg", "Vildagliptin 50mg"
  ];

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

  const AddDialog = (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { ...glassPaper, width: { xs: '100%', sm: 560 }, maxWidth: 600 }
      }}
    >
      <DialogTitle sx={{ px: 3, py: 2.3, m: 0, typography: 'h6', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
        <span style={{ flex: 1, fontSize: 20 }}>Add Prescription</span>
        <IconButton onClick={handleClose} size="small" sx={{ color: '#c6cbe3', '&:hover': { color: 'white', background: 'rgba(255,255,255,0.08)' } }}>
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: 3, pt: 1.5, pb: 1.7 }}>
        <Grid container spacing={1.5}>
          <Grid item xs={12}>
            <TextField
              label="Medicine Name & mg"
              placeholder="Start typing..."
              name="medicine"
              value={newPrescription.medicine}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true, style: { color: '#6b7199' } }}
              inputProps={{ list: 'medicine-options' }}
              sx={{ ...fieldSx, mt: 0.5 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Monthly Price ($)" name="price" type="text" value={newPrescription.price} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true, style: { color: '#6b7199' } }} sx={fieldSx} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Pick-up Date" name="date" type="date" value={newPrescription.date} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true, style: { color: '#6b7199' } }} sx={fieldSx} />
          </Grid>
          <Grid item xs={12}>
            <VuiBox>
              <VuiTypography color="white" sx={{ fontSize: 13, mb: 0.75, opacity: 0.75 }}>Prescription Info (PDF / Image)</VuiTypography>
              <input name="info" type="file" accept="application/pdf,image/*" onChange={handleChange} style={{ color: '#fff', fontSize: 12 }} />
            </VuiBox>
          </Grid>
        </Grid>
        <datalist id="medicine-options">
          {medicineOptions.map((name, i) => (<option value={name} key={i} />))}
        </datalist>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 1.6, borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
        <Button onClick={handleClose} sx={{ color: '#bfc6e0', textTransform: 'none', fontWeight: 500 }}>Cancel</Button>
        <Button onClick={handleAdd} variant="contained" color="info" disabled={!newPrescription.medicine || !newPrescription.price || !newPrescription.date} sx={{ borderRadius: 2, px: 3, fontWeight: 600, boxShadow: '0 0 0 1px rgba(255,255,255,0.1) inset' }}>Add</Button>
      </DialogActions>
    </Dialog>
  );

  const EditDialog = (
    <Dialog open={editIdx !== null} onClose={handleEditClose} maxWidth="sm" fullWidth PaperProps={{ sx: glassPaper }}>
      <DialogTitle sx={{ px: 3, py: 2.3, m: 0, typography: 'h6', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
        <span style={{ flex: 1, fontSize: 20 }}>Edit Prescription</span>
        <IconButton onClick={handleEditClose} size="small" sx={{ color: '#c6cbe3', '&:hover': { color: 'white', background: 'rgba(255,255,255,0.08)' } }}>
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: 3, pt: 0.75, pb: 1.25 }}>
        <Grid container spacing={1.5}>
          <Grid item xs={12}>
            <TextField label="Medicine Name & mg" name="medicine" value={editPrescription.medicine} onChange={handleEditChange} fullWidth InputLabelProps={{ shrink: true, style: { color: '#6b7199' } }} inputProps={{ list: 'medicine-options' }} sx={fieldSx} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Monthly Price ($)" name="price" type="text" value={editPrescription.price} onChange={handleEditChange} fullWidth InputLabelProps={{ shrink: true, style: { color: '#6b7199' } }} sx={fieldSx} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Pick-up Date" name="date" type="date" value={editPrescription.date} onChange={handleEditChange} fullWidth InputLabelProps={{ shrink: true, style: { color: '#6b7199' } }} sx={fieldSx} />
          </Grid>
          <Grid item xs={12}>
            <VuiBox>
              <VuiTypography color="white" sx={{ fontSize: 13, mb: 0.75, opacity: 0.75 }}>Prescription Info (PDF / Image)</VuiTypography>
              <input name="info" type="file" accept="application/pdf,image/*" onChange={handleEditChange} style={{ color: '#fff', fontSize: 12 }} />
            </VuiBox>
          </Grid>
        </Grid>
        <datalist id="medicine-options">
          {medicineOptions.map((name, i) => (<option value={name} key={i} />))}
        </datalist>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 1.6, borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
        <Button onClick={handleEditClose} sx={{ color: '#bfc6e0', textTransform: 'none', fontWeight: 500 }}>Cancel</Button>
        <Button onClick={handleEditSave} variant="contained" color="info" disabled={!editPrescription.medicine || !editPrescription.price || !editPrescription.date} sx={{ borderRadius: 2, px: 3, fontWeight: 600, boxShadow: '0 0 0 1px rgba(255,255,255,0.1) inset' }}>Save</Button>
      </DialogActions>
    </Dialog>
  );

  const ViewAllDialog = (
    <Dialog open={viewAllOpen} onClose={handleViewAllClose} maxWidth="md" fullWidth
      PaperProps={{ sx: { background: 'rgba(34, 40, 74, 0.65)', boxShadow: 24, borderRadius: 4, color: 'white', backdropFilter: 'blur(10px)', p: 4, minWidth: 400, maxWidth: 900, height: '80vh', maxHeight: '80vh', mt: '5vh' } }}
    >
      <DialogTitle
        sx={{
          color: 'white', fontWeight: 700, fontSize: 22, pb: 2, pr: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}
      >
        <span>All Prescriptions</span>
        <Button
          onClick={handleOpen}
          size="small"
          sx={{
            borderRadius: 999,
            px: 1.5,
            py: 0.5,
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: 0.3,
            color: '#e7e9f3',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            textTransform: 'none',
            '&:hover': {
              background: 'rgba(255,255,255,0.12)',
              borderColor: 'rgba(255,255,255,0.2)'
            }
          }}
          startIcon={<AddIcon sx={{ fontSize: 18 }} />}
        >
          Add
        </Button>
      </DialogTitle>
      <DialogContent sx={{ pt: 1, background: 'transparent', color: 'white', px: 2, minWidth: 400, maxHeight: 'calc(80vh - 140px)', overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingRight: 4 }}>
          {prescriptions.map((rx, idx) => (
            <div key={rx.medicine + rx.date + idx} style={{ display: 'flex', alignItems: 'center', width: '100%', minHeight: 40 }}>
              <div style={{ flex: 1 }}>
                <Invoice
                  date={rx.date}
                  medicine={rx.medicine}
                  price={rx.price}
                  info={rx.info}
                  noGutter={idx === prescriptions.length - 1}
                  onInfoClick={() => handleInfoClick(idx)}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 8, marginTop: (idx < 5 ? -18 : 0) }}>
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    onClick={() => handleEditOpen(idx)}
                    sx={{
                      color: '#cfd5f3',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      '&:hover': { background: 'rgba(0,255,208,0.12)', color: '#00ffd0' }
                    }}
                  >
                    <EditRoundedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteAtIndex(idx)}
                    sx={{
                      color: '#cfd5f3',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      '&:hover': { background: 'rgba(255,107,107,0.14)', color: '#ff6b6b' }
                    }}
                  >
                    <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
      <DialogActions sx={{ background: 'transparent', px: 2, pb: 2 }}>
        <Button onClick={handleViewAllClose} sx={{ color: '#bfc6e0' }}>Close</Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Card id="delete-account" sx={{ height: "100%" }}>
      <VuiBox mb="28px" display="flex" justifyContent="space-between" alignItems="center">
        <VuiTypography variant="h6" fontWeight="medium" color="white">
          Prescriptions
        </VuiTypography>
        <div style={{ display: "flex", gap: 0, alignItems: 'center' }}>
          <VuiButton
            variant="contained"
            color="info"
            size="small"
            style={{
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              minWidth: 36,
              padding: '6px 14px',
              fontWeight: 600,
              letterSpacing: 0.5,
              fontSize: 13,
              opacity: 0.7,
              background: 'rgba(32,34,64,0.7)',
              color: '#e0e0e0',
              boxShadow: 'none',
              height: 36
            }}
            onClick={handleViewAllOpen}
          >
            VIEW ALL
          </VuiButton>
          <VuiButton
            variant="contained"
            color="info"
            size="small"
            onClick={handleOpen}
            style={{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              minWidth: 36,
              padding: 0,
              opacity: 0.7,
              background: 'rgba(32,34,64,0.7)',
              color: '#e0e0e0',
              boxShadow: 'none',
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <AddIcon />
          </VuiButton>
        </div>
      </VuiBox>
      <VuiBox
        style={{ maxHeight: 350, overflowY: prescriptions.length > MAX_VISIBLE ? 'auto' : 'visible', transition: 'max-height 0.2s', minHeight: 0 }}
        className={prescriptions.length > MAX_VISIBLE ? 'modern-scrollbar' : ''}
      >
        <VuiBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          {visiblePrescriptions.map((rx, idx) => (
            <div key={rx.medicine + rx.date + idx} style={{ display: 'flex', alignItems: 'center', width: '100%', minHeight: 40 }}>
              <div style={{ flex: 1 }}>
                <Invoice
                  date={rx.date}
                  medicine={rx.medicine}
                  price={rx.price}
                  info={rx.info}
                  noGutter={idx === visiblePrescriptions.length - 1}
                  showYear={false}
                  onInfoClick={() => handleInfoClick(idx)}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, height: '100%' }}>
                <span
                  style={{
                    color: '#fff',
                    fontSize: 22,
                    opacity: 0.5,
                    cursor: 'pointer',
                    padding: '0 12px',
                    display: 'flex',
                    alignItems: 'center',
                    height: 32,
                    minHeight: 32,
                    justifyContent: 'center',
                  }}
                  onClick={e => handleMenuOpen(e, idx)}
                >
                  <MoreVertIcon
                    style={{
                      color: '#fff',
                      opacity: 0.5,
                      fontSize: 22,
                      alignSelf: 'center',
                      marginTop:
                        prescriptions.length > 5
                          ? (idx === 4 ? '8px' : idx < 4 ? '-22px' : 0)
                          : 0
                    }}
                  />
                </span>
              </div>
            </div>
          ))}
        </VuiBox>
      </VuiBox>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ style: { background: 'rgba(34,34,34,0.95)', color: '#fff', minWidth: 120 } }}
      >
        <MenuItem onClick={() => handleEditOpen(menuIdx)} style={{ color: '#fff' }}>Edit</MenuItem>
        <MenuItem onClick={handleDelete} style={{ color: '#fff' }}>Delete</MenuItem>
      </Menu>
  {AddDialog}
  {EditDialog}
  {ViewAllDialog}
  {DocDialog}
    </Card>
  );
}

export default Invoices;
