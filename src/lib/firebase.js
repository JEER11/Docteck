// Firebase configuration and initialization for Docteck authentication
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, OAuthProvider } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// Prefer runtime config injected by Flask (window.__FIREBASE_CONFIG__),
// then fall back to env vars that CRA inlines at build time.
const runtimeCfg = (typeof window !== 'undefined' && window.__FIREBASE_CONFIG__) || {};
const firebaseConfig = {
  apiKey: runtimeCfg.apiKey || process.env.REACT_APP_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
  authDomain: runtimeCfg.authDomain || process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
  projectId: runtimeCfg.projectId || process.env.REACT_APP_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
  storageBucket: runtimeCfg.storageBucket || process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: runtimeCfg.messagingSenderId || process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: runtimeCfg.appId || process.env.REACT_APP_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
  measurementId: runtimeCfg.measurementId || process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || process.env.FIREBASE_MEASUREMENT_ID,
};

// Only initialize Firebase if we have the minimum required configuration.
const hasConfig = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);

let app = null;
let analytics = null;
let auth = null;
let db = null;
let storage = null;

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
    // Use long polling to be robust against ad-blockers/corporate proxies blocking WebChannel
    try {
      db = initializeFirestore(app, { experimentalForceLongPolling: true, useFetchStreams: false });
    } catch (e) {
      // Fallback if initializeFirestore not available in this environment
      db = getFirestore(app);
    }
    try {
      storage = getStorage(app);
    } catch (e) {
      storage = null;
    }
  } catch (e) {
    // If initialization fails, keep exports as null to avoid crashing the UI.
    // console.error("Firebase init failed:", e);
  }
} else {
  // Uncomment for local debugging: console.warn("Firebase config missing. Auth features disabled.");
}

export { app, analytics, auth, db, storage };
export const hasFirebaseConfig = hasConfig;
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const microsoftProvider = new OAuthProvider('microsoft.com');

// Provider tuning for better UX and tenant routing
try {
  googleProvider.setCustomParameters({ prompt: 'select_account' });
} catch {}
try {
  // Force account picker and use the multi-tenant endpoint
  microsoftProvider.setCustomParameters({ prompt: 'select_account', tenant: 'common' });
} catch {}
try {
  // Ensure popup display (Facebook)
  facebookProvider.setCustomParameters({ display: 'popup' });
  // Be explicit about email scope
  facebookProvider.addScope('email');
} catch {}

export default app;
