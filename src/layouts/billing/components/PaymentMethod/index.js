// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiButton from "components/VuiButton";

// Images
import colors from "assets/theme/base/colors";

// Vision UI Dashboard component exemples
import Mastercard from "examples/Icons/Mastercard";
import Visa from "examples/Icons/Visa";
import React, { useEffect, useState } from "react";
import { CardElement, Elements, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { STRIPE_PUBLISHABLE_KEY } from "lib/stripeConfig";
import { auth } from "lib/firebase";
import { addPaymentMethodDoc, onPaymentMethods } from "lib/billingData";
// Stripe form (only rendered within <Elements>)
function PaymentMethodForm({ billingName, setBillingName, setError, saving, setSaving, handleClose }) {
  const stripe = useStripe();
  const elements = useElements();
  const stripeReady = Boolean(stripe && elements);

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

  const handleAddCard = async () => {
    setError("");
    if (!stripe || !elements) return;
    if (!auth || !auth.currentUser) { setError("Please sign in to add a card."); return; }
    const card = elements.getElement(CardElement);
    if (!card) return;
    setSaving(true);
    try {
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card,
        billing_details: { name: billingName || auth?.currentUser?.displayName || undefined },
      });
      if (pmError) throw new Error(pmError.message);
      const res = await fetch("/api/stripe/save-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethodId: paymentMethod.id, userId: auth?.currentUser?.uid || "anon" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to save card");
      const pm = paymentMethod.card || {};
      await addPaymentMethodDoc({
        paymentMethodId: paymentMethod.id,
        brand: pm.brand,
        last4: pm.last4,
        exp_month: pm.exp_month,
        exp_year: pm.exp_year,
        billingName: billingName || auth?.currentUser?.displayName || "",
      });
      handleClose();
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <TextField label="Name on Card" value={billingName} onChange={(e)=>setBillingName(e.target.value)} fullWidth InputLabelProps={{ shrink: true, style: { color: "#bfc6e0" } }} sx={{ ...fieldSx, mt: 1, mb: 1 }} />
      <div style={{ background: "#181a2f", borderRadius: 12, padding: 12, border: "1px solid #23244a" }}>
        <CardElement options={{ style: { base: { fontSize: '16px', color: '#e7e9f3', '::placeholder': { color: '#8a8fb2' } } } }} />
      </div>
      <DialogActions sx={{ background: "transparent", px: 0, pb: 0, pt: 2, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
        <Button onClick={handleClose} sx={{ color: "#bfc6e0" }}>Cancel</Button>
        <Button onClick={handleAddCard} variant="contained" color="info" disabled={!stripeReady || saving} sx={{ borderRadius: 2, px: 3, fontWeight: 600 }}>
          {saving ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Add Card'}
        </Button>
      </DialogActions>
    </>
  );
}

// Shell that renders list and dialog; only mounts PaymentMethodForm inside <Elements>
function PaymentMethodShell({ stripePromise, ensureStripe }) {
  const [open, setOpen] = useState(false);
  const [billingName, setBillingName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedMethods, setSavedMethods] = useState([]);

  useEffect(() => {
    if (!auth || !auth.currentUser) return; // Wait for signed-in user
    const unsub = onPaymentMethods({}, setSavedMethods);
    return () => unsub && unsub();
  }, []);

  const handleOpen = () => {
    if (typeof ensureStripe === 'function') ensureStripe();
    setBillingName("");
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setError("");
    setSaving(false);
  };

  return (
  <Card id="delete-account" sx={{ minHeight: { xs: 'auto', md: 200 }, display: 'flex', flexDirection: 'column' }}>
      <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="8px">
        <VuiTypography variant="lg" fontWeight="bold" color="white">
          Payment Methods
        </VuiTypography>
  <VuiButton
          variant="contained"
          color="info"
          onClick={handleOpen}
    style={{ background: 'rgba(32,34,64,0.7)', color: '#e0e0e0', opacity: 0.7, boxShadow: 'none', borderRadius: 12, fontWeight: 600, fontSize: 13, padding: '8px 16px', transition: 'background 0.2s', letterSpacing: 0.3 }}
        >
          ADD NEW CARD
        </VuiButton>
    </VuiBox>
  <VuiBox sx={{ flexGrow: 0 }}>
  <Grid container spacing={2}>
          {savedMethods.map((card, idx) => (
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
                  {String(card.brand || '').toLowerCase() === 'visa' ? <Visa width="25px" /> : <Mastercard width="21px" />}
                  <VuiTypography pl={2} variant="button" color="white" fontWeight="medium">
                    {card.billingName || 'Saved Card'}
                    <span style={{ color: '#aaa', fontWeight: 400, fontSize: 14, marginLeft: 12 }}>
                      {card.last4 ? `•••• •••• •••• ${card.last4}` : ''}
                    </span>
                  </VuiTypography>
                </VuiBox>
                <VuiTypography mt={1} pl={String(card.brand || '').toLowerCase() === 'visa' ? 6 : 5} variant="caption" color="white">
                  EXP: {card.exp_month?.toString().padStart(2,'0')}/{String(card.exp_year || '').toString().slice(-2)}
                </VuiTypography>
              </VuiBox>
            </Grid>
          ))}
        </Grid>
      </VuiBox>
      <Dialog
        open={open}
        onClose={handleClose}
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
        <DialogTitle sx={{ color: 'white', fontWeight: 700, fontSize: 22, pb: 2 }}>Add Payment Method</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1, background: 'transparent', color: 'white', px: 2, minWidth: 400 }}>
          {stripePromise ? (
            <Elements stripe={stripePromise}>
              <PaymentMethodForm
                billingName={billingName}
                setBillingName={setBillingName}
                setError={setError}
                saving={saving}
                setSaving={setSaving}
                handleClose={handleClose}
              />
            </Elements>
          ) : (
            <Alert severity="warning" sx={{ mt: 1 }}>
              Payments are unavailable. The Stripe script didn’t load (possibly blocked). You can still view saved cards.
            </Alert>
          )}
          {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function PaymentMethod() {
  const [stripePromise, setStripePromise] = React.useState(null);
  const ensureStripe = () => {
    if (stripePromise || !STRIPE_PUBLISHABLE_KEY) return;
    try { setStripePromise(loadStripe(STRIPE_PUBLISHABLE_KEY)); } catch (_) {}
  };
  return <PaymentMethodShell stripePromise={stripePromise} ensureStripe={ensureStripe} />;
}

export default PaymentMethod;
