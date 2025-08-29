// Caring Hub per-user data in Firestore under users/{uid}/caringHub/*
import { auth, db } from "lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

const ensure = () => { if (!auth || !db) throw new Error("Firebase is not configured."); };
const hubCol = (uid, kind) => collection(db, "users", uid, "caringHub", kind);
const hubDoc = (uid, kind, id) => doc(db, "users", uid, "caringHub", kind, id);

// Generic subscribe helper
function onItems(kind, { uid }, cb) {
  ensure();
  if (!uid) uid = auth?.currentUser?.uid;
  if (!uid) throw new Error("No user");
  const q = query(hubCol(uid, kind), orderBy("name", "asc"));
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
}

// Pharmacies
export const onPharmacies = (opts, cb) => onItems("pharmacies", opts, cb);
export async function addPharmacy(ph) {
  ensure();
  const uid = auth?.currentUser?.uid; if (!uid) throw new Error("No user");
  await addDoc(hubCol(uid, "pharmacies"), ph);
}
export async function updatePharmacy(id, patch) {
  ensure();
  const uid = auth?.currentUser?.uid; if (!uid) throw new Error("No user");
  await updateDoc(hubDoc(uid, "pharmacies", id), patch);
}
export async function deletePharmacy(id) {
  ensure();
  const uid = auth?.currentUser?.uid; if (!uid) throw new Error("No user");
  await deleteDoc(hubDoc(uid, "pharmacies", id));
}

// Expandables (stubs): doctors, hospitals, prescriptions
export const onDoctors = (opts, cb) => onItems("doctors", opts, cb);
export const onHospitals = (opts, cb) => onItems("hospitals", opts, cb);
export const onPrescriptions = (opts, cb) => onItems("prescriptions", opts, cb);

export default { onPharmacies, addPharmacy, updatePharmacy, deletePharmacy, onDoctors, onHospitals, onPrescriptions };
