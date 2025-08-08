import { useState } from "react";

// react-router-dom components
import { Link } from "react-router-dom";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiInput from "components/VuiInput";
import VuiButton from "components/VuiButton";
import VuiSwitch from "components/VuiSwitch";
import GradientBorder from "examples/GradientBorder";

// Vision UI Dashboard assets
import radialGradient from "assets/theme/functions/radialGradient";
import palette from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgSignIn from "assets/images/Jellybackg.jpg";
import { useAuth } from "hooks/useAuth";
import { FaMicrosoft, FaFacebook, FaGoogle, FaYahoo } from "react-icons/fa";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";

function SignIn() {
  const [rememberMe, setRememberMe] = useState(true);
  const { signin, signinWithGoogle, signinWithFacebook, signinWithMicrosoft, signinWithYahoo, user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSetRememberMe = () => setRememberMe(!rememberMe);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signin(email, password);
      // Redirect or show success
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed before completing.');
      } else {
        setError(err.message);
      }
    }
  };

  // Helper to wrap social sign-in handlers for pretty error handling
  const handleSocialSignin = async (fn) => {
    setError("");
    try {
      await fn();
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed before completing.');
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <CoverLayout
      title="Welcome back"
      color="white"
      description="Enter your email and password to sign in"
      premotto="YOU ARE FIRST:"
      motto="BODY AND MIND"
      image={bgSignIn}
    >
      <VuiBox component="form" role="form" onSubmit={handleSubmit}>
        <VuiBox mb={2}>
          <VuiBox mb={1} ml={0.5}>
            <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
              Email
            </VuiTypography>
          </VuiBox>
          <GradientBorder
            minWidth="100%"
            padding="1px"
            borderRadius={borders.borderRadius.lg}
            backgroundImage={radialGradient(
              palette.gradients.borderLight.main,
              palette.gradients.borderLight.state,
              palette.gradients.borderLight.angle
            )}
          >
            <VuiInput type="email" placeholder="Your email..." fontWeight="500" value={email} onChange={e => setEmail(e.target.value)} />
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
              type="password"
              placeholder="Your password..."
              value={password}
              onChange={e => setPassword(e.target.value)}
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
        {error && (
          <VuiTypography color="error" fontWeight="medium" mt={2} mb={1} textAlign="center">
            {error}
          </VuiTypography>
        )}
        <VuiBox mt={4} mb={1}>
          <VuiButton color="info" fullWidth sx={{ background: 'rgba(33,150,243,0.5)' }} type="submit" disabled={loading}>
            SIGN IN
          </VuiButton>
        </VuiBox>
        <VuiTypography color="white" fontWeight="bold" textAlign="center" mb="18px" mt={2}>
          Or sign in with
        </VuiTypography>
        <Stack mb={2} justifyContent="center" alignItems="center" direction="row" spacing={2}>
          <GradientBorder borderRadius="xl">
            <IconButton onClick={() => handleSocialSignin(signinWithFacebook)} disabled={loading}>
              <Icon as={FaFacebook} w="30px" h="30px" sx={({ palette: { white } }) => ({ color: white.focus })} />
            </IconButton>
          </GradientBorder>
          <GradientBorder borderRadius="xl">
            <IconButton onClick={() => handleSocialSignin(signinWithMicrosoft)} disabled={loading}>
              <Icon as={FaMicrosoft} w="30px" h="30px" sx={({ palette: { white } }) => ({ color: white.focus })} />
            </IconButton>
          </GradientBorder>
          <GradientBorder borderRadius="xl">
            <IconButton onClick={() => handleSocialSignin(signinWithGoogle)} disabled={loading}>
              <Icon as={FaGoogle} w="30px" h="30px" sx={({ palette: { white } }) => ({ color: white.focus })} />
            </IconButton>
          </GradientBorder>
          <GradientBorder borderRadius="xl">
            <IconButton onClick={() => handleSocialSignin(signinWithYahoo)} disabled={loading}>
              <Icon as={FaYahoo} w="30px" h="30px" sx={({ palette: { white } }) => ({ color: white.focus })} />
            </IconButton>
          </GradientBorder>
        </Stack>
        <VuiBox mt={3} textAlign="center">
          <VuiTypography variant="button" color="text" fontWeight="regular">
            Don&apos;t have an account?{" "}
            <VuiTypography
              component={Link}
              to="/authentication/sign-up"
              variant="button"
              color="white"
              fontWeight="medium"
            >
              Sign up
            </VuiTypography>
          </VuiTypography>
        </VuiBox>
      </VuiBox>
      {/* Removed unwanted overlay/line VuiBox at the bottom of the sign-in page */}
    </CoverLayout>
  );
}

export default SignIn;
