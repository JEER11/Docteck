// React hooks for authentication using Firebase
import { useState, useEffect } from "react";
import { auth, db, googleProvider, facebookProvider, microsoftProvider } from "../lib/firebase";
import { OAuthProvider, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
            const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
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

  // Email/password sign up
  const signup = async (email, password, profile = {}) => {
    if (!auth) throw new Error("Authentication is not available. Firebase is not configured.");
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (db) await setDoc(doc(db, "users", cred.user.uid), profile);
    return cred.user;
  };

  // Email/password sign in
  const signin = (email, password) => {
    if (!auth) throw new Error("Authentication is not available. Firebase is not configured.");
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google sign in
  const signinWithGoogle = () => {
    if (!auth) throw new Error("Authentication is not available. Firebase is not configured.");
    return signInWithPopup(auth, googleProvider);
  };

  // Facebook sign in
  const signinWithFacebook = () => {
    if (!auth) throw new Error("Authentication is not available. Firebase is not configured.");
    return signInWithPopup(auth, facebookProvider);
  };

  // Microsoft sign in
  const signinWithMicrosoft = () => {
    if (!auth) throw new Error("Authentication is not available. Firebase is not configured.");
    return signInWithPopup(auth, microsoftProvider);
  };

  // Yahoo sign in
  const yahooProvider = new OAuthProvider('yahoo.com');
  const signinWithYahoo = () => {
    if (!auth) throw new Error("Authentication is not available. Firebase is not configured.");
    return signInWithPopup(auth, yahooProvider);
  };

  // Phone number sign in (requires a visible or invisible reCAPTCHA container in the UI)
  // Usage example in UI:
  //  const { signInWithPhone } = useAuth();
  //  await signInWithPhone('+15551234567', 'recaptcha-container-id');
  //  // then confirm with code: confirmation.confirm('123456')
  const signInWithPhone = async (phoneNumber, reCaptchaContainerId = 'recaptcha-container') => {
    if (!auth) throw new Error("Authentication is not available. Firebase is not configured.");
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
    signup,
    signin,
    signinWithGoogle,
    signinWithFacebook,
    signinWithMicrosoft,
    signinWithYahoo,
  signInWithPhone,
    signout,
  };
}
