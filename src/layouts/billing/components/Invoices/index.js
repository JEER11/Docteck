// @mui material components
import Card from "@mui/material/Card";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiButton from "components/VuiButton";

// Billing page components
import Invoice from "layouts/billing/components/Invoice";
import React, { useState } from "react";
// ReactDOM no longer needed; using MUI Dialogs
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";

function Invoices() {
  // Match HUB dialog input style (no inner bubbles)
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
  // Save changes in the Edit modal
  const handleEditSave = () => {
    if (editIdx == null) return;
    setPrescriptions(prev => prev.map((rx, idx) => idx === editIdx ? { ...editPrescription } : rx));
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
  // Example prescription data (restored with multiple entries)
  const [prescriptions, setPrescriptions] = useState([
    { date: "July, 01, 2025", medicine: "Amlodipine 5mg", price: "$80", info: null },
    { date: "July, 15, 2025", medicine: "Metformin 500mg", price: "$60", info: null },
    { date: "August, 01, 2025", medicine: "Atorvastatin 20mg", price: "$90", info: null },
    { date: "August, 10, 2025", medicine: "Lisinopril 10mg", price: "$70", info: null },
    { date: "August, 20, 2025", medicine: "Levothyroxine 50mcg", price: "$50", info: null },
    { date: "September, 01, 2025", medicine: "Simvastatin 40mg", price: "$85", info: null }
  ]);
  const [open, setOpen] = useState(false);
  const [newPrescription, setNewPrescription] = useState({ medicine: "", price: "", date: "", info: null });
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuIdx, setMenuIdx] = useState(null);
  const [viewAllOpen, setViewAllOpen] = useState(false);
  const MAX_VISIBLE = 5; // Show up to 5 prescriptions in the main box
  const visiblePrescriptions = prescriptions.slice(0, MAX_VISIBLE);
  const extraPrescriptions = prescriptions.length > MAX_VISIBLE ? prescriptions.slice(MAX_VISIBLE) : [];

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
  const handleAdd = () => {
    if (!newPrescription.medicine || !newPrescription.price || !newPrescription.date) return;
    setPrescriptions([
      ...prescriptions,
      { medicine: newPrescription.medicine, price: newPrescription.price, date: newPrescription.date, info: newPrescription.info }
    ]);
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
  const handleDelete = () => {
    setPrescriptions(prescriptions.filter((_, i) => i !== menuIdx));
    handleMenuClose();
  };
  const handleViewAllOpen = () => setViewAllOpen(true);
  const handleViewAllClose = () => setViewAllOpen(false);

  // Document modal state
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [docModalIdx, setDocModalIdx] = useState(null);
  const [docModalFile, setDocModalFile] = useState(null);

  // Handle Info click
  const handleInfoClick = (idx) => {
    setDocModalIdx(idx);
    setDocModalFile(prescriptions[idx]?.info || null);
    setDocModalOpen(true);
  };
  const handleDocModalClose = () => {
    setDocModalOpen(false);
    setDocModalIdx(null);
    setDocModalFile(null);
  };
  const handleDocUpload = (e) => {
    const file = e.target.files[0];
    if (!file || docModalIdx == null) return;
    // Save file to prescription
    setPrescriptions(prescriptions.map((rx, idx) => idx === docModalIdx ? { ...rx, info: file } : rx));
    setDocModalFile(file);
  };

  // Document Dialog
  const DocDialog = (
    <Dialog open={docModalOpen} onClose={handleDocModalClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { background: 'rgba(34, 40, 74, 0.65)', boxShadow: 24, borderRadius: 4, color: 'white', backdropFilter: 'blur(10px)', p: 4, minWidth: 400, maxWidth: 640 } }}
    >
      <DialogTitle sx={{ color: 'white', fontWeight: 700, fontSize: 22, pb: 2, pr: 5 }}>
        Prescription Document
        <IconButton aria-label="close" onClick={handleDocModalClose} sx={{ position: 'absolute', right: 8, top: 8, color: '#bfc6e0' }}>
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 1, background: 'transparent', color: 'white', px: 2, minWidth: 400 }}>
        {docModalFile ? (
          docModalFile.type?.startsWith('image') ? (
            <img src={URL.createObjectURL(docModalFile)} alt="Prescription" style={{ maxWidth: '100%', maxHeight: 380, borderRadius: 12, display: 'block', margin: '0 auto' }} />
          ) : docModalFile.type === 'application/pdf' ? (
            <iframe src={URL.createObjectURL(docModalFile)} title="Prescription PDF" style={{ width: '100%', height: 400, border: 'none', borderRadius: 12, background: '#222' }} />
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

  const AddDialog = (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { background: 'rgba(34, 40, 74, 0.65)', boxShadow: 24, borderRadius: 4, color: 'white', backdropFilter: 'blur(10px)', p: 4, minWidth: 400, maxWidth: 600 } }}
    >
      <DialogTitle sx={{ color: 'white', fontWeight: 700, fontSize: 22, pb: 2 }}>Add Prescription</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1, background: 'transparent', color: 'white', px: 2, minWidth: 400 }}>
        <TextField label="Medicine Name & mg" name="medicine" value={newPrescription.medicine} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }} sx={{ ...fieldSx, mt: 1, mb: 1 }} inputProps={{ list: 'medicine-options' }} />
        <datalist id="medicine-options">
          {medicineOptions.map((name, i) => (<option value={name} key={i} />))}
        </datalist>
        <TextField label="Monthly Price ($)" name="price" type="text" value={newPrescription.price} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }} sx={{ ...fieldSx, mb: 1 }} />
        <TextField label="Pick-up Date" name="date" type="date" value={newPrescription.date} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }} sx={{ ...fieldSx, mb: 1 }} />
        <VuiBox mt={1}>
          <VuiTypography color="white" sx={{ fontSize: 14, mb: 0.5, opacity: 0.8 }}>Prescription Info</VuiTypography>
          <input name="info" type="file" accept="application/pdf,image/*" onChange={handleChange} style={{ color: '#fff' }} />
        </VuiBox>
      </DialogContent>
      <DialogActions sx={{ background: 'transparent', px: 2, pb: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <Button onClick={handleClose} sx={{ color: '#bfc6e0' }}>Cancel</Button>
        <Button onClick={handleAdd} variant="contained" color="info" disabled={!newPrescription.medicine || !newPrescription.price || !newPrescription.date} sx={{ borderRadius: 2, px: 3, fontWeight: 600 }}>Add</Button>
      </DialogActions>
    </Dialog>
  );

  const EditDialog = (
    <Dialog open={editIdx !== null} onClose={handleEditClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { background: 'rgba(34, 40, 74, 0.65)', boxShadow: 24, borderRadius: 4, color: 'white', backdropFilter: 'blur(10px)', p: 4, minWidth: 400, maxWidth: 600 } }}
    >
      <DialogTitle sx={{ color: 'white', fontWeight: 700, fontSize: 22, pb: 2 }}>Edit Prescription</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1, background: 'transparent', color: 'white', px: 2, minWidth: 400 }}>
        <TextField label="Medicine Name & mg" name="medicine" value={editPrescription.medicine} onChange={handleEditChange} fullWidth InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }} sx={{ ...fieldSx, mt: 1, mb: 1 }} inputProps={{ list: 'medicine-options' }} />
        <datalist id="medicine-options">
          {medicineOptions.map((name, i) => (<option value={name} key={i} />))}
        </datalist>
        <TextField label="Monthly Price ($)" name="price" type="text" value={editPrescription.price} onChange={handleEditChange} fullWidth InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }} sx={{ ...fieldSx, mb: 1 }} />
        <TextField label="Pick-up Date" name="date" type="date" value={editPrescription.date} onChange={handleEditChange} fullWidth InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }} sx={{ ...fieldSx, mb: 1 }} />
        <VuiBox mt={1}>
          <VuiTypography color="white" sx={{ fontSize: 14, mb: 0.5, opacity: 0.8 }}>Prescription Info</VuiTypography>
          <input name="info" type="file" accept="application/pdf,image/*" onChange={handleEditChange} style={{ color: '#fff' }} />
        </VuiBox>
      </DialogContent>
      <DialogActions sx={{ background: 'transparent', px: 2, pb: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <Button onClick={handleEditClose} sx={{ color: '#bfc6e0' }}>Cancel</Button>
        <Button onClick={handleEditSave} variant="contained" color="info" disabled={!editPrescription.medicine || !editPrescription.price || !editPrescription.date} sx={{ borderRadius: 2, px: 3, fontWeight: 600 }}>Save</Button>
      </DialogActions>
    </Dialog>
  );

  const ViewAllDialog = (
    <Dialog open={viewAllOpen} onClose={handleViewAllClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { background: 'rgba(34, 40, 74, 0.65)', boxShadow: 24, borderRadius: 4, color: 'white', backdropFilter: 'blur(10px)', p: 4, minWidth: 400, maxWidth: 640 } }}
    >
      <DialogTitle sx={{ color: 'white', fontWeight: 700, fontSize: 22, pb: 2 }}>All Prescriptions</DialogTitle>
      <DialogContent sx={{ pt: 1, background: 'transparent', color: 'white', px: 2, minWidth: 400 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {prescriptions.map((rx, idx) => (
            <Invoice
              key={rx.medicine + rx.date + idx}
              date={rx.date}
              medicine={rx.medicine}
              price={rx.price}
              info={rx.info}
              noGutter={idx === prescriptions.length - 1}
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
