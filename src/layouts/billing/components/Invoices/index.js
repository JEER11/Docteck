// @mui material components
import Card from "@mui/material/Card";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiButton from "components/VuiButton";

// Billing page components
import Invoice from "layouts/billing/components/Invoice";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";

function Invoices() {
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

  // Render document modal
  const DocModal = docModalOpen && (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.45)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      backdropFilter: 'blur(6px)'
    }}>
      <div style={{
        background: 'rgba(34,34,34,0.92)',
        color: '#fff',
        padding: '36px 32px 32px 32px',
        borderRadius: 20,
        minWidth: 340,
        maxWidth: 420,
        width: '100%',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 8px 32px 0 rgba(0,0,0,0.5)',
        border: '2.5px solid #fff',
        position: 'relative',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <button
          onClick={handleDocModalClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 20,
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: 26,
            cursor: 'pointer',
            fontWeight: 700,
            opacity: 0.85,
            transition: 'opacity 0.2s',
          }}
          aria-label="Close"
        >×</button>
        {docModalFile ? (
          <>
            <VuiTypography variant="h6" color="white" mb={2} style={{ textAlign: 'center', fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Prescription Document</VuiTypography>
            {docModalFile.type?.startsWith('image') ? (
              <img src={URL.createObjectURL(docModalFile)} alt="Prescription" style={{ maxWidth: 320, maxHeight: 340, borderRadius: 12, margin: '0 auto', display: 'block', boxShadow: '0 2px 16px #0008' }} />
            ) : docModalFile.type === 'application/pdf' ? (
              <iframe src={URL.createObjectURL(docModalFile)} title="Prescription PDF" style={{ width: 320, height: 340, border: 'none', borderRadius: 12, background: '#222', boxShadow: '0 2px 16px #0008' }} />
            ) : (
              <VuiTypography color="white" style={{ textAlign: 'center', margin: '24px 0' }}>Cannot preview this file type.</VuiTypography>
            )}
          </>
        ) : (
          <>
            <VuiTypography variant="h6" color="white" mb={2} style={{ textAlign: 'center', fontWeight: 700, fontSize: 22, marginBottom: 18 }}>No document attached</VuiTypography>
            <label style={{ color: '#fff', marginBottom: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleDocUpload}
                style={{
                  display: 'block',
                  margin: '0 0 18px 0',
                  background: 'rgba(51,51,51,0.8)',
                  color: '#fff',
                  borderRadius: 8,
                  border: '1.5px solid #fff',
                  padding: '8px 12px',
                  fontSize: 15,
                  width: '100%',
                  maxWidth: 260,
                  outline: 'none',
                  cursor: 'pointer',
                }}
              />
              <VuiButton
                variant="contained"
                color="info"
                component="span"
                style={{
                  fontWeight: 700,
                  fontSize: 17,
                  borderRadius: 12,
                  padding: '12px 0',
                  width: 200,
                  marginTop: 2,
                  boxShadow: 'none',
                  letterSpacing: 0.5,
                }}
              >Add Document</VuiButton>
            </label>
          </>
        )}
      </div>
    </div>
  );
  const medicineOptions = [
    "Atorvastatin 20mg", "Lisinopril 10mg", "Metformin 500mg", "Levothyroxine 50mcg", "Amlodipine 5mg", "Simvastatin 40mg", "Omeprazole 20mg", "Losartan 50mg", "Gabapentin 300mg", "Hydrochlorothiazide 25mg", "Sertraline 50mg", "Furosemide 40mg", "Metoprolol 50mg", "Pantoprazole 40mg", "Escitalopram 10mg", "Rosuvastatin 10mg", "Tamsulosin 0.4mg", "Alprazolam 0.5mg", "Citalopram 20mg", "Ciprofloxacin 500mg", "Duloxetine 30mg", "Fluoxetine 20mg", "Atenolol 50mg", "Clopidogrel 75mg", "Doxycycline 100mg", "Enalapril 10mg", "Glipizide 5mg", "Insulin Glargine 100U/mL", "Lamotrigine 100mg", "Lansoprazole 30mg", "Levetiracetam 500mg", "Levocetirizine 5mg", "Loratadine 10mg", "Meloxicam 15mg", "Montelukast 10mg", "Naproxen 500mg", "Olmesartan 20mg", "Paroxetine 20mg", "Pioglitazone 30mg", "Pravastatin 40mg", "Prednisone 20mg", "Pregabalin 75mg", "Propranolol 40mg", "Quetiapine 100mg", "Ranitidine 150mg", "Rivaroxaban 20mg", "Sitagliptin 100mg", "Spironolactone 25mg", "Trazodone 50mg", "Valsartan 80mg", "Venlafaxine 75mg", "Warfarin 5mg", "Zolpidem 10mg", "Amoxicillin 500mg", "Azithromycin 250mg", "Baclofen 10mg", "Bisoprolol 5mg", "Budesonide 200mcg", "Carvedilol 12.5mg", "Cetirizine 10mg", "Chlorthalidone 25mg", "Clonazepam 1mg", "Clonidine 0.1mg", "Colchicine 0.6mg", "Desvenlafaxine 50mg", "Diazepam 5mg", "Digoxin 0.25mg", "Diphenhydramine 25mg", "Divalproex 250mg", "Donepezil 10mg", "Dulcolax 5mg", "Empagliflozin 10mg", "Esomeprazole 40mg", "Famotidine 20mg", "Finasteride 5mg", "Fluticasone 50mcg", "Folic Acid 1mg", "Gliclazide 80mg", "Glyburide 5mg", "Hydralazine 25mg", "Hydroxyzine 25mg", "Indapamide 2.5mg", "Irbesartan 150mg", "Isosorbide 30mg", "Ketorolac 10mg", "Labetalol 100mg", "Lactulose 10g", "Lidocaine 5%", "Linagliptin 5mg", "Liraglutide 1.2mg", "Magnesium Oxide 400mg", "Memantine 10mg", "Methotrexate 2.5mg", "Methylprednisolone 4mg", "Mirtazapine 15mg", "Mometasone 50mcg", "Nebivolol 5mg", "Nitrofurantoin 100mg", "Olanzapine 10mg", "Ondansetron 4mg", "Oxcarbazepine 300mg", "Phenytoin 100mg", "Pramipexole 0.25mg", "Rabeprazole 20mg", "Ramipril 5mg", "Risperidone 2mg", "Saxagliptin 5mg", "Sildenafil 50mg", "Sotalol 80mg", "Terazosin 5mg", "Topiramate 25mg", "Tramadol 50mg", "Valacyclovir 500mg", "Valsartan 160mg", "Vildagliptin 50mg"
  ];

  const AddModal = (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 99999 }}>
      <div style={{ background: "rgba(34,34,34,0.85)", color: "#fff", padding: 32, borderRadius: 16, minWidth: 340, boxShadow: "0 8px 32px 0 rgba(0,0,0,0.5)", border: "2px solid #fff", position: "relative", backdropFilter: "blur(4px)" }}>
        <button onClick={handleClose} style={{ position: "absolute", top: 12, right: 12, background: "transparent", border: "none", color: "#fff", fontSize: 22, cursor: "pointer" }} aria-label="Close">×</button>
        <VuiTypography variant="h6" color="white" mb={2} style={{ textAlign: "center" }}>Add Prescription</VuiTypography>
        <input
          name="medicine"
          placeholder="Medicine Name & mg"
          value={newPrescription.medicine}
          onChange={handleChange}
          list="medicine-options"
          style={{ width: "100%", marginBottom: 12, padding: 10, borderRadius: 8, border: "1px solid #fff", background: "rgba(51,51,51,0.8)", color: "#fff" }}
        />
        <datalist id="medicine-options">
          {medicineOptions.map((name, i) => (
            <option value={name} key={i} />
          ))}
        </datalist>
        <input
          name="price"
          type="text"
          placeholder="Monthly Price ($)"
          value={newPrescription.price}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 12, padding: 10, borderRadius: 8, border: "1px solid #fff", background: "rgba(51,51,51,0.8)", color: "#fff" }}
        />
        <input
          name="date"
          type="date"
          placeholder="Pick-up Date"
          value={newPrescription.date}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 12, padding: 10, borderRadius: 8, border: "1px solid #fff", background: "rgba(51,51,51,0.8)", color: "#fff" }}
        />
        <label style={{ color: "#fff", marginBottom: 8, display: "block" }}>Prescription Info
          <input
            name="info"
            type="file"
            accept="application/pdf"
            onChange={handleChange}
            style={{ display: "block", marginTop: 4, color: "#fff" }}
          />
        </label>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <VuiButton variant="outlined" color="secondary" onClick={handleClose}>Cancel</VuiButton>
          <VuiButton variant="contained" color="info" onClick={handleAdd} disabled={!newPrescription.medicine || !newPrescription.price || !newPrescription.date}>
            Add
          </VuiButton>
        </div>
      </div>
    </div>
  );

  const EditModal = (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }}>
      <div style={{ background: 'rgba(34,34,34,0.85)', color: '#fff', padding: 32, borderRadius: 16, minWidth: 340, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.5)', border: '2px solid #fff', position: 'relative', backdropFilter: 'blur(4px)' }}>
        <button onClick={handleEditClose} style={{ position: 'absolute', top: 12, right: 12, background: 'transparent', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }} aria-label="Close">×</button>
        <VuiTypography variant="h6" color="white" mb={2} style={{ textAlign: 'center' }}>Edit Prescription</VuiTypography>
        <input
          name="medicine"
          placeholder="Medicine Name & mg"
          value={editPrescription.medicine}
          onChange={handleEditChange}
          list="medicine-options"
          style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #fff', background: 'rgba(51,51,51,0.8)', color: '#fff' }}
        />
        <datalist id="medicine-options">
          {medicineOptions.map((name, i) => (
            <option value={name} key={i} />
          ))}
        </datalist>
        <input
          name="price"
          type="text"
          placeholder="Monthly Price ($)"
          value={editPrescription.price}
          onChange={handleEditChange}
          style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #fff', background: 'rgba(51,51,51,0.8)', color: '#fff' }}
        />
        <input
          name="date"
          type="date"
          placeholder="Pick-up Date"
          value={editPrescription.date}
          onChange={handleEditChange}
          style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #fff', background: 'rgba(51,51,51,0.8)', color: '#fff' }}
        />
        <label style={{ color: '#fff', marginBottom: 8, display: 'block' }}>Prescription Info
          <input
            name="info"
            type="file"
            accept="application/pdf"
            onChange={handleEditChange}
            style={{ display: 'block', marginTop: 4, color: '#fff' }}
          />
        </label>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <VuiButton variant="outlined" color="secondary" onClick={handleEditClose}>Cancel</VuiButton>
          <VuiButton variant="contained" color="info" onClick={handleEditSave} disabled={!editPrescription.medicine || !editPrescription.price || !editPrescription.date}>
            Save
          </VuiButton>
        </div>
      </div>
    </div>
  );

  const ViewAllModal = (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }}>
      <div style={{ background: 'rgba(34,34,34,0.95)', color: '#fff', padding: 32, borderRadius: 16, minWidth: 340, maxWidth: 480, maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.5)', border: '2px solid #fff', position: 'relative', backdropFilter: 'blur(4px)' }}>
        <button onClick={handleViewAllClose} style={{ position: 'absolute', top: 12, right: 12, background: 'transparent', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }} aria-label="Close">×</button>
        <VuiTypography variant="h6" color="white" mb={2} style={{ textAlign: 'center' }}>All Prescriptions</VuiTypography>
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
      </div>
    </div>
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
      {open && (typeof document !== "undefined" && document.body
        ? ReactDOM.createPortal(AddModal, document.body)
        : AddModal)}
      {editIdx !== null && (typeof document !== "undefined" && document.body
        ? ReactDOM.createPortal(EditModal, document.body)
        : EditModal)}
      {viewAllOpen && (typeof document !== "undefined" && document.body
        ? ReactDOM.createPortal(ViewAllModal, document.body)
        : ViewAllModal)}
      {docModalOpen && (typeof document !== "undefined" && document.body
        ? ReactDOM.createPortal(DocModal, document.body)
        : DocModal)}
    </Card>
  );
}

export default Invoices;
