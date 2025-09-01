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
  return ref.id;
}

export async function updateInsuranceCard(id, patch, uid) {
  if (!ensure()) return;
  if (!uid) uid = auth?.currentUser?.uid;
  if (!uid) return;
  await updateDoc(insuranceDoc(uid, id), { ...patch, updatedAt: serverTimestamp() });
}

export async function deleteInsuranceCard(id, uid) {
  if (!ensure()) return;
  if (!uid) uid = auth?.currentUser?.uid;
  if (!uid) return;
  await deleteDoc(insuranceDoc(uid, id));
}

export function onInsuranceCards(opts = {}, cb) {
  try {
    if (!ensure()) { try { cb([]); } catch (_) {} return () => {}; }
    let { uid } = opts;
    if (!uid) uid = auth?.currentUser?.uid;
    if (!uid) { try { cb([]); } catch (_) {} return () => {}; }
    const q = query(billingSubCol(uid, "insuranceCards"), orderBy("updatedAt", "desc"));
    return onSnapshot(q, (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
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
