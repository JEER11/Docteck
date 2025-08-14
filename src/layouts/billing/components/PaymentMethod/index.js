// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";

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

  // Match Pharmacy dialog input style
  const fieldSx = {
    width: "100%",
    ml: 0,
    background: "#181a2f",
    borderRadius: 1.5,
    "& .MuiOutlinedInput-notchedOutline": { border: "1px solid #23244a" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#2f3570" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6a6afc" },
    "& .MuiInputBase-input": { color: "#e7e9f3", fontSize: 14, py: 1, background: "transparent" },
  };

  const AddEditDialog = (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: "rgba(34, 40, 74, 0.65)",
          boxShadow: 24,
          borderRadius: 4,
          color: "white",
          backdropFilter: "blur(10px)",
          p: 4,
          minWidth: 400,
          maxWidth: 600,
        },
      }}
    >
      <DialogTitle sx={{ color: "white", fontWeight: 700, fontSize: 22, pb: 2 }}>
        {editIndex !== null ? "Edit Card" : "Add Card"}
      </DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 1, background: "transparent", color: "white", px: 2, minWidth: 400 }}>
        <TextField label="Card Number" name="cardId" value={newCard.cardId} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true, style: { color: "#bfc6e0" } }} sx={{ ...fieldSx, mt: 1, mb: 1 }} />
        <TextField label="Card Name" name="name" value={newCard.name} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true, style: { color: "#bfc6e0" } }} sx={{ ...fieldSx, mb: 1 }} />
        <TextField label="Valid Thru (MM/YY)" name="validThru" value={newCard.validThru} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true, style: { color: "#bfc6e0" } }} sx={{ ...fieldSx, mb: 1 }} />
        <TextField label="CVV" name="cvv" value={newCard.cvv} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true, style: { color: "#bfc6e0" } }} sx={{ ...fieldSx, mb: 1 }} />
        <TextField label="Type" name="type" value={newCard.type} onChange={handleChange} select fullWidth InputLabelProps={{ shrink: true, style: { color: "#bfc6e0" } }} sx={{ ...fieldSx, mb: 1 }}>
          <MenuItem value="Mastercard">Mastercard</MenuItem>
          <MenuItem value="Visa">Visa</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions sx={{ background: "transparent", px: 2, pb: 2, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
        <Button onClick={handleClose} sx={{ color: "#bfc6e0" }}>Cancel</Button>
        <Button onClick={handleAddOrEdit} variant="contained" color="info" disabled={!newCard.cardId || !newCard.name || !newCard.validThru || !newCard.cvv} sx={{ borderRadius: 2, px: 3, fontWeight: 600 }}>
          {editIndex !== null ? "Save" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
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
  {/* Add/Edit Card Dialog - matches Pharmacy dialog styling */}
  {AddEditDialog}
    </Card>
  );
}

export default PaymentMethod;
