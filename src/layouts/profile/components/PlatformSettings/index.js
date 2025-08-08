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

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiSwitch from "components/VuiSwitch";

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
    <Card sx={{ minHeight: "490px", height: "100%" }}>
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
        {/* Password Edit Dialog (using MUI Dialog, transparent and bigger) */}
        <Dialog open={showPasswordEdit} onClose={() => setShowPasswordEdit(false)}
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
          <DialogTitle>Edit Password</DialogTitle>
          <DialogContent>
            <input type="password" placeholder="New Password" style={{ width: '100%', padding: 12, borderRadius: 6, border: '1px solid #ccc', marginTop: 8, fontSize: 18 }} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowPasswordEdit(false)} color="primary">Close</Button>
            <Button color="primary">Save</Button>
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
