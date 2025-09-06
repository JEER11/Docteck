// prop-types is a library for typechecking of props
// @mui material components
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Jelly1 from "assets/images/Jelly1.jpg";
import Jelly2 from "assets/images/Jelly2.jpg";
import JellyBack from "assets/images/Jellybackg.jpg";
import Watercard from "assets/images/watercard.png";
import Sunset from "assets/images/sunset.png";
import AssistanceBack from "assets/images/AssistanceBack.jpeg";
// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import PropTypes from "prop-types";
import { FiEdit2, FiPlus } from "react-icons/fi";
import React, { useEffect, useState } from "react";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import UploadIcon from "@mui/icons-material/CloudUpload";
import { uploadUserFile, deleteUserFile } from "lib/storage";
import { onInsuranceCards, addInsuranceCard, updateInsuranceCard, deleteInsuranceCard, fetchInsuranceCardsOnce, getCachedInsuranceCards, setCachedInsuranceCards } from "lib/billingData";
import { auth } from "lib/firebase";
import { useAuth } from "../../../hooks/useAuth";

function MasterCard({ insuranceName, memberName, memberId, monthlyBill, onAdd, onEdit, onDelete, canAdd = true, overlayOpacity = 0.35, backgroundSrc, frontImageUrl, backImageUrl, id }) {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [form, setForm] = useState({
    insuranceName: "",
    memberName: "",
    memberId: "",
    monthlyBill: "",
    backgroundSrc: Jelly1,
    frontImageUrl: undefined,
    backImageUrl: undefined,
  });
  const BG_OPTIONS = [
    { label: "Jelly 1", src: Jelly1 },
    { label: "Jelly 2", src: Jelly2 },
    { label: "Water", src: Watercard },
    { label: "Sunset", src: Sunset },
    { label: "Assistance", src: AssistanceBack },
    { label: "Jelly Back", src: JellyBack },
  ];

  const handleAddClick = (e) => {
    e.stopPropagation();
    setForm({ insuranceName: "", memberName: "", memberId: "", monthlyBill: "", backgroundSrc: Jelly1, frontImageUrl: undefined, backImageUrl: undefined });
    setOpenAdd(true);
  };
  const handleEditClick = (e) => {
    e.stopPropagation();
    setForm({ insuranceName, memberName, memberId, monthlyBill, backgroundSrc: backgroundSrc || Jelly1, frontImageUrl, backImageUrl });
    setOpenEdit(true);
  };
  const handleClose = (e) => {
    if (e) e.stopPropagation();
    setOpenAdd(false);
    setOpenEdit(false);
  };
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleAddSubmit = async (e) => {
    e.preventDefault();
  const payload = { ...form, monthlyBill: form.monthlyBill || "0.00" };
    if (onAdd) await onAdd(payload);
    handleClose(e);
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
  const payload = { ...form, monthlyBill: form.monthlyBill || "0.00" };
  if (onEdit) await onEdit(payload);
    handleClose(e);
  };
  const handleDelete = (e) => {
    e.preventDefault();
    if (onDelete) onDelete(form);
    handleClose(e);
  };

  // Helpers to upload images and set into form (and persist immediately on Edit dialog)
  const uploadAndSet = async (file, which) => {
    if (!file) return;
    try {
      const { url, path } = await uploadUserFile(file, "insurance");
      setForm((prev) => ({
        ...prev,
        ...(which === 'front' ? { frontImageUrl: url, frontImagePath: path } : {}),
        ...(which === 'back' ? { backImageUrl: url, backImagePath: path } : {}),
      }));
      // If editing an existing card, push change to Firestore right away
      if (openEdit && id) {
        const patch = which === 'front' ? { frontImageUrl: url, frontImagePath: path } : { backImageUrl: url, backImagePath: path };
        try { await updateInsuranceCard(id, patch); } catch (_) {}
      }
    } catch (_) {
      // silently ignore upload errors for now
    }
  };

  // Match Pharmacy dialog input style
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

  // List of 100+ insurance company names
  const INSURANCE_OPTIONS = [
    "Aetna", "Blue Cross Blue Shield", "Cigna", "UnitedHealthcare", "Humana", "Kaiser Permanente", "Centene", "Molina Healthcare", "Anthem", "WellCare",
    "Health Net", "Oscar Health", "Ambetter", "Medica", "Bright Health", "CareSource", "EmblemHealth", "Highmark", "Premera Blue Cross", "Regence Blue Shield",
    "Tufts Health Plan", "Harvard Pilgrim", "Geisinger", "UPMC Health Plan", "Independence Blue Cross", "Priority Health", "HealthPartners", "Excellus BCBS", "Blue Shield of California", "Florida Blue",
    "Blue Cross Blue Shield of Michigan", "Blue Cross Blue Shield of Texas", "Blue Cross Blue Shield of Illinois", "Blue Cross Blue Shield of Massachusetts", "Blue Cross Blue Shield of North Carolina",
    "Blue Cross Blue Shield of Tennessee", "Blue Cross Blue Shield of Arizona", "Blue Cross Blue Shield of Alabama", "Blue Cross Blue Shield of Louisiana", "Blue Cross Blue Shield of Minnesota",
    "Blue Cross Blue Shield of Kansas", "Blue Cross Blue Shield of Oklahoma", "Blue Cross Blue Shield of Nebraska", "Blue Cross Blue Shield of Vermont", "Blue Cross Blue Shield of Montana",
    "Blue Cross Blue Shield of South Carolina", "Blue Cross Blue Shield of Georgia", "Blue Cross Blue Shield of Arkansas", "Blue Cross Blue Shield of Mississippi", "Blue Cross Blue Shield of New Mexico",
    "Blue Cross Blue Shield of Rhode Island", "Blue Cross Blue Shield of Wyoming", "Blue Cross Blue Shield of Delaware", "Blue Cross Blue Shield of Idaho", "Blue Cross Blue Shield of Iowa",
    "Blue Cross Blue Shield of Kansas City", "Blue Cross Blue Shield of Western New York", "Blue Cross Blue Shield of Northeastern New York", "Blue Cross Blue Shield of Hawaii", "Blue Cross Blue Shield of Alaska",
    "Blue Cross Blue Shield of Oregon", "Blue Cross Blue Shield of Utah", "Blue Cross Blue Shield of Nevada", "Blue Cross Blue Shield of Colorado", "Blue Cross Blue Shield of Pennsylvania",
    "Blue Cross Blue Shield of Maryland", "Blue Cross Blue Shield of Virginia", "Blue Cross Blue Shield of West Virginia", "Blue Cross Blue Shield of Kentucky", "Blue Cross Blue Shield of Indiana",
    "Blue Cross Blue Shield of Ohio", "Blue Cross Blue Shield of New Jersey", "Blue Cross Blue Shield of Connecticut", "Blue Cross Blue Shield of New Hampshire", "Blue Cross Blue Shield of Maine",
    "Blue Cross Blue Shield of Vermont", "Blue Cross Blue Shield of South Dakota", "Blue Cross Blue Shield of North Dakota", "Blue Cross Blue Shield of Montana", "Blue Cross Blue Shield of Oklahoma",
    "Blue Cross Blue Shield of Puerto Rico", "Blue Cross Blue Shield of Virgin Islands", "Blue Cross Blue Shield of Guam", "Blue Cross Blue Shield of Northern Mariana Islands", "Blue Cross Blue Shield of American Samoa",
    "MetLife", "Guardian", "Principal", "Lincoln Financial", "Mutual of Omaha", "Transamerica", "Prudential", "John Hancock", "MassMutual", "New York Life",
    "Nationwide", "Allstate", "State Farm", "Farmers Insurance", "Liberty Mutual", "Progressive", "Travelers", "Chubb", "The Hartford", "Zurich",
    "Assurant", "CNO Financial", "Ameritas", "Colonial Life", "Unum", "Sun Life", "Voya Financial", "Aflac", "Delta Dental", "United Concordia"
  ];

  return (
    <>
      <Card sx={{
        position: "relative",
        background: `url('${backgroundSrc || Jelly1}')`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        // Remove the dark overlay pseudo-element
      }}>
    {/* Overlay for transparency (tunable) */}
        <VuiBox
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
      background: `rgba(24, 44, 90, ${overlayOpacity})`,
            borderRadius: "inherit",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
        <VuiBox p={2} pt={0} sx={{ position: "relative", zIndex: 2 }}>
          <VuiBox
            color="white"
            lineHeight={0}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            sx={{ width: "100%" }}
          >
            <VuiTypography color="white" variant="lg" fontWeight="bold" mr="auto">
              {insuranceName || "Insurance Card"}
            </VuiTypography>
            <VuiBox display="flex" alignItems="center" gap={1}>
              {canAdd && (
                <VuiBox
                  component="button"
                  onClick={handleAddClick}
                  sx={{
                    background: "rgba(255,255,255,0.12)",
                    border: "none",
                    borderRadius: "50%",
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    marginRight: 1,
                    padding: 0,
                  }}
                  aria-label="Add Insurance"
                  type="button"
                >
                  <FiPlus size={18} color="#fff" />
                </VuiBox>
              )}
              <VuiBox
                component="button"
                onClick={handleEditClick}
                sx={{
                  background: "rgba(255,255,255,0.12)",
                  border: "none",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  padding: 0,
                }}
                aria-label="Edit Insurance"
                type="button"
              >
                <FiEdit2 size={16} color="#fff" />
              </VuiBox>
            </VuiBox>
          </VuiBox>
          <VuiTypography
            variant="h4"
            color="white"
            mt="auto"
            fontWeight="medium"
            sx={({ breakpoints }) => ({
              mt: 5,
              pb: 1,
              [breakpoints.only("sm")]: {
                fontSize: "22px",
              },
            })}
            style={{ textAlign: "left" }}
          >
            {memberName}
          </VuiTypography>
          <VuiBox display="flex" justifyContent="space-between" alignItems="center" mt={1}>
            <VuiBox>
              <VuiTypography variant="xxs" color="white" fontWeight="medium" opacity={0.8}>
                MEMBER ID
              </VuiTypography>
              <VuiTypography
                variant="h6"
                color="white"
                fontWeight="medium"
                textTransform="capitalize"
              >
                {memberId}
              </VuiTypography>
            </VuiBox>
            <VuiBox textAlign="right">
              <VuiTypography variant="xxs" color="white" fontWeight="medium" opacity={0.8}>
                MONTHLY BILL
              </VuiTypography>
              <VuiTypography variant="h6" color="white" fontWeight="medium">
                {monthlyBill ? `$${monthlyBill}/mo` : "-"}
              </VuiTypography>
            </VuiBox>
          </VuiBox>
        </VuiBox>
        {/* Show small thumbnails if images exist */}
        {(frontImageUrl || backImageUrl) && (
          <VuiBox sx={{ position: 'absolute', bottom: 8, right: 8, zIndex: 3, display: 'flex', gap: 1 }}>
            {frontImageUrl && <img alt="Front" src={frontImageUrl} style={{ width: 40, height: 26, objectFit: 'cover', borderRadius: 4, border: '1px solid rgba(255,255,255,0.3)' }} />}
            {backImageUrl && <img alt="Back" src={backImageUrl} style={{ width: 40, height: 26, objectFit: 'cover', borderRadius: 4, border: '1px solid rgba(255,255,255,0.3)' }} />}
          </VuiBox>
        )}
      </Card>
      {/* Popups for Add and Edit – now MUI Dialogs matching Pharmacy UI */}
      <Dialog
        open={openAdd}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { background: 'rgba(34, 40, 74, 0.65)', boxShadow: 24, borderRadius: 4, color: 'white', backdropFilter: 'blur(10px)', p: 4, minWidth: 400, maxWidth: 600 } }}
      >
        <DialogTitle sx={{ color: 'white', fontWeight: 700, fontSize: 22, pb: 2 }}>Add Insurance</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1, background: 'transparent', color: 'white', px: 2, minWidth: 400 }}>
          <TextField label="Insurance Name" name="insuranceName" value={form.insuranceName} onChange={handleFormChange} fullWidth InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }} sx={{ ...fieldSx, mt: 1, mb: 1 }} inputProps={{ list: 'insurance-options' }} />
          <datalist id="insurance-options">
            {INSURANCE_OPTIONS.map((name, idx) => (<option key={idx} value={name} />))}
          </datalist>
          <TextField label="Member Name" name="memberName" value={form.memberName} onChange={handleFormChange} fullWidth InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }} sx={{ ...fieldSx, mb: 1 }} />
          <TextField label="Member ID" name="memberId" value={form.memberId} onChange={handleFormChange} fullWidth InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }} sx={{ ...fieldSx, mb: 1 }} />
          <TextField label="Monthly Bill ($)" name="monthlyBill" value={form.monthlyBill} onChange={handleFormChange} fullWidth InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }} sx={{ ...fieldSx, mb: 1 }} />
          {/* Background chooser */}
          <VuiTypography variant="button" color="white" sx={{ opacity: 0.8, mt: 1 }}>Background</VuiTypography>
          <VuiBox sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {BG_OPTIONS.map((opt, i) => (
              <VuiBox key={i} onClick={() => setForm((f)=>({...f, backgroundSrc: opt.src}))} sx={{
                width: 64, height: 40, borderRadius: 1, overflow: 'hidden', cursor: 'pointer',
                backgroundImage: `url(${opt.src})`, backgroundSize: 'cover', backgroundPosition: 'center',
                outline: form.backgroundSrc === opt.src ? '2px solid #6a6afc' : '1px solid rgba(255,255,255,0.2)'
              }} />
            ))}
          </VuiBox>
          {/* Card images (front/back) */}
          <VuiTypography variant="button" color="white" sx={{ opacity: 0.8, mt: 2 }}>Card Images</VuiTypography>
          <VuiBox sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
            <VuiBox component="label" sx={{
              background: 'rgba(255,255,255,0.12)', borderRadius: 2, px: 2, py: 1, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 1
            }} title="Upload front image">
              <PhotoCamera sx={{ color: '#fff' }} fontSize="small" />
              <span style={{ color: '#fff', fontSize: 13 }}>Front Image</span>
              <input type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; e.target.value=''; if (!auth || !auth.currentUser) return; uploadAndSet(f, 'front'); }} />
            </VuiBox>
            <VuiBox component="label" sx={{
              background: 'rgba(255,255,255,0.12)', borderRadius: 2, px: 2, py: 1, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 1
            }} title="Upload back image">
              <UploadIcon sx={{ color: '#fff' }} fontSize="small" />
              <span style={{ color: '#fff', fontSize: 13 }}>Back Image</span>
              <input type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; e.target.value=''; if (!auth || !auth.currentUser) return; uploadAndSet(f, 'back'); }} />
            </VuiBox>
            {(form.frontImageUrl || form.backImageUrl) && (
              <VuiBox sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                {form.frontImageUrl && <img alt="Front" src={form.frontImageUrl} style={{ width: 48, height: 32, objectFit: 'cover', borderRadius: 4, border: '1px solid rgba(255,255,255,0.25)' }} />}
                {form.backImageUrl && <img alt="Back" src={form.backImageUrl} style={{ width: 48, height: 32, objectFit: 'cover', borderRadius: 4, border: '1px solid rgba(255,255,255,0.25)' }} />}
              </VuiBox>
            )}
          </VuiBox>
        </DialogContent>
        <DialogActions sx={{ background: 'transparent', px: 2, pb: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button onClick={handleClose} sx={{ color: '#bfc6e0' }}>Cancel</Button>
          <Button onClick={handleAddSubmit} variant="contained" color="info" disabled={!form.insuranceName || !form.memberName || !form.memberId} sx={{ borderRadius: 2, px: 3, fontWeight: 600 }}>Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEdit}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { background: 'rgba(34, 40, 74, 0.65)', boxShadow: 24, borderRadius: 4, color: 'white', backdropFilter: 'blur(10px)', p: 4, minWidth: 400, maxWidth: 600 } }}
      >
        <DialogTitle sx={{ color: 'white', fontWeight: 700, fontSize: 22, pb: 2 }}>Edit Insurance</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1, background: 'transparent', color: 'white', px: 2, minWidth: 400 }}>
          <TextField label="Insurance Name" name="insuranceName" value={form.insuranceName} onChange={handleFormChange} fullWidth InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }} sx={{ ...fieldSx, mt: 1, mb: 1 }} inputProps={{ list: 'insurance-options' }} />
          <datalist id="insurance-options">
            {INSURANCE_OPTIONS.map((name, idx) => (<option key={idx} value={name} />))}
          </datalist>
          <TextField label="Member Name" name="memberName" value={form.memberName} onChange={handleFormChange} fullWidth InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }} sx={{ ...fieldSx, mb: 1 }} />
          <TextField label="Member ID" name="memberId" value={form.memberId} onChange={handleFormChange} fullWidth InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }} sx={{ ...fieldSx, mb: 1 }} />
          <TextField label="Monthly Bill ($)" name="monthlyBill" value={form.monthlyBill} onChange={handleFormChange} fullWidth InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }} sx={{ ...fieldSx, mb: 1 }} />
          {/* Background chooser */}
          <VuiTypography variant="button" color="white" sx={{ opacity: 0.8, mt: 1 }}>Background</VuiTypography>
          <VuiBox sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {BG_OPTIONS.map((opt, i) => (
              <VuiBox key={i} onClick={() => setForm((f)=>({...f, backgroundSrc: opt.src}))} sx={{
                width: 64, height: 40, borderRadius: 1, overflow: 'hidden', cursor: 'pointer',
                backgroundImage: `url(${opt.src})`, backgroundSize: 'cover', backgroundPosition: 'center',
                outline: form.backgroundSrc === opt.src ? '2px solid #6a6afc' : '1px solid rgba(255,255,255,0.2)'
              }} />
            ))}
          </VuiBox>
          {/* Card images (front/back) */}
          <VuiTypography variant="button" color="white" sx={{ opacity: 0.8, mt: 2 }}>Card Images</VuiTypography>
          <VuiBox sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
            <VuiBox component="label" sx={{
              background: 'rgba(255,255,255,0.12)', borderRadius: 2, px: 2, py: 1, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 1
            }} title="Upload front image">
              <PhotoCamera sx={{ color: '#fff' }} fontSize="small" />
              <span style={{ color: '#fff', fontSize: 13 }}>Front Image</span>
              <input type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; e.target.value=''; if (!auth || !auth.currentUser) return; uploadAndSet(f, 'front'); }} />
            </VuiBox>
            <VuiBox component="label" sx={{
              background: 'rgba(255,255,255,0.12)', borderRadius: 2, px: 2, py: 1, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 1
            }} title="Upload back image">
              <UploadIcon sx={{ color: '#fff' }} fontSize="small" />
              <span style={{ color: '#fff', fontSize: 13 }}>Back Image</span>
              <input type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; e.target.value=''; if (!auth || !auth.currentUser) return; uploadAndSet(f, 'back'); }} />
            </VuiBox>
            {(form.frontImageUrl || form.backImageUrl) && (
              <VuiBox sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                {form.frontImageUrl && <img alt="Front" src={form.frontImageUrl} style={{ width: 48, height: 32, objectFit: 'cover', borderRadius: 4, border: '1px solid rgba(255,255,255,0.25)' }} />}
                {form.backImageUrl && <img alt="Back" src={form.backImageUrl} style={{ width: 48, height: 32, objectFit: 'cover', borderRadius: 4, border: '1px solid rgba(255,255,255,0.25)' }} />}
              </VuiBox>
            )}
          </VuiBox>
        </DialogContent>
        <DialogActions sx={{ background: 'transparent', px: 2, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button onClick={handleDelete} color="error" variant="outlined" sx={{ borderColor: '#e57373', color: '#e57373', fontWeight: 600 }}>Delete</Button>
          <div>
            <Button onClick={handleClose} sx={{ color: '#bfc6e0', mr: 1 }}>Cancel</Button>
            <Button onClick={handleEditSubmit} variant="contained" color="info" disabled={!form.insuranceName || !form.memberName || !form.memberId || !form.monthlyBill} sx={{ borderRadius: 2, px: 3, fontWeight: 600 }}>Save</Button>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
}

// Setting default values for the props of MasterCard
MasterCard.defaultProps = {
  insuranceName: "Insurance Card",
  memberName: "Member Name",
  memberId: "ID123456",
  monthlyBill: "0.00",
  onAdd: () => {},
  onEdit: () => {},
  onDelete: () => {},
  canAdd: true,
  overlayOpacity: 0.35,
  backgroundSrc: Jelly1,
};

// Typechecking props for the MasterCard
MasterCard.propTypes = {
  insuranceName: PropTypes.string,
  memberName: PropTypes.string,
  memberId: PropTypes.string,
  monthlyBill: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onAdd: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  canAdd: PropTypes.bool,
  overlayOpacity: PropTypes.number,
  backgroundSrc: PropTypes.string,
};

function MasterCardStack({ cards, setCards, onAdd, onEdit, onDelete }) {
  const PLACEHOLDER = { id: "placeholder", insuranceName: "Insurance Card", memberName: "Member Name", memberId: "ID123456", monthlyBill: "0.00" };
  const [activeIndex, setActiveIndex] = useState(0);
  // If setter not provided, load from Firestore live; start with a placeholder so UI isn't empty
  const [liveCards, setLiveCards] = useState([PLACEHOLDER]);
  const { user, isAuthReady } = useAuth();
  const usingLive = typeof setCards !== 'function';
  // Dynamically measure the actual card height so the stack peek is always visible
  const [cardHeight, setCardHeight] = useState(220);
  const containerRef = React.useRef(null);
  const [fanOut, setFanOut] = useState(false); // temporarily increase peek spacing after add
  const [hoveredIndex, setHoveredIndex] = useState(null); // for slide-down on hover (non-top)
  const triggerFanOut = () => { setFanOut(true); setTimeout(() => setFanOut(false), 1200); };
  // Maintain local visual order for live cards so stream updates don't reset it
  const [orderIds, setOrderIds] = useState([]);
  useEffect(() => {
    // If Firebase not configured, show placeholder and stop
  if (!auth) { const cachedAny = getCachedInsuranceCards(undefined); setLiveCards((cachedAny?.length ? cachedAny : [PLACEHOLDER])); return; }
    // Wait until auth state is known to avoid missing initial subscription
  if (!isAuthReady) { const cachedAny = getCachedInsuranceCards(undefined); setLiveCards((cachedAny?.length ? cachedAny : [PLACEHOLDER])); return; }
    // If no user, still show placeholder, but don't subscribe
  if (!user) { const cachedAny = getCachedInsuranceCards(undefined); setLiveCards((cachedAny?.length ? cachedAny : [PLACEHOLDER])); return; }
    // Kick off a fast one-time fetch so UI shows quickly, then keep live updates
    // Try cached cards first for instant UI when network is blocked
    const cached = getCachedInsuranceCards(user.uid);
    if (cached?.length) setLiveCards(cached);
    fetchInsuranceCardsOnce(user.uid).then((rows) => {
      if (rows?.length) setLiveCards(rows);
    }).catch(() => { /* keep cached/placeholder */ });
    const unsub = onInsuranceCards({ uid: user.uid, onError: () => {
      const latest = getCachedInsuranceCards(user.uid);
      setLiveCards((prev) => (prev?.length ? prev : (latest?.length ? latest : [PLACEHOLDER])));
    } }, (rows) => {
      // If stream returns empty, still show a placeholder so UI doesn't collapse
      const latest = getCachedInsuranceCards(user.uid);
      setLiveCards(rows?.length ? rows : (latest?.length ? latest : [PLACEHOLDER]));
    });
    return () => { if (typeof unsub === 'function') unsub(); };
  }, [isAuthReady, user?.uid]);
  const viewCards = usingLive ? liveCards : (cards?.length ? cards : [{ id: "placeholder", insuranceName: "Insurance Card", memberName: "Member Name", memberId: "ID123456", monthlyBill: "0.00" }]);

  // Sync orderIds with incoming live cards (keep previous order, add new ids to end)
  useEffect(() => {
    if (!usingLive) return;
    const ids = (liveCards || []).map((c) => c?.id).filter(Boolean);
    if (!ids.length) return;
    setOrderIds((prev) => {
      if (!prev || !prev.length) return ids;
      const kept = prev.filter((id) => ids.includes(id));
      const added = ids.filter((id) => !prev.includes(id));
      return [...kept, ...added];
    });
  }, [usingLive, liveCards]);

  // Cards to render with local order applied (live mode)
  const displayCards = React.useMemo(() => {
    if (!usingLive) return viewCards;
    const list = liveCards || [];
    if (!orderIds?.length) return list;
    const byId = new Map(list.map((c) => [c?.id, c]));
    const arranged = orderIds.map((id) => byId.get(id)).filter(Boolean);
    const leftovers = list.filter((c) => !orderIds.includes(c?.id));
    return [...arranged, ...leftovers];
  }, [usingLive, viewCards, liveCards, orderIds]);

  // Re-measure when cards change or active card switches
  useEffect(() => {
    const measure = () => {
      const el = containerRef.current?.querySelector('[data-ins-card]');
      if (el && el.offsetHeight) setCardHeight(el.offsetHeight);
    };
    // Give layout a tick after updates (dialogs closing, images, etc.)
    const t = setTimeout(measure, 0);
    window.addEventListener('resize', measure);
    return () => { clearTimeout(t); window.removeEventListener('resize', measure); };
  }, [viewCards.length, activeIndex]);

  // Handler to add a new card and show it on top
  const MAX_CARDS = 4;
  const handleAdd = async (form) => {
    const arr = viewCards;
    if (arr.length >= MAX_CARDS) {
      // Soft guard; UI hides add button anyway
      return;
    }
    if (usingLive) {
      try {
  const id = await addInsuranceCard(form);
  const newCard = { id: id || `local-${Date.now()}`, backgroundSrc: form.backgroundSrc || Jelly1, ...form };
  setLiveCards((prev) => {
    // Remove placeholder if present; prepend new card
    const base = (prev && prev[0]?.id === 'placeholder') ? [] : (prev || []);
    const next = [newCard, ...base.filter((c) => c.id !== newCard.id)];
          try { setCachedInsuranceCards(user?.uid, next); } catch {}
          return next;
        });
  setActiveIndex(0);
        triggerFanOut();
      } catch (_) {
        // If adding to Firestore failed (offline/blocked), still show locally and cache it
  const newCard = { id: `local-${Date.now()}`, backgroundSrc: form.backgroundSrc || Jelly1, ...form };
  setLiveCards((prev) => {
    const base = (prev && prev[0]?.id === 'placeholder') ? [] : (prev || []);
    const next = [newCard, ...base];
          try { setCachedInsuranceCards(user?.uid, next); } catch {}
          return next;
        });
  setActiveIndex(0);
        triggerFanOut();
      }
    } else {
      const newCard = { backgroundSrc: form.backgroundSrc || Jelly1, ...form };
      const newCards = [newCard, ...cards];
      setCards(newCards);
      // Show the new card on top
      setActiveIndex(0);
      triggerFanOut();
    }
    if (onAdd) onAdd(form);
  };

  // Bring any clicked card to the top of the stack (index 0). This is a purely
  // client-side visual reorder so it doesn't affect persisted order in Firestore.
  const bringCardToTop = (idx) => {
    if (idx === 0) { setActiveIndex(0); return; }
    if (usingLive) {
      const currentDisplay = displayCards || [];
      const item = currentDisplay[idx];
      if (!item) return;
      // Reorder the underlying liveCards as well so the clicked card truly becomes index 0
      setLiveCards((prev) => {
        const list = prev || [];
        const byId = new Map(list.map((c) => [c?.id, c]));
        const picked = byId.get(item.id) || item; // fall back if not found (unlikely)
        const rest = list.filter((c) => (c?.id || c) !== (item.id || item));
        const next = [picked, ...rest];
        try { setCachedInsuranceCards(user?.uid, next); } catch {}
        return next;
      });
      // Maintain the local orderIds mirror used to arrange displayCards
      setOrderIds((prev) => {
        const base = (prev?.length ? prev : (currentDisplay.map((c) => c?.id).filter(Boolean)));
        return [item.id, ...base.filter((id) => id !== item.id)];
      });
      setActiveIndex(0);
    } else if (Array.isArray(cards) && typeof setCards === 'function') {
      const target = cards[idx];
      if (!target) return;
      const rest = cards.filter((_, i) => i !== idx);
      setCards([target, ...rest]);
      setActiveIndex(0);
    }
  };

  // Handler to edit the active card
  const handleEdit = async (form) => {
    if (usingLive) {
  const target = (viewCards || [])[0];
      if (target?.id) {
        try {
          await updateInsuranceCard(target.id, form);
          setLiveCards((prev) => {
            const base = (prev || []).map((c, i) => (i === 0 ? { ...c, ...form } : c));
            try { setCachedInsuranceCards(user?.uid, base); } catch {}
            return base;
          });
        } catch (_) {
          // Update locally if network blocked
          setLiveCards((prev) => {
            const base = (prev || []).map((c, i) => (i === 0 ? { ...c, ...form } : c));
            try { setCachedInsuranceCards(user?.uid, base); } catch {}
            return base;
          });
        }
      }
    } else {
      const newCards = cards.map((c, i) => (i === 0 ? { ...c, ...form } : c));
      setCards(newCards);
    }
    if (onEdit) onEdit(form);
  };

  // Handler to delete the active card
  const handleDelete = async (form) => {
    if (usingLive) {
  const target = (viewCards || [])[0];
      if (target?.id) {
        try {
          await deleteInsuranceCard(target.id);
          setLiveCards((prev) => {
            const base = (prev || []).filter((_, i) => i !== 0);
            const nextIndex = 0;
            try { setCachedInsuranceCards(user?.uid, base); } catch {}
            setActiveIndex(nextIndex);
            return base.length ? base : [PLACEHOLDER];
          });
        } catch (_) {
          // Remove locally if network blocked
          setLiveCards((prev) => {
            const base = (prev || []).filter((_, i) => i !== 0);
            const nextIndex = 0;
            try { setCachedInsuranceCards(user?.uid, base); } catch {}
            setActiveIndex(nextIndex);
            return base.length ? base : [PLACEHOLDER];
          });
        }
      }
    } else {
      const newCards = cards.filter((_, i) => i !== 0);
      setCards(newCards.length ? newCards : [PLACEHOLDER]);
      setActiveIndex(0);
    }
    if (onDelete) onDelete(form);
  };

  // Show all cards stacked, each peeking out a bit more
  // Clamp measured height to a safe, realistic range so layout math stays stable
  const CARD_HEIGHT = Math.min(Math.max(cardHeight, 200), 320);
  // Small default peek (subtle); briefly expand on add for the "spread" animation
  const PEEK_OFFSET = fanOut ? 36 : 12;
  const MAX_PEEKS = 3;     // show up to 3 peeks (cards 2,3,4)
  // Each lower card is shifted down by only the peek amount so most stays hidden under the top card
  const STEP = PEEK_OFFSET;
  // Count real cards (exclude placeholder) for the badge
  const listForCount = (usingLive ? displayCards : viewCards) || [];
  const realCount = listForCount.filter((c) => (c?.id || '') !== 'placeholder').length;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        minHeight: CARD_HEIGHT + STEP * Math.min(Math.max((usingLive ? (displayCards?.length || 0) : viewCards.length) - 1, 0), MAX_PEEKS),
        borderRadius: 18,
      }}
    >
      {(usingLive ? displayCards : viewCards).map((card, idx) => {
        // Depth is index in array; top card is 0
        const depth = Math.min(idx, MAX_PEEKS);
        const isActive = idx === 0;
        // Visual scaling/shading for non-top cards
        const dim = isActive ? 1 : [1, 0.92, 0.84, 0.76][depth] || 0.76;
        const sat = isActive ? 1 : [1, 0.94, 0.88, 0.82][depth] || 0.82;
        const scale = isActive ? 1 : [1, 0.997, 0.994, 0.991][depth] || 0.991;
        const boxShadow = isActive
          ? '0 10px 24px rgba(15,22,60,0.35)'
          : ['0 8px 18px rgba(5,8,28,0.55)', '0 7px 16px rgba(5,8,28,0.6)', '0 6px 14px rgba(5,8,28,0.62)'][depth - 1] ||
            '0 6px 14px rgba(5,8,28,0.6)';
        // Gradient overlays for lower cards
        const overlayTopA = 0.1 + depth * 0.06;
        const overlayBottomA = 0.28 + depth * 0.14;
        const bottomBandTopA = 0.2 + depth * 0.1;
        const bottomBandBottomA = 0.4 + depth * 0.14;
        const bottomBandH = 12;
        const clipTop = Math.max(CARD_HEIGHT - PEEK_OFFSET, 0);

        return (
          <div
            key={card.id || idx}
            style={{
              position: 'absolute',
              top: (isActive ? 0 : STEP * depth) + (hoveredIndex === idx && !isActive ? 8 : 0),
              left: 0,
              width: '100%',
              zIndex: isActive
                ? (usingLive ? displayCards.length : viewCards.length) + 3
                : (usingLive ? displayCards.length : viewCards.length) + 1 - idx,
              filter: isActive ? undefined : `brightness(${dim}) saturate(${sat})`,
              opacity: isActive ? 1 : 0.96 - depth * 0.05,
              cursor: isActive ? 'default' : 'pointer',
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
              boxShadow,
              borderRadius: 18,
              transition:
                'top 260ms cubic-bezier(0.25,0.8,0.25,1), opacity 220ms ease, filter 220ms ease, transform 260ms cubic-bezier(0.25,0.8,0.25,1), box-shadow 260ms ease',
              willChange: 'transform, filter, top',
              pointerEvents: 'auto',
              clipPath: isActive ? undefined : `inset(${clipTop}px 0 0 0)`,
              WebkitClipPath: isActive ? undefined : `inset(${clipTop}px 0 0 0)`,
            }}
            data-ins-card
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex((h) => (h === idx ? null : h))}
            onClick={() => bringCardToTop(idx)}
          >
            <MasterCard
              {...card}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
              canAdd={idx === 0 && ((usingLive ? displayCards.length : viewCards.length) < MAX_CARDS)}
              overlayOpacity={isActive ? 0.26 : 0.14 + depth * 0.06}
              backgroundSrc={card.backgroundSrc}
              id={card.id}
              frontImageUrl={card.frontImageUrl}
              backImageUrl={card.backImageUrl}
            />
            {!isActive && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 18,
                  background: `linear-gradient(180deg, rgba(10,12,28,${overlayTopA}) 0%, rgba(10,12,28,0) 35%, rgba(10,12,28,${overlayBottomA}) 100%)`,
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
                  border: `1px solid rgba(255,255,255,${Math.max(0.02, 0.08 - depth * 0.02)})`,
                  pointerEvents: 'none',
                }}
              />
            )}
            {!isActive && (
              <div
                style={{
                  position: 'absolute',
                  left: 8,
                  right: 8,
                  bottom: 0,
                  height: bottomBandH,
                  borderBottomLeftRadius: 16,
                  borderBottomRightRadius: 16,
                  background: `linear-gradient(180deg, rgba(5,8,28,0) 0%, rgba(5,8,28,${bottomBandTopA}) 70%, rgba(5,8,28,${bottomBandBottomA}) 100%)`,
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
                  pointerEvents: 'none',
                }}
              />
            )}
            {!isActive && (
              <div
                style={{
                  position: 'absolute',
                  left: 10,
                  right: 10,
                  bottom: bottomBandH - 2,
                  height: 2,
                  borderRadius: 2,
                  background:
                    'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.22) 15%, rgba(255,255,255,0.26) 50%, rgba(255,255,255,0.22) 85%, rgba(255,255,255,0) 100%)',
                  mixBlendMode: 'screen',
                  opacity: 0.9 - depth * 0.2,
                  pointerEvents: 'none',
                }}
              />
            )}
          </div>
        );
      })}
  {realCount > 0 && (
        <div
          style={{
            position: 'absolute',
            right: 6,
            top: 6,
    zIndex: ((usingLive ? displayCards.length : viewCards.length) || 0) + 2,
            background: 'rgba(0,0,0,0.35)',
            color: '#fff',
            fontSize: 11,
            padding: '2px 6px',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
      {realCount} {realCount === 1 ? 'card' : 'cards'}
        </div>
      )}
    </div>
  );
}

// Export MasterCardStack for use in billing page
export { MasterCardStack };

export default MasterCard;
