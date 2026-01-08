import AppBar from "@mui/material/AppBar";
// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
// Images
import burceMars from "assets/images/avatar-simmmple.png";
import sunset from "assets/images/sunset.png";
// Vision UI Dashboard React base styles
import breakpoints from "assets/theme/base/breakpoints";
import VuiAvatar from "components/VuiAvatar";
// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
// Vision UI Dashboard React icons
import { IoCube } from "react-icons/io5";
import { FaDog, FaUsers } from "react-icons/fa";
// Vision UI Dashboard React example components
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function Header() {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [avatar, setAvatar] = useState(sunset);
  const [profile, setProfile] = useState({
    name: 'name',
    email: 'name@example.com',
    avatar: sunset,
  });
  const [editProfile, setEditProfile] = useState(profile);
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.lg
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    /** 
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener("resize", handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  useEffect(() => {
    // Set tab based on current path
    if (location.pathname === "/profile") setTabValue(0);
    else if (location.pathname === "/profile/family") setTabValue(1);
    else if (location.pathname === "/profile/pets") setTabValue(2);
  }, [location.pathname]);

  const handleSetTabValue = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 0) history.push("/profile");
    if (newValue === 1) history.push("/profile/family");
    if (newValue === 2) history.push("/profile/pets");
  };

  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);
  const handleProfileChange = (e) => {
    setEditProfile({ ...editProfile, [e.target.name]: e.target.value });
  };
  const handleProfileSave = () => {
    setProfile(editProfile);
    setAvatar(editProfile.avatar);
    setEditOpen(false);
  };
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setEditProfile({ ...editProfile, avatar: ev.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <VuiBox position="relative">
      <DashboardNavbar light />
        <Card
        className="profile-header-card"
        sx={{
          px: 3,
          mt: 2,
        }}
      >
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          sx={({ breakpoints }) => ({
            [breakpoints.up("xs")]: {
              gap: "16px",
            },
            [breakpoints.up("xs")]: {
              gap: "0px",
            },
            [breakpoints.up("xl")]: {
              gap: "0px",
            },
          })}
        >
          <Grid
            item
            xs={12}
            md={1.7}
            lg={1.5}
            xl={1.2}
            xxl={0.8}
            display="flex"
            sx={({ breakpoints }) => ({
              [breakpoints.only("sm")]: {
                justifyContent: "center",
                alignItems: "center",
              },
            })}
          >
            <VuiBox position="relative" sx={{ cursor: 'pointer', '&:hover .edit-avatar-btn': { opacity: 1 } }}>
              <VuiAvatar
                src={profile.avatar}
                alt="profile-image"
                variant="rounded"
                size="xl"
                shadow="sm"
              />
              <IconButton
                className="edit-avatar-btn"
                size="large"
                onClick={handleEditOpen}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'none',
                  color: '#fff',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  zIndex: 2,
                  fontSize: 44,
                  p: 0,
                  '&:hover': { background: 'none', color: '#6a6afc' },
                }}
              >
                <EditIcon sx={{ fontSize: 44 }} />
              </IconButton>
            </VuiBox>
          </Grid>
          <Grid item xs={12} md={4.3} lg={4} xl={3.8} xxl={7}>
            <VuiBox
              height="100%"
              mt={0.5}
              lineHeight={1}
              display="flex"
              flexDirection="column"
              sx={({ breakpoints }) => ({
                [breakpoints.only("sm")]: {
                  justifyContent: "center",
                  alignItems: "center",
                },
              })}
            >
              <VuiTypography variant="lg" color="white" fontWeight="bold">
                {profile.name}
              </VuiTypography>
              <VuiTypography variant="button" color="text" fontWeight="regular">
                {profile.email}
              </VuiTypography>
            </VuiBox>
          </Grid>
          <Grid item xs={12} md={6} lg={6.5} xl={6} xxl={4} sx={{ ml: "auto" }}>
            <AppBar position="static">
              <Tabs
                orientation={tabsOrientation}
                value={tabValue}
                onChange={handleSetTabValue}
                sx={{ background: "transparent", display: "flex", justifyContent: "flex-end" }}
              >
                <Tab label="PERSONAL" icon={<IoCube color="white" size="16px" />} />
                <Tab label="FAMILY" icon={<FaUsers color="white" size="16px" />} />
                <Tab label="PETS" icon={<FaDog color="white" size="16px" />} />
              </Tabs>
            </AppBar>
          </Grid>
        </Grid>
      </Card>
      <Dialog open={editOpen} onClose={handleEditClose} maxWidth="xs" fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(30, 32, 60, 0.9)',
            boxShadow: 24,
            borderRadius: 3,
            color: 'white',
            backdropFilter: 'blur(4px)',
          },
        }}
      >
        <DialogTitle sx={{ fontSize: 20, fontWeight: 700, color: '#fff', mb: 1 }}>Edit Profile</DialogTitle>
        <DialogContent>
          <VuiBox display="flex" flexDirection="column" alignItems="center" mb={2}>
            <VuiAvatar src={editProfile.avatar} alt="avatar" size="xl" variant="rounded" shadow="sm" sx={{ mb: 2 }} />
            <Button variant="contained" component="label" sx={{ mb: 2, background: 'linear-gradient(90deg,#6a6afc,#8b8bfc)', color: '#fff', borderRadius: 2, fontWeight: 600, textTransform: 'none', px: 3, py: 1, boxShadow: '0 2px 8px #6a6afc33' }}>
              Change Picture
              <input id="avatarFile" name="avatarFile" type="file" accept="image/*" hidden onChange={handleAvatarChange} />
            </Button>
          </VuiBox>
          <TextField label="Name" name="name" value={editProfile.name} onChange={handleProfileChange} fullWidth sx={{ mb: 2, input: { color: '#fff' }, label: { color: '#bdbdfc' }, '& .MuiOutlinedInput-root': { background: 'rgba(40,42,70,0.5)', borderRadius: 2 } }} />
          <TextField label="Email" name="email" value={editProfile.email} onChange={handleProfileChange} fullWidth sx={{ mb: 2, input: { color: '#fff' }, label: { color: '#bdbdfc' }, '& .MuiOutlinedInput-root': { background: 'rgba(40,42,70,0.5)', borderRadius: 2 } }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} sx={{ color: '#fff', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 2, py: 1, background: 'rgba(40,42,70,0.3)', '&:hover': { background: 'rgba(40,42,70,0.5)' } }}>Cancel</Button>
          <Button onClick={handleProfileSave} sx={{ color: '#fff', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 2, py: 1, background: 'linear-gradient(90deg,#6a6afc,#8b8bfc)', boxShadow: '0 2px 8px #6a6afc33', '&:hover': { background: 'linear-gradient(90deg,#8b8bfc,#6a6afc)' } }}>Save</Button>
        </DialogActions>
      </Dialog>
    </VuiBox>
  );
}

export default Header;
