// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiButton from "components/VuiButton";

// Vision UI Dashboard React base styles
import borders from "assets/theme/base/borders";

// Images
import colors from "assets/theme/base/colors";

// Vision UI Dashboard component exemples
import Mastercard from "examples/Icons/Mastercard";
import Visa from "examples/Icons/Visa";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useBilling } from "context/BillingContext";

function PaymentMethod() {
  const { cards, addCard } = useBilling();
  const { grey } = colors;

  const [open, setOpen] = useState(false);
  const [newCard, setNewCard] = useState({ cardId: "", name: "", validThru: "", cvv: "", type: "Mastercard" });
  const [editIndex, setEditIndex] = useState(null);

  const handleOpen = () => {
    setEditIndex(null);
  setNewCard({ cardId: "", name: "", validThru: "", cvv: "", type: "Mastercard" });
    setOpen(true);
  };
  const handleEdit = (idx) => {
    const c = cards[idx];
    setEditIndex(idx);
    setNewCard({
      cardId: c.cardId || "",
      name: c.name || "",
      validThru: c.validThru || "",
      cvv: c.cvv || "",
      type: c.type || "Mastercard",
    });
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setEditIndex(null);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
  setNewCard({ ...newCard, [name]: value });
  };
  const handleAddOrEdit = () => {
    if (!newCard.cardId || !newCard.name || !newCard.validThru || !newCard.cvv) return;
    // For demo, append a new card; no edit support for now
    addCard({ ...newCard });
    setNewCard({ cardId: "", name: "", validThru: "", cvv: "", type: "Mastercard" });
    handleClose();
  };

  // List of common medicine and prescription names (no mg, no insurance)
  const medicineNames = [
    "Atorvastatin", "Lisinopril", "Metformin", "Levothyroxine", "Amlodipine", "Simvastatin", "Omeprazole", "Losartan", "Gabapentin", "Hydrochlorothiazide", "Sertraline", "Furosemide", "Metoprolol", "Pantoprazole", "Escitalopram", "Rosuvastatin", "Tamsulosin", "Alprazolam", "Citalopram", "Ciprofloxacin", "Duloxetine", "Fluoxetine", "Atenolol", "Clopidogrel", "Doxycycline", "Enalapril", "Glipizide", "Insulin Glargine", "Lamotrigine", "Lansoprazole", "Levetiracetam", "Levocetirizine", "Loratadine", "Meloxicam", "Montelukast", "Naproxen", "Olmesartan", "Paroxetine", "Pioglitazone", "Pravastatin", "Prednisone", "Pregabalin", "Propranolol", "Quetiapine", "Ranitidine", "Rivaroxaban", "Sitagliptin", "Spironolactone", "Trazodone", "Valsartan", "Venlafaxine", "Warfarin", "Zolpidem", "Amoxicillin", "Azithromycin", "Baclofen", "Bisoprolol", "Budesonide", "Carvedilol", "Cetirizine", "Chlorthalidone", "Clonazepam", "Clonidine", "Colchicine", "Desvenlafaxine", "Diazepam", "Digoxin", "Diphenhydramine", "Divalproex", "Donepezil", "Dulcolax", "Empagliflozin", "Esomeprazole", "Famotidine", "Finasteride", "Fluticasone", "Folic Acid", "Gliclazide", "Glyburide", "Hydralazine", "Hydroxyzine", "Indapamide", "Irbesartan", "Isosorbide", "Ketorolac", "Labetalol", "Lactulose", "Lidocaine", "Linagliptin", "Liraglutide", "Magnesium Oxide", "Memantine", "Methotrexate", "Methylprednisolone", "Mirtazapine", "Mometasone", "Nebivolol", "Nitrofurantoin", "Olanzapine", "Ondansetron", "Oxcarbazepine", "Phenytoin", "Pramipexole", "Rabeprazole", "Ramipril", "Risperidone", "Saxagliptin", "Sildenafil", "Sotalol", "Terazosin", "Topiramate", "Tramadol", "Valacyclovir", "Valsartan", "Vildagliptin", "Insulin Lispro", "Insulin Aspart", "Insulin Detemir", "Insulin Degludec", "Insulin NPH", "Insulin Regular", "Insulin Glulisine", "Insulin Isophane", "Insulin Zinc", "Insulin Lente", "Insulin Ultralente", "Insulin Semilente", "Insulin Protamine", "Insulin Pork", "Insulin Beef", "Insulin Human", "Insulin Analog", "Insulin Mixture", "Insulin Combination", "Insulin Solution", "Insulin Suspension", "Insulin Injection", "Insulin Cartridge", "Insulin Pen", "Insulin Pump", "Insulin Syringe", "Insulin Vial", "Insulin Device", "Insulin Therapy", "Insulin Treatment", "Insulin Prescription"
  ];

  // Modal content as a separate component for portal
  const InsuranceModal = (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 99999 }}>
      <div style={{ background: "rgba(34,34,34,0.85)", color: "#fff", padding: 32, borderRadius: 16, minWidth: 340, boxShadow: "0 8px 32px 0 rgba(0,0,0,0.5)", border: "2px solid #fff", position: "relative", backdropFilter: "blur(4px)" }}>
        <button onClick={handleClose} style={{ position: "absolute", top: 12, right: 12, background: "transparent", border: "none", color: "#fff", fontSize: 22, cursor: "pointer" }} aria-label="Close">×</button>
        <VuiTypography variant="h6" color="white" mb={2} style={{ textAlign: "center" }}>{editIndex !== null ? "Edit Card" : "Add Card"}</VuiTypography>
        <input
          name="name"
          placeholder="Card Name"
          value={newCard.name}
          onChange={handleChange}
          list="medicine-names"
          style={{ width: "100%", marginBottom: 12, padding: 10, borderRadius: 8, border: "1px solid #fff", background: "rgba(51,51,51,0.8)", color: "#fff" }}
        />
        <datalist id="medicine-names">
          {medicineNames.map((name, i) => (
            <option value={name} key={i} />
          ))}
        </datalist>
        <input name="cardId" placeholder="Card Number" value={newCard.cardId} onChange={handleChange} style={{ width: "100%", marginBottom: 12, padding: 10, borderRadius: 8, border: "1px solid #fff", background: "rgba(51,51,51,0.8)", color: "#fff" }} />
        <input name="validThru" placeholder="Valid Thru (MM/YY)" value={newCard.validThru} onChange={handleChange} style={{ width: "100%", marginBottom: 12, padding: 10, borderRadius: 8, border: "1px solid #fff", background: "rgba(51,51,51,0.8)", color: "#fff" }} />
        <input name="cvv" placeholder="CVV" value={newCard.cvv} onChange={handleChange} style={{ width: "100%", marginBottom: 12, padding: 10, borderRadius: 8, border: "1px solid #fff", background: "rgba(51,51,51,0.8)", color: "#fff" }} />
        <select name="type" value={newCard.type} onChange={handleChange} style={{ width: "100%", marginBottom: 16, padding: 10, borderRadius: 8, border: "1px solid #fff", background: "rgba(51,51,51,0.8)", color: "#fff" }}>
          <option value="Mastercard">Mastercard</option>
          <option value="Visa">Visa</option>
        </select>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <VuiButton variant="outlined" color="secondary" onClick={handleClose}>Cancel</VuiButton>
          <VuiButton variant="contained" color="info" onClick={handleAddOrEdit} disabled={!newCard.cardId || !newCard.name || !newCard.validThru || !newCard.cvv}>
            {editIndex !== null ? "Save" : "Add"}
          </VuiButton>
        </div>
      </div>
    </div>
  );

  return (
    <Card id="delete-account">
      <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="32px">
        <VuiTypography variant="lg" fontWeight="bold" color="white">
          Payment Methods
        </VuiTypography>
        <VuiButton variant="contained" color="info" onClick={handleOpen} style={{ background: 'rgba(32,34,64,0.7)', color: '#e0e0e0', opacity: 0.7, boxShadow: 'none', borderRadius: 12, fontWeight: 600, fontSize: 14, padding: '10px 24px', transition: 'background 0.2s', letterSpacing: 0.5 }}>
          ADD NEW CARD
        </VuiButton>
      </VuiBox>
      <VuiBox>
        <Grid container spacing={3}>
          {cards.map((card, idx) => (
            <Grid item xs={12} md={6} key={idx}>
              <VuiBox
                border="2px solid"
                borderRadius="20px"
                borderColor={colors.grey[600]}
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                alignItems="flex-start"
                p="22px 20px"
              >
                <VuiBox display="flex" alignItems="center" width="100%">
                  {card.type === "Mastercard" ? <Mastercard width="21px" /> : <Visa width="25px" />}
                  <VuiTypography pl={2} variant="button" color="white" fontWeight="medium">
                    {card.name}
                    <span style={{ color: '#aaa', fontWeight: 400, fontSize: 14, marginLeft: 12 }}>
                      {card.cardId ? `•••• •••• •••• ${card.cardId.slice(-4)}` : ''}
                    </span>
                  </VuiTypography>
                </VuiBox>
                <VuiTypography mt={1} pl={card.type === "Mastercard" ? 5 : 6} variant="caption" color="white">
                  EXP: {card.validThru} &nbsp;|&nbsp; CVV: {'***'}
                </VuiTypography>
              </VuiBox>
            </Grid>
          ))}
        </Grid>
      </VuiBox>
      {/* Add Card Dialog */}
      {open && (typeof document !== "undefined" && document.body
        ? ReactDOM.createPortal(
            <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 99999 }}>
              <div style={{ background: "rgba(34,34,34,0.85)", color: "#fff", padding: 32, borderRadius: 16, minWidth: 340, boxShadow: "0 8px 32px 0 rgba(0,0,0,0.5)", border: "2px solid #fff", position: "relative", backdropFilter: "blur(4px)" }}>
                <button onClick={handleClose} style={{ position: "absolute", top: 12, right: 12, background: "transparent", border: "none", color: "#fff", fontSize: 22, cursor: "pointer" }} aria-label="Close">×</button>
                <VuiTypography variant="h6" color="white" mb={2} style={{ textAlign: "center" }}>Add Card</VuiTypography>
                <input name="cardId" placeholder="Card Number" value={newCard.cardId} onChange={handleChange} style={{ width: "100%", marginBottom: 12, padding: 10, borderRadius: 8, border: "1px solid #fff", background: "rgba(51,51,51,0.8)", color: "#fff" }} />
                <input name="name" placeholder="Card Name" value={newCard.name} onChange={handleChange} style={{ width: "100%", marginBottom: 12, padding: 10, borderRadius: 8, border: "1px solid #fff", background: "rgba(51,51,51,0.8)", color: "#fff" }} />
                <input name="validThru" placeholder="Valid Thru (MM/YY)" value={newCard.validThru || ''} onChange={handleChange} style={{ width: "100%", marginBottom: 12, padding: 10, borderRadius: 8, border: "1px solid #fff", background: "rgba(51,51,51,0.8)", color: "#fff" }} />
                <input name="cvv" placeholder="CVV" value={newCard.cvv || ''} onChange={handleChange} style={{ width: "100%", marginBottom: 12, padding: 10, borderRadius: 8, border: "1px solid #fff", background: "rgba(51,51,51,0.8)", color: "#fff" }} />
                <select name="type" value={newCard.type} onChange={handleChange} style={{ width: "100%", marginBottom: 16, padding: 10, borderRadius: 8, border: "1px solid #fff", background: "rgba(51,51,51,0.8)", color: "#fff" }}>
                  <option value="Mastercard">Mastercard</option>
                  <option value="Visa">Visa</option>
                </select>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                  <VuiButton variant="outlined" color="secondary" onClick={handleClose}>Cancel</VuiButton>
                  <VuiButton variant="contained" color="info" onClick={() => { addCard({ ...newCard }); handleClose(); }} disabled={!newCard.cardId || !newCard.name || !newCard.validThru || !newCard.cvv}>
                    Add
                  </VuiButton>
                </div>
              </div>
            </div>,
            document.body
          )
        : null)}
    </Card>
  );
}

export default PaymentMethod;
