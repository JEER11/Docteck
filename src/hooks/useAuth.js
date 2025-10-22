// React hooks for authentication using Firebase
import { useState, useEffect } from "react";
import { auth, db, googleProvider, facebookProvider, microsoftProvider } from "../lib/firebase";
import { OAuthProvider, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  signInWithRedirect,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // global auth init
  const [isAuthReady, setIsAuthReady] = useState(false); // becomes true after first onAuthStateChanged fires

  // Auth provider feature flags (default: Google on, others off)
  const enableGoogle = String(process.env.REACT_APP_ENABLE_GOOGLE ?? 'true') !== 'false';
  const enableFacebook = String(process.env.REACT_APP_ENABLE_FACEBOOK ?? 'false') === 'true';
  const enableMicrosoft = String(process.env.REACT_APP_ENABLE_MICROSOFT ?? 'false') === 'true';
  const enableYahoo = String(process.env.REACT_APP_ENABLE_YAHOO ?? 'false') === 'true';

  useEffect(() => {
    // If Firebase is not configured, mark loading false and skip listeners
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (db) {
          try {
            const ref = doc(db, "users", firebaseUser.uid);
            const userDoc = await getDoc(ref);
            if (!userDoc.exists()) {
              // Seed a minimal profile document on first sign-in
              try {
                const dn = (firebaseUser.displayName || '').trim();
                const parts = dn.split(/\s+/).filter(Boolean);
                const firstName = parts[0] || '';
                const lastName = parts.length > 1 ? parts.slice(1).join(' ') : '';
                await setDoc(ref, {
                  email: firebaseUser.email || '',
                  displayName: firebaseUser.displayName || '',
                  firstName,
                  lastName,
                  fullName: dn || `${firstName} ${lastName}`.trim(),
                  photoURL: firebaseUser.photoURL || '',
                  phoneNumber: firebaseUser.phoneNumber || '',
                  providers: (firebaseUser.providerData || []).map(p => ({ providerId: p.providerId, uid: p.uid })),
                  createdAt: (new Date()).toISOString(),
                  security: { email2faEnabled: false },
                }, { merge: true });
              } catch (_) { /* ignore */ }
            }
            setUser({ ...firebaseUser, profile: userDoc.exists() ? userDoc.data() : null });
          } catch (_) {
            setUser(firebaseUser);
          }
        } else {
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    if (!isAuthReady && loading === false) {
      setIsAuthReady(true);
    }
  }, [loading, isAuthReady]);

  // Email/password sign up
  const signup = async (email, password, profile = {}) => {
    if (!auth) return Promise.reject(new Error("Authentication is not available. Firebase is not configured."));
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    // Best-effort profile seed; don't block sign-up/navigation if this fails (e.g., strict rules)
    if (db) {
      try {
        // Fire-and-forget so slow networks don't delay the resolution of signup
        setDoc(
          doc(db, "users", cred.user.uid),
          { email: cred.user.email || "", ...profile },
          { merge: true }
        ).catch((e) => {
          // Non-fatal: user account is created; onAuthStateChanged will still run
          // eslint-disable-next-line no-console
          console.warn("Profile seed failed; continuing sign-up:", e?.message || e);
        });
      } catch (e) {
        // ignore
      }
    }
    return cred.user;
  };

  // Email/password sign in
  const signin = (email, password) => {
    if (!auth) return Promise.reject(new Error("Authentication is not available. Firebase is not configured."));
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google sign in
  const signinWithGoogle = async () => {
    if (!auth) return Promise.reject(new Error("Authentication is not available. Firebase is not configured."));
    if (!enableGoogle) return Promise.reject(new Error("Google sign-in is disabled."));
    try {
      return await signInWithPopup(auth, googleProvider);
    } catch (err) {
      if (err?.code === 'auth/popup-blocked') {
        return signInWithRedirect(auth, googleProvider);
      }
      throw err;
    }
  };

  // Facebook sign in
  const signinWithFacebook = async () => {
    if (!auth) return Promise.reject(new Error("Authentication is not available. Firebase is not configured."));
    if (!enableFacebook) return Promise.reject(new Error("Facebook sign-in is disabled."));
    try {
      return await signInWithPopup(auth, facebookProvider);
    } catch (err) {
      if (err?.code === 'auth/popup-blocked') {
        return signInWithRedirect(auth, facebookProvider);
      }
      throw err;
    }
  };

  // Microsoft sign in
  const signinWithMicrosoft = async () => {
    if (!auth) return Promise.reject(new Error("Authentication is not available. Firebase is not configured."));
    if (!enableMicrosoft) return Promise.reject(new Error("Microsoft sign-in is disabled."));
    try {
      return await signInWithPopup(auth, microsoftProvider);
    } catch (err) {
      if (err?.code === 'auth/popup-blocked') {
        return signInWithRedirect(auth, microsoftProvider);
      }
      throw err;
    }
  };

  // Yahoo sign in
  const yahooProvider = new OAuthProvider('yahoo.com');
  const signinWithYahoo = async () => {
    if (!auth) return Promise.reject(new Error("Authentication is not available. Firebase is not configured."));
    if (!enableYahoo) return Promise.reject(new Error("Yahoo sign-in is disabled."));
    try {
      return await signInWithPopup(auth, yahooProvider);
    } catch (err) {
      if (err?.code === 'auth/popup-blocked') {
        return signInWithRedirect(auth, yahooProvider);
      }
      throw err;
    }
  };

  // Phone number sign in (requires a visible or invisible reCAPTCHA container in the UI)
  // Usage example in UI:
  //  const { signInWithPhone } = useAuth();
  //  await signInWithPhone('+15551234567', 'recaptcha-container-id');
  //  // then confirm with code: confirmation.confirm('123456')
  const signInWithPhone = async (phoneNumber, reCaptchaContainerId = 'recaptcha-container') => {
    if (!auth) return Promise.reject(new Error("Authentication is not available. Firebase is not configured."));
    // Create verifier once per session; caller should provide a container div id in the page
    const verifier = new RecaptchaVerifier(auth, reCaptchaContainerId, { size: 'invisible' });
    const confirmation = await signInWithPhoneNumber(auth, phoneNumber, verifier);
    // Return the confirmation result; UI should call confirmation.confirm(code)
    return confirmation;
  };

  // Sign out
  const signout = () => {
    if (!auth) return Promise.resolve();
    return signOut(auth);
  };

  return {
    user,
  loading,
  isAuthReady,
    signup,
    signin,
    signinWithGoogle,
    signinWithFacebook,
    signinWithMicrosoft,
    signinWithYahoo,
  signInWithPhone,
    // flags so UI can conditionally render provider buttons
    enableGoogle,
    enableFacebook,
    enableMicrosoft,
    enableYahoo,
    signout,
  };
}
