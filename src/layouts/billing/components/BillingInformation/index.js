// @mui material components
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

// Billing page components
import Bill from "layouts/billing/components/Bill";
import VuiButton from "components/VuiButton";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { onPharmacies, addPharmacy, updatePharmacy, deletePharmacy } from "lib/caringHubData";
import { auth } from "lib/firebase";

function BillingInformation() {
  // Demo samples to show immediately on first render
  const DEMO_PHARMACIES = [
    { id: 'demo-ph1', name: 'Walgreens - Downtown', address: '123 Main St, Springfield, IL', email: 'rx@walgreens.com', phone: '(555) 123-4567', prescription: 'Atorvastatin 20mg' },
    { id: 'demo-ph2', name: 'CVS Pharmacy - Elm Rd', address: '456 Elm Rd, Springfield, IL', email: 'pharmacy@cvs.com', phone: '(555) 987-6543', prescription: 'Metformin 500mg' },
  ];
  // Persisted pharmacies list (per user) with immediate demo fallback
  const [pharmacies, setPharmacies] = useState(() => {
    try {
      const raw = localStorage.getItem('pharmacies') || '[]';
      const arr = JSON.parse(raw);
      return Array.isArray(arr) && arr.length ? arr : DEMO_PHARMACIES;
    } catch (_) { return DEMO_PHARMACIES; }
  });
  useEffect(() => {
    // Prefer Firestore when a user is actually signed in; else load from localStorage
    let unsub = null;
    const loadLocal = () => {
      try {
        const raw = localStorage.getItem('pharmacies') || '[]';
        const arr = JSON.parse(raw);
        const list = Array.isArray(arr) ? arr : [];
        if (!list.length && !localStorage.getItem('pharmacy_seeded')) {
          const samples = [
            { id: 'demo-ph1', name: 'Walgreens - Downtown', address: '123 Main St, Springfield, IL', email: 'rx@walgreens.com', phone: '(555) 123-4567', prescription: 'Atorvastatin 20mg' },
            { id: 'demo-ph2', name: 'CVS Pharmacy - Elm Rd', address: '456 Elm Rd, Springfield, IL', email: 'pharmacy@cvs.com', phone: '(555) 987-6543', prescription: 'Metformin 500mg' },
          ];
          setPharmacies(samples);
          try {
            localStorage.setItem('pharmacies', JSON.stringify(samples));
            localStorage.setItem('pharmacy_seeded', '1');
          } catch(_) {}
        } else if (list.length) {
          setPharmacies(list);
        }
      } catch (_) { /* keep current demo */ }
    };
    try {
      const uid = auth?.currentUser?.uid;
      if (uid) {
        unsub = onPharmacies({ uid }, (items) => {
          // Do not overwrite demo with an empty FS list
          if (Array.isArray(items) && items.length) setPharmacies(items);
        });
      } else {
        loadLocal();
      }
    } catch (_) {
      loadLocal();
    }
    return () => unsub && unsub();
  }, []);
  const [open, setOpen] = useState(false);
  const [newPharmacy, setNewPharmacy] = useState({ name: "", address: "", email: "", phone: "", prescription: "" });
  const [editIdx, setEditIdx] = useState(null);
  const [editPharmacy, setEditPharmacy] = useState({ name: '', address: '', email: '', phone: '', prescription: '' });
  const [viewAllOpen, setViewAllOpen] = useState(false);
  const MAX_VISIBLE = 3; // Show up to 3 pharmacies in the main box
  const visiblePharmacies = pharmacies.slice(0, MAX_VISIBLE);
  const extraPharmacies = pharmacies.length > MAX_VISIBLE ? pharmacies.slice(MAX_VISIBLE) : [];

  // Assistant-triggered add pharmacy
  useEffect(() => {
    const onAddPharmacy = (e) => {
      const ph = e.detail || {};
      if (!ph.name || !ph.address) return;
      const rec = { id: Date.now().toString(), ...ph };
      setPharmacies(prev => {
        const next = [...prev, rec];
        try { localStorage.setItem('pharmacies', JSON.stringify(next)); } catch(_){}
        return next;
      });
    };
    window.addEventListener('assistant:add_pharmacy', onAddPharmacy);
    // Drain queued
    try {
      const list = JSON.parse(localStorage.getItem('assistant_queue_add_pharmacy') || '[]');
      if (Array.isArray(list)) list.forEach((p) => onAddPharmacy({ detail: p }));
      localStorage.removeItem('assistant_queue_add_pharmacy');
    } catch (_) {}
    return () => window.removeEventListener('assistant:add_pharmacy', onAddPharmacy);
  }, []);

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

  // List of common prescription medicines (at least 100)
  const medicineOptions = [
    "Atorvastatin 20mg", "Lisinopril 10mg", "Metformin 500mg", "Levothyroxine 50mcg", "Amlodipine 5mg", "Simvastatin 40mg", "Omeprazole 20mg", "Losartan 50mg", "Gabapentin 300mg", "Hydrochlorothiazide 25mg", "Sertraline 50mg", "Furosemide 40mg", "Metoprolol 50mg", "Pantoprazole 40mg", "Escitalopram 10mg", "Rosuvastatin 10mg", "Tamsulosin 0.4mg", "Alprazolam 0.5mg", "Citalopram 20mg", "Ciprofloxacin 500mg", "Duloxetine 30mg", "Fluoxetine 20mg", "Atenolol 50mg", "Clopidogrel 75mg", "Doxycycline 100mg", "Enalapril 10mg", "Glipizide 5mg", "Insulin Glargine 100U/mL", "Lamotrigine 100mg", "Lansoprazole 30mg", "Levetiracetam 500mg", "Levocetirizine 5mg", "Loratadine 10mg", "Meloxicam 15mg", "Montelukast 10mg", "Naproxen 500mg", "Olmesartan 20mg", "Paroxetine 20mg", "Pioglitazone 30mg", "Pravastatin 40mg", "Prednisone 20mg", "Pregabalin 75mg", "Propranolol 40mg", "Quetiapine 100mg", "Ranitidine 150mg", "Rivaroxaban 20mg", "Sitagliptin 100mg", "Spironolactone 25mg", "Trazodone 50mg", "Valsartan 80mg", "Venlafaxine 75mg", "Warfarin 5mg", "Zolpidem 10mg", "Amoxicillin 500mg", "Azithromycin 250mg", "Baclofen 10mg", "Bisoprolol 5mg", "Budesonide 200mcg", "Carvedilol 12.5mg", "Cetirizine 10mg", "Chlorthalidone 25mg", "Clonazepam 1mg", "Clonidine 0.1mg", "Colchicine 0.6mg", "Desvenlafaxine 50mg", "Diazepam 5mg", "Digoxin 0.25mg", "Diphenhydramine 25mg", "Divalproex 250mg", "Donepezil 10mg", "Dulcolax 5mg", "Empagliflozin 10mg", "Esomeprazole 40mg", "Famotidine 20mg", "Finasteride 5mg", "Fluticasone 50mcg", "Folic Acid 1mg", "Gliclazide 80mg", "Glyburide 5mg", "Hydralazine 25mg", "Hydroxyzine 25mg", "Indapamide 2.5mg", "Irbesartan 150mg", "Isosorbide 30mg", "Ketorolac 10mg", "Labetalol 100mg", "Lactulose 10g", "Lidocaine 5%", "Linagliptin 5mg", "Liraglutide 1.2mg", "Magnesium Oxide 400mg", "Memantine 10mg", "Methotrexate 2.5mg", "Methylprednisolone 4mg", "Mirtazapine 15mg", "Mometasone 50mcg", "Nebivolol 5mg", "Nitrofurantoin 100mg", "Olanzapine 10mg", "Ondansetron 4mg", "Oxcarbazepine 300mg", "Phenytoin 100mg", "Pramipexole 0.25mg", "Rabeprazole 20mg", "Ramipril 5mg", "Risperidone 2mg", "Saxagliptin 5mg", "Sildenafil 50mg", "Sotalol 80mg", "Terazosin 5mg", "Topiramate 25mg", "Tramadol 50mg", "Valacyclovir 500mg", "Valsartan 160mg", "Vildagliptin 50mg"
  ];

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewPharmacy({ name: "", address: "", email: "", phone: "", prescription: "" });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPharmacy({
      ...newPharmacy,
      [name]: value
    });
  };
  const handleAdd = async () => {
  // Only require name and address; other fields optional
  if (!newPharmacy.name || !newPharmacy.address) return;
    // Capture payload then close the dialog immediately for snappy UX
    const payload = { ...newPharmacy };
    handleClose();
    // Optimistically update local state
    const localId = Date.now().toString();
    const optimistic = { id: localId, ...payload };
  const next = [ ...pharmacies, optimistic ];
  setPharmacies(next);
  try { localStorage.setItem('pharmacies', JSON.stringify(next)); } catch(_){ }
    // Firestore in background for signed-in user
    try {
      const uid = auth?.currentUser?.uid;
      if (uid) {
        await addPharmacy(payload);
      }
    } catch(_) { /* ignore */ }
  };

  const handleEditOpen = (idx) => {
    setEditIdx(idx);
    setEditPharmacy({ ...pharmacies[idx] });
  };
  const handleEditClose = () => {
    setEditIdx(null);
    setEditPharmacy({ name: '', address: '', email: '', phone: '', prescription: '' });
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditPharmacy({
      ...editPharmacy,
      [name]: value
    });
  };
  const handleEditSave = async () => {
  // Only require name and address for edits
  if (!editPharmacy.id || !editPharmacy.name || !editPharmacy.address) return;
    // Capture then close immediately
    const patch = { id: editPharmacy.id, name: editPharmacy.name, address: editPharmacy.address, email: editPharmacy.email, phone: editPharmacy.phone, prescription: editPharmacy.prescription };
    handleEditClose();
    // Update locally first
    const idx = pharmacies.findIndex(p => p.id === patch.id);
    if (idx !== -1) {
      const next = pharmacies.slice();
      next[idx] = { ...patch };
      setPharmacies(next);
      try { localStorage.setItem('pharmacies', JSON.stringify(next)); } catch(_){}
    }
    // Try Firestore in background for signed-in user
    try {
      const uid = auth?.currentUser?.uid;
      if (uid) {
        await updatePharmacy(patch.id, { name: patch.name, address: patch.address, email: patch.email, phone: patch.phone, prescription: patch.prescription });
      }
    } catch(_) { /* ignore */ }
  };

  const handleViewAllOpen = () => setViewAllOpen(true);
  const handleViewAllClose = () => setViewAllOpen(false);

  // MUI Dialogs replacing custom overlays
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
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { ...glassPaper, width: { xs: '100%', sm: 600 }, maxWidth: 640, minHeight: 430 }
      }}
    >
      <DialogTitle sx={{ px: 3, pt: 2.8, pb: 2.2, m: 0, typography: 'h6', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
        <span style={{ flex: 1, fontSize: 20 }}>Add Pharmacy</span>
        <IconButton onClick={handleClose} size="small" sx={{ color: '#c6cbe3', '&:hover': { color: 'white', background: 'rgba(255,255,255,0.08)' } }}>
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: 3, pt: 2.4, pb: 2.4 }}>
        <Grid container spacing={1.5}>
          <Grid item xs={12}>
            <TextField placeholder="e.g. Walgreens - Downtown" label="Pharmacy Name" name="name" value={newPharmacy.name} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true, style: { color: '#6b7199' } }} sx={{ ...fieldSx, mt: 1 }} />
          </Grid>
          <Grid item xs={12}>
            <TextField placeholder="123 Main St, City, ST" label="Address" name="address" value={newPharmacy.address} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true, style: { color: '#6b7199' } }} sx={fieldSx} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField placeholder="rx@pharmacy.com" label="Email (optional)" name="email" type="email" value={newPharmacy.email} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true, style: { color: '#6b7199' } }} sx={fieldSx} />
          </Grid>
            <Grid item xs={12} md={6}>
            <TextField placeholder="(555) 123-4567" label="Phone (optional)" name="phone" value={newPharmacy.phone} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true, style: { color: '#6b7199' } }} sx={fieldSx} />
          </Grid>
          <Grid item xs={12}>
            <TextField placeholder="Select or type a prescription" label="Prescription to Pick Up (optional)" name="prescription" value={newPharmacy.prescription} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true, style: { color: '#6b7199' } }} sx={fieldSx} inputProps={{ list: 'medicine-options' }} />
          </Grid>
        </Grid>
        <datalist id="medicine-options">
          {medicineOptions.map((name, i) => (<option value={name} key={i} />))}
        </datalist>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 1.75, borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)' }}>
        <Button onClick={handleClose} sx={{ color: '#bfc6e0', textTransform: 'none', fontWeight: 500 }}>Cancel</Button>
        <Button onClick={handleAdd} variant="contained" color="info" disabled={!newPharmacy.name || !newPharmacy.address} sx={{ borderRadius: 2, px: 3, fontWeight: 600, boxShadow: '0 0 0 1px rgba(255,255,255,0.1) inset' }}>Add</Button>
      </DialogActions>
    </Dialog>
  );

  const EditDialog = (
    <Dialog open={editIdx !== null} onClose={handleEditClose} maxWidth="sm" fullWidth PaperProps={{ sx: glassPaper }}>
      <DialogTitle sx={{ px: 3, py: 2.5, m: 0, typography: 'h6', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
        <span style={{ flex: 1, fontSize: 20 }}>Edit Pharmacy</span>
        <IconButton onClick={handleEditClose} size="small" sx={{ color: '#c6cbe3', '&:hover': { color: 'white', background: 'rgba(255,255,255,0.08)' } }}>
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: 3, pt: 0.5, pb: 1.5 }}>
        <Grid container spacing={1.5}>
          <Grid item xs={12}>
            <TextField label="Pharmacy Name" name="name" value={editPharmacy.name} onChange={handleEditChange} fullWidth InputLabelProps={{ shrink: true, style: { color: '#6b7199' } }} sx={fieldSx} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Address" name="address" value={editPharmacy.address} onChange={handleEditChange} fullWidth InputLabelProps={{ shrink: true, style: { color: '#6b7199' } }} sx={fieldSx} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Email" name="email" type="email" value={editPharmacy.email} onChange={handleEditChange} fullWidth InputLabelProps={{ shrink: true, style: { color: '#6b7199' } }} sx={fieldSx} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Phone" name="phone" value={editPharmacy.phone} onChange={handleEditChange} fullWidth InputLabelProps={{ shrink: true, style: { color: '#6b7199' } }} sx={fieldSx} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Prescription to Pick Up" name="prescription" value={editPharmacy.prescription} onChange={handleEditChange} fullWidth InputLabelProps={{ shrink: true, style: { color: '#6b7199' } }} sx={fieldSx} inputProps={{ list: 'medicine-options' }} />
          </Grid>
        </Grid>
        <datalist id="medicine-options">
          {medicineOptions.map((name, i) => (<option value={name} key={i} />))}
        </datalist>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 1.75, borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
        <Button onClick={handleEditClose} sx={{ color: '#bfc6e0', textTransform: 'none', fontWeight: 500 }}>Cancel</Button>
        <Button onClick={handleEditSave} variant="contained" color="info" disabled={!editPharmacy.name || !editPharmacy.address} sx={{ borderRadius: 2, px: 3, fontWeight: 600, boxShadow: '0 0 0 1px rgba(255,255,255,0.1) inset' }}>Save</Button>
      </DialogActions>
    </Dialog>
  );

  const ViewAllDialog = (
    <Dialog open={viewAllOpen} onClose={handleViewAllClose} maxWidth="md" fullWidth
      PaperProps={{ sx: { background: 'rgba(34, 40, 74, 0.65)', boxShadow: 24, borderRadius: 4, color: 'white', backdropFilter: 'blur(10px)', p: 4, minWidth: 400, maxWidth: 900, height: '80vh', maxHeight: '80vh', mt: '5vh' } }}
    >
      <DialogTitle sx={{ color: 'white', fontWeight: 700, fontSize: 22, pb: 2 }}>All Pharmacies</DialogTitle>
      <DialogContent sx={{ pt: 1, background: 'transparent', color: 'white', px: 2, minWidth: 400, maxHeight: 'calc(80vh - 140px)', overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingRight: 4 }}>
      {pharmacies.map((ph, idx) => (
            <Bill
        key={(ph.id || ph.name) + idx}
              name={ph.name}
              company={ph.address}
              email={ph.email}
              vat={ph.phone}
              prescription={ph.prescription}
              noGutter={idx === pharmacies.length - 1}
        onEdit={() => handleEditOpen(idx)}
        onDelete={() => {
          const next = pharmacies.filter(p => p.id !== ph.id);
          setPharmacies(next);
          try { localStorage.setItem('pharmacies', JSON.stringify(next)); } catch(_){}
          const uid = auth?.currentUser?.uid;
          if (uid) return deletePharmacy(ph.id);
        }}
            />
          ))}
        </div>
      </DialogContent>
      <DialogActions sx={{ background: 'transparent', px: 2, pb: 2 }}>
        <Button onClick={handleViewAllClose} sx={{ color: '#bfc6e0' }}>Close</Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Card id="delete-account" sx={{ height: { xs: 420, md: 520 }, display: 'flex', flexDirection: 'column' }}>
      <VuiBox display="flex" justifyContent="space-between" alignItems="center">
        <VuiTypography variant="lg" color="white" fontWeight="bold">
          Pharmacy Information
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
  <VuiBox style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        <VuiBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
      {visiblePharmacies.map((ph, idx) => (
            <Bill
        key={ph.id || ph.name}
              name={ph.name}
              company={ph.address}
              email={ph.email}
              vat={ph.phone}
              prescription={ph.prescription}
              noGutter={idx === visiblePharmacies.length - 1}
        onEdit={() => handleEditOpen(idx)}
        onDelete={() => {
          const next = pharmacies.filter(p => p.id !== ph.id);
          setPharmacies(next);
          try { localStorage.setItem('pharmacies', JSON.stringify(next)); } catch(_){}
          const uid = auth?.currentUser?.uid;
          if (uid) return deletePharmacy(ph.id);
        }}
            />
          ))}
        </VuiBox>
  {AddDialog}
  {EditDialog}
  {ViewAllDialog}
      </VuiBox>
    </Card>
  );
}

export default BillingInformation;

// No changes needed here, but ensure the Invoices (prescriptions) box does not have edit/delete buttons.
// If you have a file for Invoices/prescriptions, remove any edit/delete button logic from that file.
