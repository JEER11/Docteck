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

const ensure = () => {
  if (!auth || !db) throw new Error("Firebase is not configured.");
};

const billingCol = (uid, sub) => collection(db, "users", uid, "billing", sub);
const insuranceDoc = (uid, id) => doc(db, "users", uid, "billing", "insuranceCards", id);
const paymentMethodDoc = (uid, id) => doc(db, "users", uid, "billing", "paymentMethods", id);

// Insurance cards
export async function addInsuranceCard(payload, uid) {
  ensure();
  if (!uid) uid = auth?.currentUser?.uid;
  if (!uid) throw new Error("No user");
  const now = serverTimestamp();
  const ref = await addDoc(billingCol(uid, "insuranceCards"), {
    ...payload,
    createdAt: now,
    updatedAt: now,
  });
  return ref.id;
}

export async function updateInsuranceCard(id, patch, uid) {
  ensure();
  if (!uid) uid = auth?.currentUser?.uid;
  if (!uid) throw new Error("No user");
  await updateDoc(insuranceDoc(uid, id), { ...patch, updatedAt: serverTimestamp() });
}

export async function deleteInsuranceCard(id, uid) {
  ensure();
  if (!uid) uid = auth?.currentUser?.uid;
  if (!uid) throw new Error("No user");
  await deleteDoc(insuranceDoc(uid, id));
}

export function onInsuranceCards(opts = {}, cb) {
  ensure();
  let { uid } = opts;
  if (!uid) uid = auth?.currentUser?.uid;
  if (!uid) throw new Error("No user");
  const q = query(billingCol(uid, "insuranceCards"), orderBy("updatedAt", "desc"));
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
}

// Payment methods (store minimal metadata and Stripe PaymentMethod ID)
export async function addPaymentMethodDoc(data, uid) {
  ensure();
  if (!uid) uid = auth?.currentUser?.uid;
  if (!uid) throw new Error("No user");
  const now = serverTimestamp();
  const ref = await addDoc(billingCol(uid, "paymentMethods"), {
    ...data, // { paymentMethodId, brand, last4, billingName }
    createdAt: now,
    updatedAt: now,
  });
  return ref.id;
}

export function onPaymentMethods(opts = {}, cb) {
  ensure();
  let { uid } = opts;
  if (!uid) uid = auth?.currentUser?.uid;
  if (!uid) throw new Error("No user");
  const q = query(billingCol(uid, "paymentMethods"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
}

export default {
  addInsuranceCard,
  updateInsuranceCard,
  deleteInsuranceCard,
  onInsuranceCards,
  addPaymentMethodDoc,
  onPaymentMethods,
};
