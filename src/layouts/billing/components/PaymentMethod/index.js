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
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

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
import { STRIPE_PUBLISHABLE_KEY, hasStripeKey } from "lib/stripeConfig";
import { auth } from "lib/firebase";
import { addPaymentMethodDoc, onPaymentMethods, updatePaymentMethodDoc, deletePaymentMethodDoc } from "lib/billingData";
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
      <TextField label="Name on Card" value={billingName} onChange={(e)=>setBillingName(e.target.value)} fullWidth InputLabelProps={{ shrink: true, style: { color: "#6b7199" } }} sx={{ ...fieldSx, mt: 1, mb: 1 }} />
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
  const [bankName, setBankName] = useState("");
  const [network, setNetwork] = useState("visa");
  const [last4, setLast4] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedMethods, setSavedMethods] = useState([]);
  const [guestMethods, setGuestMethods] = useState(() => {
    try {
      const raw = localStorage.getItem('visualPaymentMethods') || '[]';
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (_) { return []; }
  });
  const [mode, setMode] = useState('stripe'); // 'stripe' | 'visual'
  const [hoveredId, setHoveredId] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // { id, type, ... }
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { id, paymentMethodId?, type }

  useEffect(() => {
    if (!auth || !auth.currentUser) return; // Wait for signed-in user
    const unsub = onPaymentMethods({}, setSavedMethods);
    return () => unsub && unsub();
  }, []);

  const handleOpen = () => {
    if (typeof ensureStripe === 'function') ensureStripe();
    setBillingName("");
    setBankName("");
    setNetwork("visa");
    setLast4("");
    setExpMonth("");
    setExpYear("");
    setMode('stripe');
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setError("");
    setSaving(false);
  };

  const fieldSx = {
    width: "100%",
    ml: 0,
    borderRadius: 1.5,
    '& .MuiOutlinedInput-root': {
      background: '#0a0c1a',
      '&:hover': {
        background: '#0d0f1f',
      },
    },
    "& .MuiOutlinedInput-notchedOutline": { border: "1px solid rgba(255, 255, 255, 0.06)" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255, 255, 255, 0.12)" },
    "& .Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(106, 106, 252, 0.4)" },
    "& .MuiInputBase-input": { color: "#e7e9f3", fontSize: 14, py: 1, background: "transparent" },
    "& .MuiSelect-select": { background: "transparent" },
    "& .MuiInputLabel-root": {
      color: "#6b7199",
      "&.Mui-focused": { color: "#6b7199" },
    },
  };

  const handleAddVisualCard = async () => {
    setError("");
    if (!billingName) { setError('Please enter a name on card'); return; }
    const l4 = (last4 || '').replace(/\D/g,'');
    if (l4.length !== 4) { setError('Enter last 4 digits'); return; }
    let m = parseInt((expMonth || '').toString(), 10);
    if (!(m >= 1 && m <= 12)) { setError('Enter a valid expiration month (1-12)'); return; }
    let y = (expYear || '').toString().trim();
    if (!y) { setError('Enter expiration year'); return; }
    let yNum = parseInt(y, 10);
    if (y.length <= 2) yNum = 2000 + yNum; // normalize YY -> 20YY
    if (!(yNum >= 2000 && yNum <= 2099)) { setError('Enter a valid expiration year'); return; }
    setSaving(true);
    try {
      const payload = {
        type: 'visual',
        brand: (network || 'visa').toLowerCase(),
        bankName: bankName || '',
        billingName,
        last4: l4,
        exp_month: m,
        exp_year: yNum,
      };
      const saveLocal = () => {
        const local = { id: `v-${Date.now()}`, ...payload };
        setGuestMethods(prev => {
          const next = [local, ...prev];
          try { localStorage.setItem('visualPaymentMethods', JSON.stringify(next)); } catch (_) {}
          return next;
        });
      };

      if (auth && auth.currentUser) {
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3500));
        try {
          await Promise.race([
            addPaymentMethodDoc(payload),
            timeout,
          ]);
        } catch (e) {
          // Firestore may be blocked or offline; fall back locally and show a soft notice
          saveLocal();
          setError('Saved locally (offline). Will sync when online.');
        }
      } else {
        saveLocal();
      }
      handleClose();
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (card, isGuest) => {
    setEditTarget({ ...card, _guest: isGuest });
    setBillingName(card.billingName || "");
    setBankName(card.bankName || "");
    setNetwork((card.brand || 'visa').toLowerCase());
    setLast4(card.last4 || "");
    setExpMonth(card.exp_month ? String(card.exp_month).padStart(2,'0') : "");
    setExpYear(card.exp_year ? String(card.exp_year).toString().slice(-2) : "");
    setEditOpen(true);
  };

  const handleSaveEdit = async () => {
    setError("");
    if (!editTarget) return;
    const patch = {
      billingName,
      bankName,
      brand: (network || 'visa').toLowerCase(),
      last4: (last4 || '').replace(/\D/g,'').slice(0,4),
      exp_month: parseInt((expMonth||'').toString(), 10) || undefined,
      exp_year: (()=>{ const y=(expYear||'').toString(); if(!y) return undefined; let n=parseInt(y,10); if(y.length<=2) n=2000+n; return n; })(),
    };
    setSaving(true);
    try {
      if (editTarget._guest) {
        setGuestMethods(prev => {
          const next = prev.map(x => x.id === editTarget.id ? { ...x, ...patch } : x);
          try { localStorage.setItem('visualPaymentMethods', JSON.stringify(next)); } catch (_) {}
          return next;
        });
      } else if (editTarget.id) {
        await updatePaymentMethodDoc(editTarget.id, patch);
      }
      setEditOpen(false);
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setSaving(false);
    }
  };

  const openDelete = (card, isGuest) => {
    setDeleteConfirm({ id: card.id, paymentMethodId: card.paymentMethodId, _guest: isGuest });
  };

  const handleDelete = async () => {
    const t = deleteConfirm;
    if (!t) return;
    setSaving(true);
    setError("");
    try {
      if (t._guest) {
        setGuestMethods(prev => {
          const next = prev.filter(x => x.id !== t.id);
          try { localStorage.setItem('visualPaymentMethods', JSON.stringify(next)); } catch (_) {}
          return next;
        });
      } else if (t.id) {
        // If this card is a real Stripe card and we stored a paymentMethodId, detach in Stripe first
        if (t.paymentMethodId) {
          try { await fetch('/api/stripe/delete-card', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paymentMethodId: t.paymentMethodId }) }); } catch (_) {}
        }
        await deletePaymentMethodDoc(t.id);
      }
      setDeleteConfirm(null);
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setSaving(false);
    }
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
          {(guestMethods.concat(savedMethods)).map((card, idx) => (
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
                onMouseEnter={() => setHoveredId(card.id || idx)}
                onMouseLeave={() => setHoveredId(null)}
                sx={{ position: 'relative', transition: 'border-color .2s ease', '&:hover': { borderColor: '#3b3f76' } }}
              >
                <VuiBox sx={{ position: 'absolute', top: 8, right: 8, display: { xs: 'flex', md: hoveredId === (card.id || idx) ? 'flex' : 'none' }, gap: 0.5 }}>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => openEdit(card, Boolean(card.type === 'visual' || !card.paymentMethodId))} sx={{ color: '#cdd3ea', background: 'rgba(255,255,255,0.06)', '&:hover': { background: 'rgba(255,255,255,0.12)' } }}>
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => openDelete(card, Boolean(card.type === 'visual' || !card.paymentMethodId))} sx={{ color: '#ff8f8f', background: 'rgba(255,0,0,0.06)', '&:hover': { background: 'rgba(255,0,0,0.12)' } }}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </VuiBox>
                <VuiBox display="flex" alignItems="center" width="100%">
                  {String(card.brand || '').toLowerCase() === 'visa' ? <Visa width="25px" /> : <Mastercard width="21px" />}
                  <VuiTypography pl={2} variant="button" color="white" fontWeight="medium">
                    {card.billingName || 'Saved Card'}
                    <span style={{ color: '#b8bdd9', fontWeight: 500, fontSize: 13, marginLeft: 12 }}>
                      {card.last4 ? `•••• •••• •••• ${card.last4}` : (card.bankName ? `· ${card.bankName}` : '')}
                    </span>
                  </VuiTypography>
                </VuiBox>
                <VuiTypography mt={1} pl={String(card.brand || '').toLowerCase() === 'visa' ? 6 : 5} variant="caption" color="white">
                  {card.last4 ? (
                    <>
                      EXP: {(card.exp_month ? String(card.exp_month).padStart(2,'0') : '--')}/{(card.exp_year ? String(card.exp_year).toString().slice(-2) : '--')}
                      <span style={{ margin: '0 10px', opacity: .4 }}>|</span>
                      CVV: •••
                    </>
                  ) : (
                    card.bankName ? `Bank: ${card.bankName}` : ''
                  )}
                </VuiTypography>
              </VuiBox>
            </Grid>
          ))}
        </Grid>
      </VuiBox>
      {/* Edit dialog for visual cards or metadata */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { background: 'rgba(34, 40, 74, 0.65)', boxShadow: 24, borderRadius: 4, color: 'white', backdropFilter: 'blur(10px)', p: 4 } }}>
        <DialogTitle sx={{ color: 'white', fontWeight: 700, fontSize: 20 }}>Edit Card</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
          <TextField label="Name on Card" value={billingName} onChange={(e)=>setBillingName(e.target.value)} fullWidth InputLabelProps={{ shrink: true, style: { color: '#6b7199' } }} sx={{ ...fieldSx }} />
          <TextField label="Bank Name (optional)" value={bankName} onChange={(e)=>setBankName(e.target.value)} fullWidth InputLabelProps={{ shrink: true, style: { color: '#6b7199' } }} sx={{ ...fieldSx }} />
          <TextField label="Network" value={network} onChange={(e)=>setNetwork(e.target.value)} select fullWidth InputLabelProps={{ shrink: true, style: { color: '#6b7199' } }} sx={{ ...fieldSx, '& .MuiSelect-select': { color: '#e7e9f3', py: 1 } }}>
            <MenuItem value="visa">Visa</MenuItem>
            <MenuItem value="mastercard">Mastercard</MenuItem>
            <MenuItem value="amex">American Express</MenuItem>
            <MenuItem value="discover">Discover</MenuItem>
          </TextField>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField label="Last 4 digits" value={last4} onChange={(e)=>setLast4(e.target.value.replace(/\D/g,'').slice(0,4))} inputProps={{ maxLength: 4 }} fullWidth InputLabelProps={{ shrink: true, style: { color: '#6b7199' } }} sx={{ ...fieldSx }} />
            </Grid>
            <Grid item xs={3}>
              <TextField label="MM" value={expMonth} onChange={(e)=>setExpMonth(e.target.value.replace(/\D/g,'').slice(0,2))} inputProps={{ maxLength: 2 }} fullWidth InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }} sx={{ ...fieldSx }} />
            </Grid>
            <Grid item xs={3}>
              <TextField label="YY" value={expYear} onChange={(e)=>setExpYear(e.target.value.replace(/\D/g,'').slice(0,4))} inputProps={{ maxLength: 4 }} fullWidth InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }} sx={{ ...fieldSx }} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setEditOpen(false)} sx={{ color: '#bfc6e0' }}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="info" disabled={saving} sx={{ borderRadius: 2, px: 3, fontWeight: 600 }}>{saving ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Save'}</Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={Boolean(deleteConfirm)} onClose={() => setDeleteConfirm(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { background: 'rgba(34, 40, 74, 0.9)', color: 'white', p: 2 } }}>
        <DialogTitle sx={{ color: 'white', fontWeight: 700, fontSize: 18 }}>Remove payment method?</DialogTitle>
        <DialogActions>
          <Button onClick={()=>setDeleteConfirm(null)} sx={{ color: '#bfc6e0' }}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={saving}>{saving ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Delete'}</Button>
        </DialogActions>
      </Dialog>
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
        <DialogTitle sx={{ color: 'white', fontWeight: 700, fontSize: 22, pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Add Payment Method</span>
          <Button
            size="small"
            onClick={() => setMode(m => m === 'stripe' ? 'visual' : 'stripe')}
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
              '&:hover': { background: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.2)' }
            }}
          >
            {mode === 'stripe' ? 'Add Visual Card' : 'Add Real Card'}
          </Button>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1, background: 'transparent', color: 'white', px: 2, minWidth: 400 }}>
          {mode === 'stripe' ? (
            stripePromise ? (
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
            )
          ) : (
            <>
              <TextField label="Name on Card" value={billingName} onChange={(e)=>setBillingName(e.target.value)} fullWidth InputLabelProps={{ shrink: true, style: { color: '#6b7199' } }} sx={{ ...fieldSx, mt: 1, mb: 1 }} />
              <TextField label="Bank Name (optional)" value={bankName} onChange={(e)=>setBankName(e.target.value)} fullWidth InputLabelProps={{ shrink: true, style: { color: '#6b7199' } }} sx={{ ...fieldSx, mb: 1 }} />
              <TextField label="Network" value={network} onChange={(e)=>setNetwork(e.target.value)} select fullWidth InputLabelProps={{ shrink: true, style: { color: '#6b7199' } }} sx={{ ...fieldSx, mb: 1, color: 'white', '& .MuiSelect-select': { color: '#e7e9f3', py: 1, background: 'transparent' } }}>
                <MenuItem value="visa">Visa</MenuItem>
                <MenuItem value="mastercard">Mastercard</MenuItem>
                <MenuItem value="amex">American Express</MenuItem>
                <MenuItem value="discover">Discover</MenuItem>
              </TextField>
              <Grid container spacing={1} sx={{ mt: 0.5 }}>
                <Grid item xs={6}>
                  <TextField label="Last 4 digits" value={last4} onChange={(e)=>setLast4(e.target.value.replace(/\D/g,''))} inputProps={{ maxLength: 4 }} fullWidth InputLabelProps={{ shrink: true, style: { color: '#6b7199' } }} sx={{ ...fieldSx }} />
                </Grid>
                <Grid item xs={3}>
                  <TextField label="MM" value={expMonth} onChange={(e)=>setExpMonth(e.target.value.replace(/\D/g,'').slice(0,2))} inputProps={{ maxLength: 2 }} fullWidth InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }} sx={{ ...fieldSx }} />
                </Grid>
                <Grid item xs={3}>
                  <TextField label="YY" value={expYear} onChange={(e)=>setExpYear(e.target.value.replace(/\D/g,'').slice(0,4))} inputProps={{ maxLength: 4 }} fullWidth InputLabelProps={{ shrink: true, style: { color: '#6b7199' } }} sx={{ ...fieldSx }} />
                </Grid>
              </Grid>
              <DialogActions sx={{ background: 'transparent', px: 0, pb: 0, pt: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <Button onClick={handleClose} sx={{ color: '#bfc6e0' }}>Cancel</Button>
                <Button onClick={handleAddVisualCard} variant="contained" color="info" disabled={saving || !billingName} sx={{ borderRadius: 2, px: 3, fontWeight: 600 }}>
                  {saving ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Save'}
                </Button>
              </DialogActions>
            </>
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
    if (stripePromise || !hasStripeKey) return;
    try { setStripePromise(loadStripe(STRIPE_PUBLISHABLE_KEY)); } catch (_) {}
  };
  return <PaymentMethodShell stripePromise={stripePromise} ensureStripe={ensureStripe} />;
}

export default PaymentMethod;
