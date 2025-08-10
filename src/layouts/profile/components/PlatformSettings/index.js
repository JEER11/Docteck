import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CheckCircle from '@mui/icons-material/CheckCircle';
import RadioButtonUnchecked from '@mui/icons-material/RadioButtonUnchecked';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import WarningAmber from '@mui/icons-material/WarningAmber';

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiSwitch from "components/VuiSwitch";
import { useAuth } from "hooks/useAuth";
import { auth } from "lib/firebase";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider, sendPasswordResetEmail } from "firebase/auth";

function PlatformSettings() {
  const [followsMe, setFollowsMe] = useState(true);
  const [answersPost, setAnswersPost] = useState(false);
  const [mentionsMe, setMentionsMe] = useState(true);
  const [newLaunches, setNewLaunches] = useState(false);
  const [productUpdate, setProductUpdate] = useState(true);
  const [newsletter, setNewsletter] = useState(true);
  const [mails, setMails] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [showPasswordEdit, setShowPasswordEdit] = useState(false);
  const [twoStepSMS, setTwoStepSMS] = useState(false);
  const [twoStepEmail, setTwoStepEmail] = useState(false);
  const [twoStepApp, setTwoStepApp] = useState(false);
  const [textNotif, setTextNotif] = useState(false);
  const [emailNotif, setEmailNotif] = useState(false);
  const [deactivateAccount, setDeactivateAccount] = useState(false);
  const [showNotifEdit, setShowNotifEdit] = useState(false);
  const [notifEmail, setNotifEmail] = useState("");
  const [notifPhone, setNotifPhone] = useState("");
  const [notifEmailEnabled, setNotifEmailEnabled] = useState(false);
  const [notifTextEnabled, setNotifTextEnabled] = useState(false);
  const [showTwoStepEdit, setShowTwoStepEdit] = useState(false);
  const [showCalendarDialog, setShowCalendarDialog] = useState(false);
  const [showICalInput, setShowICalInput] = useState(false);
  const [icalUrl, setICalUrl] = useState("");
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [calendarSnackbar, setCalendarSnackbar] = useState(false);
  // Password dialog state
  const { user } = useAuth();
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [showPwCurrent, setShowPwCurrent] = useState(false);
  const [showPwNew, setShowPwNew] = useState(false);
  const [showPwConfirm, setShowPwConfirm] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [capsCurrent, setCapsCurrent] = useState(false);
  const [capsNew, setCapsNew] = useState(false);
  const [capsConfirm, setCapsConfirm] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const pwStrength = (val) => {
    let score = 0;
    if (!val) return 0;
    if (val.length >= 8) score += 25;
    if (/[A-Z]/.test(val)) score += 20;
    if (/[a-z]/.test(val)) score += 15;
    if (/[0-9]/.test(val)) score += 20;
    if (/[^A-Za-z0-9]/.test(val)) score += 20;
    return Math.min(score, 100);
  };

  const canSavePw = () => pwNew && pwConfirm && pwNew === pwConfirm && pwNew.length >= 8 && !pwSaving;

  const strengthVal = (val) => pwStrength(val);
  const strengthLabel = (val) => {
    const v = strengthVal(val);
    if (v >= 80) return 'Strong';
    if (v >= 55) return 'Good';
    if (v >= 30) return 'Fair';
    return 'Weak';
  };
  const strengthColor = (val) => {
    const v = strengthVal(val);
    if (v >= 80) return '#56d27e';
    if (v >= 55) return '#6a6afc';
    if (v >= 30) return '#f0b35b';
    return '#e57373';
  };

  const handlePasswordSave = async () => {
    setPwError("");
    setPwSuccess("");
    if (!auth || !auth.currentUser) {
      setPwError("Password change isn't available (auth not configured).");
      return;
    }
    if (!pwCurrent) { setPwError("Enter your current password."); return; }
    if (pwNew !== pwConfirm) { setPwError("New passwords do not match."); return; }
    if (pwNew.length < 8) { setPwError("Password must be at least 8 characters."); return; }
    try {
      setPwSaving(true);
      const email = auth.currentUser?.email;
      const hasPasswordProvider = (auth.currentUser?.providerData || []).some(p => p.providerId === 'password');
      if (!email || !hasPasswordProvider) {
        setPwError("This account uses a social login. Add a password in your auth provider or link an email/password credential.");
        setPwSaving(false);
        return;
      }
      const cred = EmailAuthProvider.credential(email, pwCurrent);
      await reauthenticateWithCredential(auth.currentUser, cred);
      await updatePassword(auth.currentUser, pwNew);
      setPwSuccess("Password updated.");
      setPwCurrent(""); setPwNew(""); setPwConfirm("");
    } catch (e) {
      const msg = (e && e.message) || "Failed to update password.";
      setPwError(msg.includes('wrong-password') ? 'Current password is incorrect.' : msg);
    } finally {
      setPwSaving(false);
    }
  };

  const handleResetEmail = async () => {
    setPwError(""); setPwSuccess("");
    try {
      if (!auth || !auth.currentUser?.email) { setPwError("Can't send reset email (no email)."); return; }
      await sendPasswordResetEmail(auth, auth.currentUser.email);
      setPwSuccess("Password reset email sent.");
    } catch (e) { setPwError("Failed to send reset email."); }
  };

  // Reusable compact input styles to match the app theme
  const fieldSx = {
  width: '100%',
  maxWidth: 260,
    ml: 0,
    background: '#181a2f',
    borderRadius: 1.5,
    '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #23244a' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#2f3570' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#6a6afc' },
  '& .MuiInputBase-input': { color: '#e7e9f3', fontSize: 14, py: 1 },
  '& .MuiInputAdornment-positionEnd': { mr: -1.25 },
    '& .MuiFormLabel-root': { color: '#aeb3d5', fontSize: 12 }
  };

  const handleICalSave = () => {
    // TODO: Save iCal URL to backend or local storage
    setShowICalInput(false);
    setShowCalendarDialog(false);
  };

  // Fetch calendar connection status (demo: replace with real API call)
  const refreshCalendarStatus = async () => {
    // TODO: Replace with real API call to check if calendar is connected
    setCalendarConnected(true);
  };

  return (
    <Card sx={{ minHeight: "360px", height: "auto" }}>
      <VuiBox mb="26px">
        <VuiTypography variant="lg" fontWeight="bold" color="white" textTransform="capitalize">
          Account settings
        </VuiTypography>
      </VuiBox>
      <VuiBox lineHeight={1.25}>
        <VuiTypography
          variant="xxs"
          fontWeight="medium"
          mb="20px"
          color="text"
          textTransform="uppercase"
        >
          account
        </VuiTypography>
        {/* Change Password Option with Edit Button */}
        <VuiBox display="flex" alignItems="center" mb="14px">
          <VuiBox width="80%" ml={0} display="flex" alignItems="center">
            <VuiTypography variant="button" fontWeight="regular" color="text">
              Change Password
            </VuiTypography>
          </VuiBox>
          <VuiBox ml={2}>
            <IconButton size="small" color="info" onClick={() => setShowPasswordEdit(true)}>
              <EditIcon />
            </IconButton>
          </VuiBox>
        </VuiBox>
        {/* Two Step Verification - SMS and Email with Edit Button */}
        <VuiBox display="flex" alignItems="center" mb="14px">
          <VuiBox width="80%" ml={0} display="flex" alignItems="center">
            <VuiTypography variant="button" fontWeight="regular" color="text">
              Two Step Verification
            </VuiTypography>
          </VuiBox>
          <VuiBox ml={2}>
            <IconButton size="small" color="info" onClick={() => setShowTwoStepEdit(true)}>
              <EditIcon />
            </IconButton>
          </VuiBox>
        </VuiBox>
        <VuiBox mb="6px">
          <VuiTypography variant="xxs" fontWeight="medium" color="text" textTransform="uppercase">
            application
          </VuiTypography>
        </VuiBox>
        {/* Text Notification with Edit Button */}
        <VuiBox display="flex" alignItems="center" mb="14px">
          <VuiBox width="80%" ml={0} display="flex" alignItems="center">
            <VuiTypography variant="button" fontWeight="regular" color="text">
              Notifications
            </VuiTypography>
          </VuiBox>
          <VuiBox ml={2}>
            <IconButton size="small" color="info" onClick={() => setShowNotifEdit(true)}>
              <EditIcon />
            </IconButton>
          </VuiBox>
        </VuiBox>
        {/* Connect Calendar Option */}
        <VuiBox display="flex" alignItems="center" mb="14px">
          <VuiBox width="80%" ml={0} display="flex" alignItems="center">
            <VuiTypography variant="button" fontWeight="regular" color="text">
              Connect Calendar
            </VuiTypography>
          </VuiBox>
          <VuiBox ml={2}>
            <IconButton size="small" color="info" onClick={() => setShowCalendarDialog(true)}>
              <EditIcon />
            </IconButton>
          </VuiBox>
        </VuiBox>
        {/* Account Management */}
        <VuiBox mb="6px">
          <VuiTypography variant="xxs" fontWeight="medium" color="text" textTransform="uppercase">
            account management
          </VuiTypography>
        </VuiBox>
        <VuiBox display="flex" mb="14px">
          <VuiBox width="80%" ml={0}>
            <VuiTypography variant="button" fontWeight="regular" color="text">
              Deactivate Account
            </VuiTypography>
          </VuiBox>
          <VuiBox ml={2}>
            <VuiSwitch color="info" checked={deactivateAccount} onChange={() => setDeactivateAccount(!deactivateAccount)} />
          </VuiBox>
        </VuiBox>
        {/* Password Edit Dialog - modern, functional */}
    <Dialog open={showPasswordEdit} onClose={() => setShowPasswordEdit(false)}
          PaperProps={{
            sx: {
              backgroundColor: 'rgba(30, 32, 60, 0.7)',
              boxShadow: 24,
              borderRadius: 3,
              color: 'white',
      minWidth: 520,
      maxWidth: 640,
              backdropFilter: 'blur(4px)',
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, color: '#fff', pb: 0.5 }}>Change password</DialogTitle>
          <DialogContent sx={{ pt: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            {pwError && <Alert severity="error" sx={{ mb: 1 }}>{pwError}</Alert>}
            {pwSuccess && <Alert severity="success" sx={{ mb: 1 }}>{pwSuccess}</Alert>}
            {/* Subtle header note */}
            <VuiBox display="flex" alignItems="flex-start" gap={1} mb={1} sx={{ width: '100%', maxWidth: '100%', pr: 1 }}>
              <InfoOutlined sx={{ fontSize: 18, color: 'rgba(255,255,255,0.7)', mt: 0.25 }} />
              <VuiTypography variant="caption" color="text" sx={{ opacity: 0.9, lineHeight: 1.4 }}>
                For your security, you may be asked to sign in again.
              </VuiTypography>
            </VuiBox>
            {/* Section: Current password */}
            <VuiTypography variant="button" fontWeight="bold" color="text" sx={{ mb: 0.5, px: 0.5, maxWidth: 260 }}>Current password</VuiTypography>
            <TextField
              type={showPwCurrent ? 'text' : 'password'}
              value={pwCurrent}
              onChange={(e) => setPwCurrent(e.target.value)}
              placeholder="Current password"
              fullWidth
              margin="dense"
              size="small"
              sx={fieldSx}
              onKeyDown={(e) => setCapsCurrent(!!e.getModifierState && e.getModifierState('CapsLock'))}
              onKeyUp={(e) => setCapsCurrent(!!e.getModifierState && e.getModifierState('CapsLock'))}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ mr: -1.25, pr: 0, '& .MuiIconButton-root': { p: 0.25 } }}>
                    <IconButton size="small" onClick={() => setShowPwCurrent(s => !s)} color="info" aria-label="toggle current password visibility" edge="end" sx={{ mr: -0.5 }}>
                      {showPwCurrent ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            {capsCurrent && (
              <VuiBox display="flex" alignItems="center" gap={0.5} pl={0.5} sx={{ mt: 0.5, mb: 0.5 }}>
                <WarningAmber sx={{ fontSize: 16, color: '#ffcc66' }} />
                <VuiTypography variant="caption" color="text">Caps Lock is ON</VuiTypography>
              </VuiBox>
            )}
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', my: 1.25 }} />
            {/* Section: New password */}
            <VuiTypography variant="button" fontWeight="bold" color="text" sx={{ mb: 0.5, px: 0.5, maxWidth: 260 }}>New password</VuiTypography>
            <TextField
              type={showPwNew ? 'text' : 'password'}
              value={pwNew}
              onChange={(e) => { setPwNew(e.target.value); if (!showRules) setShowRules(true); }}
              placeholder="New password"
              fullWidth
              margin="dense"
              size="small"
              sx={fieldSx}
              onKeyDown={(e) => setCapsNew(!!e.getModifierState && e.getModifierState('CapsLock'))}
              onKeyUp={(e) => setCapsNew(!!e.getModifierState && e.getModifierState('CapsLock'))}
              helperText={capsNew ? 'Caps Lock is ON' : ' '}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ mr: -1.25, pr: 0, '& .MuiIconButton-root': { p: 0.25 } }}>
                    <IconButton size="small" onClick={() => setShowPwNew(s => !s)} color="info" aria-label="toggle new password visibility" edge="end" sx={{ mr: -0.5 }}>
                      {showPwNew ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              onFocus={() => setShowRules(true)}
              onBlur={() => { if (!pwNew) setShowRules(false); }}
            />
            {showRules && (
                <VuiBox px={1.25} py={1} sx={{ maxWidth: 260, background: 'rgba(24,26,47,0.8)', border: '1px solid #23244a', borderRadius: 2, mb: 1 }}>
                {(() => {
                  const ruleLen = pwNew.length >= 8;
                  const ruleUpper = /[A-Z]/.test(pwNew);
                  const ruleLower = /[a-z]/.test(pwNew);
                  const ruleNum = /[0-9]/.test(pwNew);
                  const ruleSym = /[^A-Za-z0-9]/.test(pwNew);
                  const Rule = ({ ok, label }) => (
                    <VuiBox display="flex" alignItems="center" gap={0.75}>
                      {ok ? <CheckCircle sx={{ fontSize: 16, color: '#56d27e' }} /> : <RadioButtonUnchecked sx={{ fontSize: 16, color: 'rgba(255,255,255,0.35)' }} />}
                      <VuiTypography variant="caption" color="text" sx={{ opacity: ok ? 1 : 0.8 }}>{label}</VuiTypography>
                    </VuiBox>
                  );
                  return (
                    <VuiBox display="grid" sx={{ gridTemplateColumns: '1fr 1fr', columnGap: 2, rowGap: 0.75 }}>
                      <Rule ok={ruleLen} label="8+ characters" />
                      <Rule ok={ruleUpper} label="Uppercase letter" />
                      <Rule ok={ruleLower} label="Lowercase letter" />
                      <Rule ok={ruleNum} label="Number" />
                      <Rule ok={ruleSym} label="Symbol" />
                    </VuiBox>
                  );
                })()}
              </VuiBox>
            )}
            {pwNew && (
                <VuiBox display="flex" alignItems="center" gap={1} sx={{ my: 1, maxWidth: 260 }}>
                <LinearProgress variant="determinate" value={pwStrength(pwNew)} sx={{ flex: 1, height: 6, borderRadius: 1, backgroundColor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { backgroundColor: strengthColor(pwNew) } }} />
                <VuiTypography variant="caption" color="text" sx={{ minWidth: 44, textAlign: 'right', opacity: 0.9 }}>{strengthLabel(pwNew)}</VuiTypography>
              </VuiBox>
            )}
            <TextField
              type={showPwConfirm ? 'text' : 'password'}
              value={pwConfirm}
              onChange={(e) => setPwConfirm(e.target.value)}
              placeholder="Confirm new password"
              fullWidth
              margin="dense"
              size="small"
              sx={fieldSx}
              error={Boolean(pwConfirm) && pwConfirm !== pwNew}
              onKeyDown={(e) => setCapsConfirm(!!e.getModifierState && e.getModifierState('CapsLock'))}
              onKeyUp={(e) => setCapsConfirm(!!e.getModifierState && e.getModifierState('CapsLock'))}
              helperText={Boolean(pwConfirm) && pwConfirm !== pwNew ? 'Passwords do not match.' : (capsConfirm ? 'Caps Lock is ON' : ' ')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ mr: -1.25, pr: 0, '& .MuiIconButton-root': { p: 0.25 } }}>
                    <IconButton size="small" onClick={() => setShowPwConfirm(s => !s)} color="info" aria-label="toggle confirm password visibility" edge="end" sx={{ mr: -0.5 }}>
                      {showPwConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mt: 1 }} />
          </DialogContent>
          <DialogActions sx={{ px: 2, pb: 2, pt: 1, display: 'flex', justifyContent: 'space-between' }}>
            <Button size="small" variant="text" onClick={handleResetEmail} sx={{ color: '#cfd3f7', textTransform: 'none' }}>Send reset email</Button>
            <VuiBox>
              <Button onClick={() => setShowPasswordEdit(false)} sx={{ color: '#a259ec', textTransform: 'none', fontWeight: 600, mr: 1 }}>Close</Button>
              <Button disabled={!canSavePw()} onClick={handlePasswordSave} sx={{ color: '#fff', background: 'linear-gradient(90deg, #3a8dde 0%, #6f7cf7 100%)', textTransform: 'none', fontWeight: 700, px: 2.5 }}>
                {pwSaving ? 'Saving…' : 'Save'}
              </Button>
            </VuiBox>
          </DialogActions>
        </Dialog>
        {/* Notification Edit Dialog (using MUI Dialog, transparent and bigger) */}
        <Dialog open={showNotifEdit} onClose={() => setShowNotifEdit(false)}
          PaperProps={{
            sx: {
              backgroundColor: 'rgba(30, 32, 60, 0.7)',
              boxShadow: 24,
              borderRadius: 3,
              color: 'white',
              minWidth: 400,
              maxWidth: 500,
              backdropFilter: 'blur(4px)',
            },
          }}
        >
          <DialogTitle>Edit Notification Settings</DialogTitle>
          <DialogContent>
            <VuiTypography variant="button" fontWeight="bold" mb={1} color="text">Contact Information</VuiTypography>
            <input type="email" placeholder="Email" value={notifEmail} onChange={e => setNotifEmail(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 6, border: '1px solid #ccc', marginBottom: 8, fontSize: 18 }} />
            <input type="tel" placeholder="Phone Number" value={notifPhone} onChange={e => setNotifPhone(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 6, border: '1px solid #ccc', fontSize: 18 }} />
            <VuiTypography variant="button" fontWeight="bold" mt={2} mb={1} color="text">Settings</VuiTypography>
            <VuiBox display="flex" alignItems="center" mb={1}>
              <VuiSwitch color="info" checked={notifEmailEnabled} onChange={() => setNotifEmailEnabled(!notifEmailEnabled)} />
              <VuiTypography variant="button" fontWeight="regular" color="text" ml={1}>Email</VuiTypography>
            </VuiBox>
            <VuiBox display="flex" alignItems="center">
              <VuiSwitch color="info" checked={notifTextEnabled} onChange={() => setNotifTextEnabled(!notifTextEnabled)} />
              <VuiTypography variant="button" fontWeight="regular" color="text" ml={1}>Text Message</VuiTypography>
            </VuiBox>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowNotifEdit(false)} color="primary">Close</Button>
            <Button color="primary">Save</Button>
          </DialogActions>
        </Dialog>
        {/* Two Step Verification Edit Dialog (transparent and bigger) */}
        <Dialog open={showTwoStepEdit} onClose={() => setShowTwoStepEdit(false)}
          PaperProps={{
            sx: {
              backgroundColor: 'rgba(30, 32, 60, 0.7)',
              boxShadow: 24,
              borderRadius: 3,
              color: 'white',
              minWidth: 400,
              maxWidth: 500,
              backdropFilter: 'blur(4px)',
            },
          }}
        >
          <DialogTitle>Two Step Verification</DialogTitle>
          <DialogContent>
            <VuiTypography variant="button" fontWeight="bold" mb={1} color="text">Choose Verification Methods</VuiTypography>
            <VuiBox display="flex" alignItems="center" mb={2}>
              <VuiSwitch color="info" checked={twoStepSMS} onChange={() => setTwoStepSMS(!twoStepSMS)} />
              <VuiTypography variant="button" fontWeight="regular" color="text" ml={1}>SMS</VuiTypography>
            </VuiBox>
            <VuiBox display="flex" alignItems="center" mb={2}>
              <VuiSwitch color="info" checked={twoStepEmail} onChange={() => setTwoStepEmail(!twoStepEmail)} />
              <VuiTypography variant="button" fontWeight="regular" color="text" ml={1}>Email</VuiTypography>
            </VuiBox>
            <VuiBox display="flex" alignItems="center">
              <VuiSwitch color="info" checked={twoStepApp} onChange={() => setTwoStepApp(!twoStepApp)} />
              <VuiTypography variant="button" fontWeight="regular" color="text" ml={1}>Authenticator App</VuiTypography>
            </VuiBox>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowTwoStepEdit(false)} color="primary">Close</Button>
            <Button color="primary">Save</Button>
          </DialogActions>
        </Dialog>
        {/* Connect Calendar Dialog */}
        <Dialog open={showCalendarDialog} onClose={() => setShowCalendarDialog(false)}
          PaperProps={{
            sx: {
              backgroundColor: 'rgba(30, 32, 60, 0.7)',
              boxShadow: 24,
              borderRadius: 3,
              color: 'white',
              minWidth: 400,
              maxWidth: 500,
              backdropFilter: 'blur(4px)',
            },
          }}
        >
          <DialogTitle>Connect Calendar</DialogTitle>
          <DialogContent>
            <VuiTypography variant="button" fontWeight="bold" mb={2} color="text">Choose a calendar to connect:</VuiTypography>
            <VuiBox display="flex" flexDirection="column" gap={2}>
              <Button variant="contained" color="primary" onClick={() => {
                const popup = window.open('/api/auth/google', 'google-oauth', 'width=500,height=700');
                const handleMessage = (event) => {
                  if (event.data && event.data.type === 'google-oauth') {
                    if (event.data.code || event.data.accessToken) {
                      // Send code or token to backend for exchange and sync
                      fetch('/api/auth/google/callback', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ code: event.data.code, accessToken: event.data.accessToken })
                      })
                      .then(res => res.json())
                      .then(data => {
                        setShowCalendarDialog(false);
                        setCalendarSnackbar(true);
                        refreshCalendarStatus();
                      });
                    }
                    if (popup) popup.close();
                    window.removeEventListener('message', handleMessage);
                  }
                };
                window.addEventListener('message', handleMessage);
              }} sx={{ mb: 2 }}>
                Connect Google Calendar
              </Button>
              <Button variant="contained" color="secondary" onClick={() => setShowICalInput(true)}>
                Connect iCalendar (iOS)
              </Button>
              {showICalInput && (
                <VuiBox mt={2}>
                  <input type="text" placeholder="Paste iCal URL here" value={icalUrl} onChange={e => setICalUrl(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }} />
                  <Button onClick={handleICalSave} color="primary" sx={{ mt: 1, ml: 1 }}>Save</Button>
                </VuiBox>
              )}
              {calendarConnected && (
                <VuiTypography variant="button" color="success.main" mt={2}>Calendar Connected</VuiTypography>
              )}
            </VuiBox>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowCalendarDialog(false)} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={calendarSnackbar}
          autoHideDuration={4000}
          onClose={() => setCalendarSnackbar(false)}
          message="Google Calendar connected!"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </VuiBox>
    </Card>
  );
}

export default PlatformSettings;
