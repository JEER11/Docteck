// Firestore helpers for Billing data (insurance cards, payment methods)
import { auth, db } from "lib/firebase";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

// Return boolean instead of throwing so callers can gracefully no-op
const ensure = () => Boolean(auth && db);

// Local cache (per-user) to survive ad-blocked Firestore or offline states
const LS_KEY = (uid) => `insuranceCards:${uid}`;
export function getCachedInsuranceCards(uid) {
  try {
    const raw = localStorage.getItem(LS_KEY(uid || auth?.currentUser?.uid || ""));
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
export function setCachedInsuranceCards(uid, rows) {
  try {
    localStorage.setItem(LS_KEY(uid || auth?.currentUser?.uid || ""), JSON.stringify(rows || []));
  } catch {}
}
function upsertCache(uid, item) {
  const list = getCachedInsuranceCards(uid);
  const idx = list.findIndex((x) => x.id === item.id);
  if (idx >= 0) list[idx] = { ...list[idx], ...item };
  else list.unshift(item);
  setCachedInsuranceCards(uid, list);
}
function removeFromCache(uid, id) {
  const list = getCachedInsuranceCards(uid).filter((x) => x.id !== id);
  setCachedInsuranceCards(uid, list);
}

// Anchor billing data under a concrete document to satisfy Firestore path segment rules:
// users/{uid}/billing/{root}/(insuranceCards|paymentMethods)
const BILLING_ROOT_ID = "root";
const billingRootDoc = (uid) => doc(db, "users", uid, "billing", BILLING_ROOT_ID);
const billingSubCol = (uid, sub) => collection(billingRootDoc(uid), sub);
const insuranceDoc = (uid, id) => doc(db, "users", uid, "billing", BILLING_ROOT_ID, "insuranceCards", id);
const paymentMethodDoc = (uid, id) => doc(db, "users", uid, "billing", BILLING_ROOT_ID, "paymentMethods", id);

// Insurance cards
export async function addInsuranceCard(payload, uid) {
  if (!ensure()) return undefined;
  if (!uid) uid = auth?.currentUser?.uid;
  if (!uid) return undefined;
  const now = serverTimestamp();
  const ref = await addDoc(billingSubCol(uid, "insuranceCards"), {
    ...payload,
    createdAt: now,
    updatedAt: now,
  });
  // Mirror to cache (without serverTimestamp objects)
  try { upsertCache(uid, { id: ref.id, ...payload, createdAt: Date.now(), updatedAt: Date.now() }); } catch {}
  return ref.id;
}

export async function updateInsuranceCard(id, patch, uid) {
  if (!ensure()) return;
  if (!uid) uid = auth?.currentUser?.uid;
  if (!uid) return;
  await updateDoc(insuranceDoc(uid, id), { ...patch, updatedAt: serverTimestamp() });
  try { upsertCache(uid, { id, ...patch, updatedAt: Date.now() }); } catch {}
}

export async function deleteInsuranceCard(id, uid) {
  if (!ensure()) return;
  if (!uid) uid = auth?.currentUser?.uid;
  if (!uid) return;
  await deleteDoc(insuranceDoc(uid, id));
  try { removeFromCache(uid, id); } catch {}
}

export function onInsuranceCards(opts = {}, cb) {
  try {
    if (!ensure()) { try { cb([]); } catch (_) {} return () => {}; }
    let { uid, onError } = opts;
    if (!uid) uid = auth?.currentUser?.uid;
    if (!uid) { try { cb([]); } catch (_) {} return () => {}; }
    const q = query(billingSubCol(uid, "insuranceCards"), orderBy("updatedAt", "desc"));
    return onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        try { if (rows?.length) setCachedInsuranceCards(uid, rows); } catch {}
        cb(rows);
      },
      // If Firestore streaming fails (e.g., 400 from webchannel), surface an empty list so callers can show placeholders
      onError || (() => { try { cb([]); } catch (_) {} })
    );
  } catch (e) {
    try { cb([]); } catch (_) {}
    return () => {};
  }
}

// Payment methods (store minimal metadata and Stripe PaymentMethod ID)
export async function addPaymentMethodDoc(data, uid) {
  if (!ensure()) return undefined;
  if (!uid) uid = auth?.currentUser?.uid;
  if (!uid) return undefined;
  const now = serverTimestamp();
  const ref = await addDoc(billingSubCol(uid, "paymentMethods"), {
    ...data, // { paymentMethodId, brand, last4, billingName }
    createdAt: now,
    updatedAt: now,
  });
  return ref.id;
}

export function onPaymentMethods(opts = {}, cb) {
  try {
    if (!ensure()) { try { cb([]); } catch (_) {} return () => {}; }
    let { uid } = opts;
    if (!uid) uid = auth?.currentUser?.uid;
    if (!uid) { try { cb([]); } catch (_) {} return () => {}; }
    const q = query(billingSubCol(uid, "paymentMethods"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
  } catch (e) {
    try { cb([]); } catch (_) {}
    return () => {};
  }
}

export default {
  addInsuranceCard,
  updateInsuranceCard,
  deleteInsuranceCard,
  onInsuranceCards,
  addPaymentMethodDoc,
  onPaymentMethods,
};

// Lightweight one-time fetch to quickly populate UI when streaming is slow or blocked
export async function fetchInsuranceCardsOnce(uid) {
  if (!ensure()) return [];
  if (!uid) uid = auth?.currentUser?.uid;
  if (!uid) return [];
  try {
    const q = query(billingSubCol(uid, "insuranceCards"), orderBy("updatedAt", "desc"));
    const snap = await getDocs(q);
  const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  try { if (rows?.length) setCachedInsuranceCards(uid, rows); } catch {}
  return rows;
  } catch (_) {
  // Fallback to cache if network blocked
  return getCachedInsuranceCards(uid);
  }
}
