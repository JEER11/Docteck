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

// Return boolean only when Firestore is available AND a user is signed in
const ensure = () => Boolean(auth && db && auth?.currentUser?.uid);
// Use per-kind subcollections under the user doc to keep collection paths valid (odd segments)
// users/{uid}/caringHub_{kind}
const hubCol = (uid, kind) => collection(db, "users", uid, `caringHub_${kind}`);
const hubDoc = (uid, kind, id) => doc(db, "users", uid, `caringHub_${kind}`, id);

// Generic subscribe helper
function onItems(kind, opts, cb) {
  const uidOpt = opts && typeof opts === 'object' ? opts.uid : undefined;
  if (!ensure()) { try { cb([]); } catch (_) {} return () => {}; }
  let uid = uidOpt;
  if (!uid) uid = auth?.currentUser?.uid;
  if (!uid) { try { cb([]); } catch (_) {} return () => {}; }
  const q = query(hubCol(uid, kind), orderBy("name", "asc"));
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
}

// Pharmacies
export const onPharmacies = (opts, cb) => onItems("pharmacies", opts, cb);
export async function addPharmacy(ph) {
  if (!ensure()) return; // no-op if Firebase not configured
  const uid = auth?.currentUser?.uid; if (!uid) return;
  await addDoc(hubCol(uid, "pharmacies"), ph);
}
export async function updatePharmacy(id, patch) {
  if (!ensure()) return;
  const uid = auth?.currentUser?.uid; if (!uid) return;
  await updateDoc(hubDoc(uid, "pharmacies", id), patch);
}
export async function deletePharmacy(id) {
  if (!ensure()) return;
  const uid = auth?.currentUser?.uid; if (!uid) return;
  await deleteDoc(hubDoc(uid, "pharmacies", id));
}

// Expandables (stubs): doctors, hospitals, prescriptions
export const onDoctors = (opts, cb) => onItems("doctors", opts || {}, cb);
export const onHospitals = (opts, cb) => onItems("hospitals", opts || {}, cb);
export const onPrescriptions = (opts, cb) => onItems("prescriptions", opts || {}, cb);
export async function addPrescription(rx) {
  if (!ensure()) return;
  const uid = auth?.currentUser?.uid; if (!uid) return;
  await addDoc(hubCol(uid, "prescriptions"), rx);
}
export async function updatePrescription(id, patch) {
  if (!ensure()) return;
  const uid = auth?.currentUser?.uid; if (!uid) return;
  await updateDoc(hubDoc(uid, "prescriptions", id), patch);
}
export async function deletePrescription(id) {
  if (!ensure()) return;
  const uid = auth?.currentUser?.uid; if (!uid) return;
  await deleteDoc(hubDoc(uid, "prescriptions", id));
}

export default { onPharmacies, addPharmacy, updatePharmacy, deletePharmacy, onDoctors, onHospitals, onPrescriptions, addPrescription, updatePrescription, deletePrescription };
