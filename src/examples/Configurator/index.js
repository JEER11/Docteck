//
// MIT: Portions © 2021 Creative Tim & Simmmple (Vision UI Free React). See LICENSE.md.
//

import { useState } from "react";
import { useHistory } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";

// react-github-btn
import GitHubButton from "react-github-btn";

// @mui material components
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

// @mui icons
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiButton from "components/VuiButton";
import VuiSwitch from "components/VuiSwitch";

// Custom styles for the Configurator
import ConfiguratorRoot from "examples/Configurator/ConfiguratorRoot";

// Vision UI Dashboard React context
import { useVisionUIController, setOpenConfigurator, setFixedNavbar, setTransparentSidenav, setSidenavColor } from "context";
import { useAuth } from "hooks/useAuth";

function Configurator() {
  // Dialog state for popups
  const [openContact, setOpenContact] = useState(false);
  const [openPrivacy, setOpenPrivacy] = useState(false);
  const [openFeedback, setOpenFeedback] = useState(false);
  const { i18n } = useTranslation();
  const history = useHistory();
  const [controller, dispatch] = useVisionUIController();
  const { openConfigurator, fixedNavbar, transparentSidenav, sidenavColor } = controller;
  const { signout, user } = useAuth();
  const [lang, setLang] = useState(i18n.language || "en");
  const sidenavColors = ["primary", "info", "success", "warning", "error"];
  const languageOptions = [
    { code: "en", label: "English" },
    { code: "es", label: "Español" },
  ];

  const handleCloseConfigurator = () => setOpenConfigurator(dispatch, false);
  const handleTransparentSidenav = () => setTransparentSidenav(dispatch, true);
  const handleWhiteSidenav = () => setTransparentSidenav(dispatch, false);
  const handleFixedNavbar = () => setFixedNavbar(dispatch, !fixedNavbar);
  const handleChangeLang = (_, option) => {
    if (!option) return;
    const newLng = option.code;
    setLang(newLng);
    i18n.changeLanguage(newLng);
  };

  // helper styles for compact buttons (kept for future appearance options)
  const sidenavTypeButtonsStyles = ({ functions: { pxToRem }, boxShadows: { buttonBoxShadow } }) => ({
    height: pxToRem(42),
    boxShadow: buttonBoxShadow.main,
    "&:hover, &:focus": { opacity: 1 },
  });

  return (
    <ConfiguratorRoot variant="permanent" ownerState={{ openConfigurator }}>
      <VuiBox
        backgroundColor="black"
        display="flex"
        justifyContent="space-between"
        alignItems="baseline"
        pt={3}
        pb={0.8}
        px={3}
      >
        <VuiBox>
          <VuiTypography color="white" variant="h5" fontWeight="bold">
            App Settings
          </VuiTypography>
          <VuiTypography variant="body2" color="white" fontWeight="bold">
            Customize your experience.
          </VuiTypography>
        </VuiBox>

        <Icon
          sx={({ typography: { size, fontWeightBold }, palette: { white, dark } }) => ({
            fontSize: `${size.md} !important`,
            fontWeight: `${fontWeightBold} !important`,
            stroke: `${white.main} !important`,
            strokeWidth: "2px",
            cursor: "pointer",
            mt: 2,
          })}
          onClick={handleCloseConfigurator}
        >
          close
        </Icon>
      </VuiBox>

      <Divider light />

      <VuiBox pt={1.25} pb={3} px={3}>
        {/* Navigation style & colors (renamed from Sidenav) */}
        <VuiBox>
          <VuiTypography variant="h6" color="white">
            Navigation Accent
          </VuiTypography>

          <VuiBox mb={0.5}>
            {sidenavColors.map((color) => (
              <IconButton
                key={color}
                sx={({ borders: { borderWidth }, palette: { white, dark }, transitions }) => ({
                  width: "24px",
                  height: "24px",
                  padding: 0,
                  border: `${borderWidth[1]} solid ${white.main}`,
                  borderColor: sidenavColor === color && dark.main,
                  transition: transitions.create("border-color", {
                    easing: transitions.easing.sharp,
                    duration: transitions.duration.shorter,
                  }),
                  backgroundImage: ({ functions: { linearGradient }, palette: { gradients } }) =>
                    linearGradient(gradients[color].main, gradients[color].state),

                  "&:not(:last-child)": { mr: 1 },
                  "&:hover, &:focus, &:active": { borderColor: dark.main },
                })}
                onClick={() => setSidenavColor(dispatch, color)}
              />
            ))}
          </VuiBox>
        </VuiBox>

        <VuiBox mt={3} lineHeight={1}>
          <VuiTypography variant="h6" color="white">
            Navigation Style
          </VuiTypography>
          <VuiTypography variant="button" color="text" fontWeight="regular">
            Choose between two navigation styles.
          </VuiTypography>

          <VuiBox sx={{ display: "flex", mt: 2 }}>
            <VuiButton
              color="info"
              variant={transparentSidenav ? "contained" : "outlined"}
              onClick={handleTransparentSidenav}
              fullWidth
              sx={{ mr: 1, ...sidenavTypeButtonsStyles }}
            >
              Transparent
            </VuiButton>
            <VuiButton
              color="info"
              variant={transparentSidenav ? "outlined" : "contained"}
              onClick={handleWhiteSidenav}
              fullWidth
              sx={sidenavTypeButtonsStyles}
            >
              Opaque
            </VuiButton>
          </VuiBox>
        </VuiBox>

        <VuiBox mt={3} mb={2} lineHeight={1}>
          <VuiTypography variant="h6" color="white">
            Sticky Header
          </VuiTypography>

          {/* <Switch checked={fixedNavbar} onChange={handleFixedNavbar} color="info" /> */}
          <VuiSwitch checked={fixedNavbar} onChange={handleFixedNavbar} color="info" />
        </VuiBox>

        <Divider light />

        {/* Language selector */}
        <VuiBox mt={3} mb={2}>
          <VuiBox display="flex" alignItems="center" mb={1}>
            <Icon sx={{ color: 'white', mr: 1 }}>language</Icon>
            <VuiTypography variant="h6" color="white">Language</VuiTypography>
          </VuiBox>
          <Autocomplete
            disablePortal
            disableClearable
            autoHighlight
            options={languageOptions}
            getOptionLabel={(o) => o.label}
            value={languageOptions.find((o) => o.code === lang) || languageOptions[0]}
            onChange={handleChangeLang}
            sx={{
              '& .MuiSvgIcon-root': { color: 'white' },
              '& .MuiAutocomplete-popupIndicator': { color: 'white' },
              '& .MuiAutocomplete-clearIndicator': { color: 'white' },
              '& .MuiInputBase-root': { color: 'white' },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="filled"
                label="Select language"
                InputLabelProps={{ sx: { color: 'white' } }}
                sx={{
                  '& .MuiFilledInput-root': { backgroundColor: 'rgba(255,255,255,0.08)' },
                  '& .MuiFilledInput-input': { color: 'white' },
                }}
              />
            )}
          />
        </VuiBox>

        <Divider light />

        {/* Useful Links Section */}
        <VuiBox mt={3} mb={2}>
          <VuiTypography variant="h6" color="white" mb={1}>
            Useful Links
          </VuiTypography>
          <VuiBox display="flex" flexDirection="column" gap={1}>
            <VuiButton
              color="info"
              variant="contained"
              fullWidth
              onClick={() => setOpenContact(true)}
            >
              Contact Us
            </VuiButton>
            <VuiButton
              color="info"
              variant="outlined"
              fullWidth
              onClick={() => setOpenPrivacy(true)}
            >
              Privacy Policy
            </VuiButton>
            <VuiButton
              color="info"
              variant="outlined"
              fullWidth
              onClick={() => setOpenFeedback(true)}
            >
              Feedback
            </VuiButton>
            {user && (
              <VuiButton
                color="error"
                variant="contained"
                fullWidth
                onClick={async () => {
                  try {
                    await signout();
                  } catch {}
                  setOpenConfigurator(dispatch, false);
                  history.push('/authentication/sign-in');
                }}
              >
                Sign out
              </VuiButton>
            )}
          </VuiBox>
        </VuiBox>
      </VuiBox>
      {/* Contact Us Dialog */}
      <Dialog open={openContact} onClose={() => setOpenContact(false)}>
        <DialogTitle>Contact Us</DialogTitle>
        <DialogContent>
          <VuiTypography variant="body2">You can reach us at <a href="mailto:support@example.com">support@example.com</a> or fill out the contact form on our website.</VuiTypography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenContact(false)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
      {/* Privacy Policy Dialog */}
      <Dialog open={openPrivacy} onClose={() => setOpenPrivacy(false)}>
        <DialogTitle>Privacy Policy</DialogTitle>
        <DialogContent>
          <VuiTypography variant="body2">Your privacy is important to us. We do not share your data with third parties. For more details, see our full privacy policy on our website.</VuiTypography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPrivacy(false)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
      {/* Feedback Dialog */}
      <Dialog open={openFeedback} onClose={() => setOpenFeedback(false)}>
        <DialogTitle>Feedback</DialogTitle>
        <DialogContent>
          <VuiTypography variant="body2">We value your feedback! Please email us at <a href="mailto:feedback@example.com">feedback@example.com</a> or use the feedback form on our website.</VuiTypography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFeedback(false)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </ConfiguratorRoot>
  );
}

export default Configurator;
// MIT: Portions © 2021 Creative Tim & Simmmple (Vision UI Free React). See LICENSE.md.
