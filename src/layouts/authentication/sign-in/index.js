import { useEffect, useMemo, useRef, useState } from "react";

// react-router-dom components
import { Link, useHistory } from "react-router-dom";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiInput from "components/VuiInput";
import VuiButton from "components/VuiButton";
import VuiSwitch from "components/VuiSwitch";
import GradientBorder from "examples/GradientBorder";
import CircularProgress from "@mui/material/CircularProgress";

// Vision UI Dashboard assets
import radialGradient from "assets/theme/functions/radialGradient";
import palette from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgSignIn from "assets/images/Jellybackg.jpg";
import { useAuth } from "hooks/useAuth";
import { hasFirebaseConfig } from "lib/firebase";
import { auth, db } from "lib/firebase";
import {
  getMultiFactorResolver,
  PhoneAuthProvider,
  RecaptchaVerifier,
  PhoneMultiFactorGenerator,
} from "firebase/auth";
import { TotpMultiFactorGenerator } from "firebase/auth";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { doc, getDoc } from "firebase/firestore";
import { FaMicrosoft, FaFacebook, FaGoogle, FaYahoo } from "react-icons/fa";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { routeLoadingBus } from "components/routeLoadingBus";

function SignIn() {
  const history = useHistory();
  const [rememberMe, setRememberMe] = useState(true);
  const { signin, signinWithGoogle, signinWithFacebook, signinWithMicrosoft, signinWithYahoo, enableGoogle, enableFacebook, enableMicrosoft, enableYahoo, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // MFA state
  const [mfaOpen, setMfaOpen] = useState(false);
  const [mfaResolver, setMfaResolver] = useState(null);
  const [mfaSelectedHint, setMfaSelectedHint] = useState(null);
  const [smsCode, setSmsCode] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [phoneVerificationId, setPhoneVerificationId] = useState(null);
  const recaptchaDivId = useMemo(() => `signin-recaptcha-${Math.random().toString(36).slice(2)}`, []);
  const recaptchaRef = useRef(null);

  // Email 2FA state
  const [email2faOpen, setEmail2faOpen] = useState(false);
  const [email2faCode, setEmail2faCode] = useState("");
  const [email2faMsg, setEmail2faMsg] = useState("");

  const handleSetRememberMe = () => setRememberMe(!rememberMe);


  // Guard long operations to keep UX snappy
  const withTimeout = (promise, ms = 5000) =>
    Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(Object.assign(new Error('Request timed out. Please check your connection and try again.'), { code: 'timeout' })), ms)),
    ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
  setSubmitting(true);
  routeLoadingBus.start();
  await withTimeout(signin(email, password));
  // After sign-in, go to profile for onboarding
  history.push('/profile');
      // Optional email 2FA gate
      if (auth?.currentUser && db) {
        try {
          const snap = await getDoc(doc(db, 'users', auth.currentUser.uid));
          const enabled = Boolean(snap.exists() && snap.data()?.security?.email2faEnabled);
          if (enabled) {
            setEmail2faOpen(true);
          }
        } catch (_) {}
      }
  } catch (err) {
      if (err?.code === 'auth/multi-factor-auth-required') {
        try {
          const resolver = getMultiFactorResolver(auth, err);
          setMfaResolver(resolver);
          // For simplicity pick the first factor; real UI could list options
          setMfaSelectedHint(resolver.hints[0] || null);
          setMfaOpen(true);
          // Prepare invisible recaptcha for SMS if needed
          if ((resolver.hints[0]?.factorId) === 'phone' && !recaptchaRef.current) {
            recaptchaRef.current = new RecaptchaVerifier(auth, recaptchaDivId, { size: 'invisible' });
          }
          return;
        } catch (e) {
          setError(e.message || 'MFA required.');
          return;
        }
      }
      if (err?.code === 'timeout') {
        setError(err.message);
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed before completing.');
      } else {
        setError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to wrap social sign-in handlers for pretty error handling
  const handleSocialSignin = async (fn) => {
    setError("");
    try {
  setSubmitting(true);
  routeLoadingBus.start();
  await withTimeout(fn());
  // After social sign-in, go to profile for onboarding
  history.push('/profile');
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed before completing.');
      } else {
        setError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    // Prefetch common next routes and profile for speed
    import(/* webpackPrefetch: true */ "layouts/dashboard");
    import(/* webpackPrefetch: true */ "layouts/profile");
  }, []);

  const emailOk = /.+@.+\..+/.test(email.trim());
  const pwOk = password.trim().length >= 6; // basic UX check
  const formValid = Boolean(emailOk && pwOk);

  const startSmsSecondFactor = async () => {
    if (!mfaResolver || !mfaSelectedHint) return;
    try {
      const phoneInfoOptions = { multiFactorHint: mfaSelectedHint, session: mfaResolver.session };
      const provider = new PhoneAuthProvider(auth);
      const verificationId = await provider.verifyPhoneNumber(phoneInfoOptions, recaptchaRef.current);
      setPhoneVerificationId(verificationId);
    } catch (e) {
      setError(e.message || 'Failed to send SMS');
    }
  };

  const completeSmsSecondFactor = async () => {
    if (!mfaResolver || !phoneVerificationId) return;
    try {
      const cred = PhoneAuthProvider.credential(phoneVerificationId, smsCode);
      const assertion = PhoneMultiFactorGenerator.assertion(cred);
      await mfaResolver.resolveSignIn(assertion);
      setMfaOpen(false);
    } catch (e) {
      setError(e.message || 'Invalid SMS code');
    }
  };

  const completeTotpSecondFactor = async () => {
    if (!mfaResolver) return;
    try {
      const assertion = TotpMultiFactorGenerator.assertionForSignIn(totpCode);
      await mfaResolver.resolveSignIn(assertion);
      setMfaOpen(false);
    } catch (e) {
      setError(e.message || 'Invalid code');
    }
  };

  const sendEmail2fa = async () => {
    try {
      setEmail2faMsg('');
      const res = await fetch('/api/2fa/email/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || 'Failed');
      setEmail2faMsg('Code sent');
    } catch (e) { setEmail2faMsg(e.message || 'Failed to send'); }
  };

  const verifyEmail2fa = async () => {
    try {
      setEmail2faMsg('');
      const res = await fetch('/api/2fa/email/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, code: email2faCode }) });
      const json = await res.json();
      if (!json.ok) throw new Error('Invalid code');
      setEmail2faOpen(false);
    } catch (e) { setEmail2faMsg(e.message || 'Invalid code'); }
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
        {!hasFirebaseConfig && (
          <VuiTypography color="error" fontWeight="medium" mt={2} mb={1} textAlign="center">
            Authentication isn’t configured. Set your Firebase keys in the backend or .env, then refresh.
          </VuiTypography>
        )}
        {error && (
          <VuiTypography color="error" fontWeight="medium" mt={2} mb={1} textAlign="center">
            {error}
          </VuiTypography>
        )}
        <VuiBox mt={4} mb={1}>
          <VuiButton
            color="info"
            fullWidth
            sx={{ background: 'rgba(33,150,243,0.5)' }}
            type="submit"
            disabled={submitting || !formValid}
          >
            {submitting ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'SIGN IN'}
          </VuiButton>
        </VuiBox>
        <VuiTypography color="white" fontWeight="bold" textAlign="center" mb="18px" mt={2}>
          Or sign in with
        </VuiTypography>
        <Stack mb={2} justifyContent="center" alignItems="center" direction="row" spacing={2}>
          {enableFacebook && (
            <GradientBorder borderRadius="xl">
              <IconButton onClick={() => handleSocialSignin(signinWithFacebook)} disabled={submitting}>
                <Icon as={FaFacebook} w="30px" h="30px" sx={({ palette: { white } }) => ({ color: white.focus })} />
              </IconButton>
            </GradientBorder>
          )}
          {enableMicrosoft && (
            <GradientBorder borderRadius="xl">
              <IconButton onClick={() => handleSocialSignin(signinWithMicrosoft)} disabled={submitting}>
                <Icon as={FaMicrosoft} w="30px" h="30px" sx={({ palette: { white } }) => ({ color: white.focus })} />
              </IconButton>
            </GradientBorder>
          )}
          {enableGoogle && (
            <GradientBorder borderRadius="xl">
              <IconButton onClick={() => handleSocialSignin(signinWithGoogle)} disabled={submitting}>
                <Icon as={FaGoogle} w="30px" h="30px" sx={({ palette: { white } }) => ({ color: white.focus })} />
              </IconButton>
            </GradientBorder>
          )}
          {enableYahoo && (
            <GradientBorder borderRadius="xl">
              <IconButton onClick={() => handleSocialSignin(signinWithYahoo)} disabled={submitting}>
                <Icon as={FaYahoo} w="30px" h="30px" sx={({ palette: { white } }) => ({ color: white.focus })} />
              </IconButton>
            </GradientBorder>
          )}
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
      {/* MFA Dialog */}
      <Dialog open={mfaOpen} onClose={() => setMfaOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Two-step verification</DialogTitle>
        <DialogContent>
          {mfaSelectedHint?.factorId === 'phone' ? (
            <>
              <div id={recaptchaDivId} />
              <VuiTypography color="text" mb={1}>We sent a code to your phone ending in {mfaSelectedHint?.phoneNumber || ''}</VuiTypography>
              {!phoneVerificationId ? (
                <Button variant="contained" onClick={startSmsSecondFactor}>Send code</Button>
              ) : (
                <>
                  <TextField autoFocus margin="dense" label="Code" fullWidth value={smsCode} onChange={(e) => setSmsCode(e.target.value)} />
                  <Button sx={{ mt: 1 }} variant="contained" onClick={completeSmsSecondFactor}>Verify</Button>
                </>
              )}
            </>
          ) : (
            <>
              <VuiTypography color="text" mb={1}>Enter the 6-digit code from your authenticator app.</VuiTypography>
              <TextField autoFocus margin="dense" label="Code" fullWidth value={totpCode} onChange={(e) => setTotpCode(e.target.value)} />
              <Button sx={{ mt: 1 }} variant="contained" onClick={completeTotpSecondFactor}>Verify</Button>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMfaOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
      {/* Email 2FA Dialog */}
      <Dialog open={email2faOpen} onClose={() => setEmail2faOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Email verification</DialogTitle>
        <DialogContent>
          <VuiTypography color="text" mb={1}>We will send a 6-digit code to your email.</VuiTypography>
          <Button variant="contained" onClick={sendEmail2fa}>Send code</Button>
          <TextField autoFocus margin="dense" label="Code" fullWidth value={email2faCode} onChange={(e) => setEmail2faCode(e.target.value)} />
          {email2faMsg && <VuiTypography color="text" mt={1}>{email2faMsg}</VuiTypography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmail2faOpen(false)}>Cancel</Button>
          <Button onClick={verifyEmail2fa}>Verify</Button>
        </DialogActions>
      </Dialog>
      {/* Removed unwanted overlay/line VuiBox at the bottom of the sign-in page */}
    </CoverLayout>
  );
}

export default SignIn;
