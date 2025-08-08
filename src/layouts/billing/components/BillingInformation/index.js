// @mui material components
import Card from "@mui/material/Card";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

// Billing page components
import Bill from "layouts/billing/components/Bill";
import VuiButton from "components/VuiButton";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";

function BillingInformation() {
  // Example pharmacy data
  const [pharmacies, setPharmacies] = useState([
    {
      name: "CVS Pharmacy",
      address: "123 Main St, Springfield, IL",
      email: "contact@cvs.com",
      phone: "(217) 555-1234",
      prescription: "Atorvastatin 20mg",
    },
    {
      name: "Walgreens",
      address: "456 Oak Ave, Springfield, IL",
      email: "info@walgreens.com",
      phone: "(217) 555-5678",
      prescription: "Lisinopril 10mg",
    },
    {
      name: "Rite Aid",
      address: "789 Pine Rd, Springfield, IL",
      email: "help@riteaid.com",
      phone: "(217) 555-9012",
      prescription: "Metformin 500mg",
    },
  ]);
  const [open, setOpen] = useState(false);
  const [newPharmacy, setNewPharmacy] = useState({ name: "", address: "", email: "", phone: "", prescription: "" });
  const [editIdx, setEditIdx] = useState(null);
  const [editPharmacy, setEditPharmacy] = useState({ name: '', address: '', email: '', phone: '', prescription: '' });
  const [viewAllOpen, setViewAllOpen] = useState(false);
  const MAX_VISIBLE = 3; // Show up to 3 pharmacies in the main box
  const visiblePharmacies = pharmacies.slice(0, MAX_VISIBLE);
  const extraPharmacies = pharmacies.length > MAX_VISIBLE ? pharmacies.slice(MAX_VISIBLE) : [];

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
  const handleAdd = () => {
    if (!newPharmacy.name || !newPharmacy.address || !newPharmacy.email || !newPharmacy.phone || !newPharmacy.prescription) return;
    setPharmacies([
      ...pharmacies,
      { ...newPharmacy }
    ]);
    handleClose();
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
  const handleEditSave = () => {
    if (!editPharmacy.name || !editPharmacy.address || !editPharmacy.email || !editPharmacy.phone || !editPharmacy.prescription) return;
    setPharmacies(pharmacies.map((ph, idx) => idx === editIdx ? { ...editPharmacy } : ph));
    handleEditClose();
  };

  const handleViewAllOpen = () => setViewAllOpen(true);
  const handleViewAllClose = () => setViewAllOpen(false);

  const AddModal = (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 99999 }}>
      <div style={{ background: "rgba(34,34,34,0.85)", color: "#fff", padding: 32, borderRadius: 16, minWidth: 340, boxShadow: "0 8px 32px 0 rgba(0,0,0,0.5)", border: "2px solid #fff", position: "relative", backdropFilter: "blur(4px)" }}>
        <button onClick={handleClose} style={{ position: "absolute", top: 12, right: 12, background: "transparent", border: "none", color: "#fff", fontSize: 22, cursor: "pointer" }} aria-label="Close">×</button>
        <VuiTypography variant="h6" color="white" mb={2} style={{ textAlign: "center" }}>Add Pharmacy</VuiTypography>
        <input
          name="name"
          placeholder="Pharmacy Name"
          value={newPharmacy.name}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 12, padding: 10, borderRadius: 8, border: "1px solid #fff", background: "rgba(51,51,51,0.8)", color: "#fff" }}
        />
        <input
          name="address"
          placeholder="Address"
          value={newPharmacy.address}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 12, padding: 10, borderRadius: 8, border: "1px solid #fff", background: "rgba(51,51,51,0.8)", color: "#fff" }}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={newPharmacy.email}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 12, padding: 10, borderRadius: 8, border: "1px solid #fff", background: "rgba(51,51,51,0.8)", color: "#fff" }}
        />
        <input
          name="phone"
          placeholder="Phone"
          value={newPharmacy.phone}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 12, padding: 10, borderRadius: 8, border: "1px solid #fff", background: "rgba(51,51,51,0.8)", color: "#fff" }}
        />
        <input
          name="prescription"
          placeholder="Prescription to Pick Up"
          value={newPharmacy.prescription}
          onChange={handleChange}
          list="medicine-options"
          style={{ width: "100%", marginBottom: 12, padding: 10, borderRadius: 8, border: "1px solid #fff", background: "rgba(51,51,51,0.8)", color: "#fff" }}
        />
        <datalist id="medicine-options">
          {medicineOptions.map((name, i) => (
            <option value={name} key={i} />
          ))}
        </datalist>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <VuiButton variant="outlined" color="secondary" onClick={handleClose}>Cancel</VuiButton>
          <VuiButton variant="contained" color="info" onClick={handleAdd} disabled={!newPharmacy.name || !newPharmacy.address || !newPharmacy.email || !newPharmacy.phone || !newPharmacy.prescription}>
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
        <VuiTypography variant="h6" color="white" mb={2} style={{ textAlign: 'center' }}>Edit Pharmacy</VuiTypography>
        <input
          name="name"
          placeholder="Pharmacy Name"
          value={editPharmacy.name}
          onChange={handleEditChange}
          style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #fff', background: 'rgba(51,51,51,0.8)', color: '#fff' }}
        />
        <input
          name="address"
          placeholder="Address"
          value={editPharmacy.address}
          onChange={handleEditChange}
          style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #fff', background: 'rgba(51,51,51,0.8)', color: '#fff' }}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={editPharmacy.email}
          onChange={handleEditChange}
          style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #fff', background: 'rgba(51,51,51,0.8)', color: '#fff' }}
        />
        <input
          name="phone"
          placeholder="Phone"
          value={editPharmacy.phone}
          onChange={handleEditChange}
          style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #fff', background: 'rgba(51,51,51,0.8)', color: '#fff' }}
        />
        <input
          name="prescription"
          placeholder="Prescription to Pick Up"
          value={editPharmacy.prescription}
          onChange={handleEditChange}
          list="medicine-options"
          style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #fff', background: 'rgba(51,51,51,0.8)', color: '#fff' }}
        />
        <datalist id="medicine-options">
          {medicineOptions.map((name, i) => (
            <option value={name} key={i} />
          ))}
        </datalist>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <VuiButton variant="outlined" color="secondary" onClick={handleEditClose}>Cancel</VuiButton>
          <VuiButton variant="contained" color="info" onClick={handleEditSave} disabled={!editPharmacy.name || !editPharmacy.address || !editPharmacy.email || !editPharmacy.phone || !editPharmacy.prescription}>
            Save
          </VuiButton>
        </div>
      </div>
    </div>
  );

  const ViewAllModal = (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }}>
      <div style={{ background: 'rgba(34,34,34,0.95)', color: '#fff', padding: 32, borderRadius: 16, minWidth: 340, maxWidth: 600, maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.5)', border: '2px solid #fff', position: 'relative', backdropFilter: 'blur(4px)' }}>
        <button onClick={handleViewAllClose} style={{ position: 'absolute', top: 12, right: 12, background: 'transparent', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }} aria-label="Close">×</button>
        <VuiTypography variant="h6" color="white" mb={2} style={{ textAlign: 'center' }}>All Pharmacies</VuiTypography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {pharmacies.map((ph, idx) => (
            <Bill
              key={ph.name + idx}
              name={ph.name}
              company={ph.address}
              email={ph.email}
              vat={ph.phone}
              prescription={ph.prescription}
              noGutter={idx === pharmacies.length - 1}
              onEdit={() => handleEditOpen(idx)}
              onDelete={() => setPharmacies(pharmacies.filter((_, i) => i !== idx))}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Card id="delete-account">
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
      <VuiBox style={{ maxHeight: 420, overflowY: pharmacies.length > MAX_VISIBLE ? 'auto' : 'visible', transition: 'max-height 0.2s', minHeight: 0 }}>
        <VuiBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          {visiblePharmacies.map((ph, idx) => (
            <Bill
              key={ph.name}
              name={ph.name}
              company={ph.address}
              email={ph.email}
              vat={ph.phone}
              prescription={ph.prescription}
              noGutter={idx === visiblePharmacies.length - 1}
              onEdit={() => handleEditOpen(idx)}
              onDelete={() => setPharmacies(pharmacies.filter((_, i) => i !== idx))}
            />
          ))}
        </VuiBox>
        {open && (typeof document !== "undefined" && document.body
          ? require("react-dom").createPortal(AddModal, document.body)
          : AddModal)}
        {editIdx !== null && (typeof document !== "undefined" && document.body
          ? require("react-dom").createPortal(EditModal, document.body)
          : EditModal)}
        {viewAllOpen && (typeof document !== "undefined" && document.body
          ? require("react-dom").createPortal(ViewAllModal, document.body)
          : ViewAllModal)}
      </VuiBox>
    </Card>
  );
}

export default BillingInformation;

// No changes needed here, but ensure the Invoices (prescriptions) box does not have edit/delete buttons.
// If you have a file for Invoices/prescriptions, remove any edit/delete button logic from that file.
