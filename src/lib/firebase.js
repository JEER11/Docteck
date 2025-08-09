// Firebase configuration and initialization for Docteck authentication
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, OAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Read env vars (CRA requires REACT_APP_ prefix). Fall back to non-prefixed if present.
const env = (key, fallbackKey) =>
  process.env[`REACT_APP_${key}`] || process.env[key] || process.env[fallbackKey] || undefined;

const firebaseConfig = {
  apiKey: env("FIREBASE_API_KEY"),
  authDomain: env("FIREBASE_AUTH_DOMAIN"),
  projectId: env("FIREBASE_PROJECT_ID"),
  storageBucket: env("FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: env("FIREBASE_MESSAGING_SENDER_ID"),
  appId: env("FIREBASE_APP_ID"),
  measurementId: env("FIREBASE_MEASUREMENT_ID"),
};

// Only initialize Firebase if we have the minimum required configuration.
const hasConfig = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);

let app = null;
let analytics = null;
let auth = null;
let db = null;

if (hasConfig) {
  try {
    app = initializeApp(firebaseConfig);
    // Initialize analytics only in browser and only if measurementId exists.
    if (typeof window !== "undefined" && firebaseConfig.measurementId) {
      try {
        analytics = getAnalytics(app);
      } catch (e) {
        // Analytics is optional; ignore initialization issues (e.g., http or unsupported env)
        // console.debug("Analytics not initialized:", e);
      }
    }
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (e) {
    // If initialization fails, keep exports as null to avoid crashing the UI.
    // console.error("Firebase init failed:", e);
  }
} else {
  // Uncomment for local debugging: console.warn("Firebase config missing. Auth features disabled.");
}

export { app, analytics, auth, db };
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const microsoftProvider = new OAuthProvider('microsoft.com');

export default app;
