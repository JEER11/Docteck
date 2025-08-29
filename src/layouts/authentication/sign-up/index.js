import { useEffect, useState } from "react";

// react-router-dom components
import { Link, useHistory } from "react-router-dom";

// @mui material components
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";

// Icons
import { FaMicrosoft, FaFacebook, FaGoogle, FaYahoo } from "react-icons/fa";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiInput from "components/VuiInput";
import VuiButton from "components/VuiButton";
import VuiSwitch from "components/VuiSwitch";
import GradientBorder from "examples/GradientBorder";

// Vision UI Dashboard assets
import radialGradient from "assets/theme/functions/radialGradient";
import rgba from "assets/theme/functions/rgba";
import palette from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgSignIn from "assets/images/Jellybackg.jpg";

// hooks
import { useAuth } from "hooks/useAuth";
import { hasFirebaseConfig } from "lib/firebase";

function SignUp() {
  const history = useHistory();
  const [rememberMe, setRememberMe] = useState(true);
  const { signup, signinWithGoogle, signinWithFacebook, signinWithMicrosoft, signinWithYahoo, loading, user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  // If already authenticated (e.g., after successful sign-up), go to profile
  useEffect(() => {
    if (user) {
      history.push('/profile');
    }
  }, [user, history]);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError("");
    try {
  await signup(email, password, { fullName: name });
  // Go to profile to complete required info
  history.push('/profile');
    } catch (err) {
      setError(err.message);
    }
  };


  // Unified social sign-in error handler
  const handleSocialSignin = async (fn) => {
    setError("");
    try {
      await fn();
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user" || err.code === "auth/cancelled-popup-request") {
        setError("Sign-in popup was closed before completing.");
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <CoverLayout
      title="Welcome"
      color="white"
      description="We work together to take care of you, join us to regain a healthy body and mind."
      image={bgSignIn}
      premotto="YOU ARE FIRST:"
      motto="BODY AND MIND"
      cardContent
    >
      <GradientBorder borderRadius={borders.borderRadius.form} minWidth="100%" maxWidth="100%">
        <VuiBox
          component="form"
          role="form"
          borderRadius="inherit"
          p="45px"
          sx={({ palette: { secondary } }) => ({
            backgroundColor: secondary.focus,
          })}
          onSubmit={handleSubmit}
        >
          <VuiTypography
            color="white"
            fontWeight="bold"
            textAlign="center"
            mb="24px"
            sx={({ typography: { size } }) => ({
              fontSize: size.lg,
            })}
          >
            Register with
          </VuiTypography>
          <Stack mb="25px" justifyContent="center" alignItems="center" direction="row" spacing={2}>
            <GradientBorder borderRadius="xl">
              <IconButton onClick={() => handleSocialSignin(async () => { await signinWithFacebook(); history.push('/profile'); })} disabled={loading}>
                <Icon as={FaFacebook} w="30px" h="30px" sx={({ palette: { white } }) => ({ color: white.focus })} />
              </IconButton>
            </GradientBorder>
            <GradientBorder borderRadius="xl">
              <IconButton onClick={() => handleSocialSignin(async () => { await signinWithMicrosoft(); history.push('/profile'); })} disabled={loading}>
                <Icon as={FaMicrosoft} w="30px" h="30px" sx={({ palette: { white } }) => ({ color: white.focus })} />
              </IconButton>
            </GradientBorder>
            <GradientBorder borderRadius="xl">
              <IconButton onClick={() => handleSocialSignin(async () => { await signinWithGoogle(); history.push('/profile'); })} disabled={loading}>
                <Icon as={FaGoogle} w="30px" h="30px" sx={({ palette: { white } }) => ({ color: white.focus })} />
              </IconButton>
            </GradientBorder>
            <GradientBorder borderRadius="xl">
              <IconButton onClick={() => handleSocialSignin(async () => { await signinWithYahoo(); history.push('/profile'); })} disabled={loading}>
                <Icon as={FaYahoo} w="30px" h="30px" sx={({ palette: { white } }) => ({ color: white.focus })} />
              </IconButton>
            </GradientBorder>
          </Stack>
          <VuiTypography
            color="text"
            fontWeight="bold"
            textAlign="center"
            mb="14px"
            sx={({ typography: { size } }) => ({ fontSize: size.lg })}
          >
            or
          </VuiTypography>
          {!hasFirebaseConfig && (
            <VuiTypography color="error" fontWeight="medium" mt={2} mb={1} textAlign="center">
              Authentication isn’t configured. Set your Firebase keys, then refresh.
            </VuiTypography>
          )}
          {error && (
            <VuiTypography color="error" fontWeight="medium" mt={2} mb={1} textAlign="center">
              {error}
            </VuiTypography>
          )}
          <VuiBox mb={2}>
            <VuiBox mb={1} ml={0.5}>
              <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                Name
              </VuiTypography>
            </VuiBox>
            <GradientBorder
              minWidth="100%"
              borderRadius={borders.borderRadius.lg}
              padding="1px"
              backgroundImage={radialGradient(
                palette.gradients.borderLight.main,
                palette.gradients.borderLight.state,
                palette.gradients.borderLight.angle
              )}
            >
              <VuiInput
                placeholder="Your full name..."
                value={name}
                onChange={e => setName(e.target.value)}
                sx={({ typography: { size } }) => ({
                  fontSize: size.sm,
                })}
              />
            </GradientBorder>
          </VuiBox>
          <VuiBox mb={2}>
            <VuiBox mb={1} ml={0.5}>
              <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                Email
              </VuiTypography>
            </VuiBox>
            <GradientBorder
              minWidth="100%"
              borderRadius={borders.borderRadius.lg}
              padding="1px"
              backgroundImage={radialGradient(
                palette.gradients.borderLight.main,
                palette.gradients.borderLight.state,
                palette.gradients.borderLight.angle
              )}
            >
              <VuiInput
                type="email"
                placeholder="Your email..."
                value={email}
                onChange={e => setEmail(e.target.value)}
                sx={({ typography: { size } }) => ({
                  fontSize: size.sm,
                })}
              />
            </GradientBorder>
          </VuiBox>
          <VuiBox mb={2}>
            <VuiBox mb={1} ml={0.5}>
              <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                Password
              </VuiTypography>
            </VuiBox>
            <GradientBorder
              minWidth="100%"
              borderRadius={borders.borderRadius.lg}
              padding="1px"
              backgroundImage={radialGradient(
                palette.gradients.borderLight.main,
                palette.gradients.borderLight.state,
                palette.gradients.borderLight.angle
              )}
            >
              <VuiInput
                type={showPassword ? "text" : "password"}
                placeholder="Your password..."
                value={password}
                onChange={e => setPassword(e.target.value)}
                icon={{
                  direction: "right",
                  component: (
                    <IconButton
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      size="small"
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                      sx={({ palette: { white } }) => ({ color: white.main })}
                    >
                      <Icon fontSize="small">{showPassword ? "visibility_off" : "visibility"}</Icon>
                    </IconButton>
                  ),
                }}
                sx={({ typography: { size } }) => ({
                  fontSize: size.sm,
                })}
              />
            </GradientBorder>
          </VuiBox>
          <VuiBox display="flex" alignItems="center">
            <VuiSwitch color="info" checked={rememberMe} onChange={handleSetRememberMe} />
            <VuiTypography
              variant="caption"
              color="white"
              fontWeight="medium"
              onClick={handleSetRememberMe}
              sx={{ cursor: "pointer", userSelect: "none" }}
            >
              &nbsp;&nbsp;&nbsp;&nbsp;Remember me
            </VuiTypography>
          </VuiBox>
          <VuiBox mt={4} mb={1}>
            <VuiButton color="info" fullWidth sx={{ background: 'rgba(33,150,243,0.5)' }} type="submit" onClick={handleSubmit} disabled={loading || !hasFirebaseConfig || !name || !email || !password}>
              SIGN UP
            </VuiButton>
          </VuiBox>
          <VuiBox mt={3} textAlign="center">
            <VuiTypography variant="button" color="text" fontWeight="regular">
              Already have an account?{" "}
              <VuiTypography
                component={Link}
                to="/authentication/sign-in"
                variant="button"
                color="white"
                fontWeight="medium"
              >
                Sign in
              </VuiTypography>
            </VuiTypography>
          </VuiBox>
        </VuiBox>
      </GradientBorder>
    </CoverLayout>
  );
}

export default SignUp;
