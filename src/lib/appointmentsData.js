// Per-user appointments in Firestore: users/{uid}/appointments
import { auth, db } from "lib/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

const ensure = () => { if (!auth || !db) throw new Error("Firebase is not configured."); };
const apptsCol = (uid) => collection(db, "users", uid, "appointments");
const apptDoc = (uid, id) => doc(db, "users", uid, "appointments", id);

export function onAppointments({ uid }, cb) {
  ensure();
  if (!uid) uid = auth?.currentUser?.uid;
  if (!uid) throw new Error("No user");
  const q = query(apptsCol(uid), orderBy("start", "asc"));
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    cb(items.map(a => ({ ...a, start: new Date(a.start), end: new Date(a.end) })));
  });
}

export async function addAppointment({ uid, title, start, end, providerId = null, location = '', reason = '', details = '' }) {
  ensure();
  if (!uid) uid = auth?.currentUser?.uid;
  if (!uid) throw new Error("No user");
  const payload = { title, start: new Date(start).toISOString(), end: new Date(end).toISOString(), providerId, location, reason, details, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
  const ref = await addDoc(apptsCol(uid), payload);
  return ref.id;
}

export async function updateAppointment({ uid, id, patch }) {
  ensure();
  if (!uid) uid = auth?.currentUser?.uid;
  if (!uid) throw new Error("No user");
  await updateDoc(apptDoc(uid, id), { ...patch, updatedAt: serverTimestamp() });
}

export async function deleteAppointment({ uid, id }) {
  ensure();
  if (!uid) uid = auth?.currentUser?.uid;
  if (!uid) throw new Error("No user");
  await deleteDoc(apptDoc(uid, id));
}

export default { onAppointments, addAppointment, updateAppointment, deleteAppointment };
