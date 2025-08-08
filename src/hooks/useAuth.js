// React hooks for authentication using Firebase
import { useState, useEffect } from "react";
import { auth, db, googleProvider, facebookProvider, microsoftProvider } from "../lib/firebase";
import { OAuthProvider } from "firebase/auth";
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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Optionally fetch user profile from Firestore
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        setUser({ ...firebaseUser, profile: userDoc.exists() ? userDoc.data() : null });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Email/password sign up
  const signup = async (email, password, profile = {}) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", cred.user.uid), profile);
    return cred.user;
  };

  // Email/password sign in
  const signin = (email, password) => signInWithEmailAndPassword(auth, email, password);

  // Google sign in
  const signinWithGoogle = () => signInWithPopup(auth, googleProvider);

  // Facebook sign in
  const signinWithFacebook = () => signInWithPopup(auth, facebookProvider);

  // Microsoft sign in
  const signinWithMicrosoft = () => signInWithPopup(auth, microsoftProvider);

  // Yahoo sign in
  const yahooProvider = new OAuthProvider('yahoo.com');
  const signinWithYahoo = () => signInWithPopup(auth, yahooProvider);

  // Sign out
  const signout = () => signOut(auth);

  return {
    user,
    loading,
    signup,
    signin,
    signinWithGoogle,
    signinWithFacebook,
    signinWithMicrosoft,
    signinWithYahoo,
    signout,
  };
}
