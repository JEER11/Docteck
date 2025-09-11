// Firestore helper for per-user data ("website safes").
// Stores items in subcollection: users/{uid}/safes
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

// Return true when Firebase services are available. Do not throw here — callers
// should gracefully handle missing Firebase so the UI remains functional.
const ensure = () => Boolean(auth && db);

const userSafesCol = (uid) => collection(db, "users", uid, "safes");
const userSafeDoc = (uid, id) => doc(db, "users", uid, "safes", id);

// Create a new safe entry for a user
export async function addSafeEntry({ uid, content = "", meta = {} }) {
  if (!ensure()) return null;
  if (!uid) uid = auth?.currentUser?.uid;
  if (!uid) return null;
  const now = serverTimestamp();
  const ref = await addDoc(userSafesCol(uid), {
    content,
    meta,
    createdAt: now,
    updatedAt: now,
  });
  return ref.id;
}

// Update an existing safe entry
export async function updateSafeEntry({ uid, id, patch }) {
  if (!ensure()) return;
  if (!uid) uid = auth?.currentUser?.uid;
  if (!uid) return;
  const ref = userSafeDoc(uid, id);
  await updateDoc(ref, { ...patch, updatedAt: serverTimestamp() });
}

// Delete a safe entry
export async function deleteSafeEntry({ uid, id }) {
  if (!ensure()) return;
  if (!uid) uid = auth?.currentUser?.uid;
  if (!uid) return;
  await deleteDoc(userSafeDoc(uid, id));
}

// Get one entry
export async function getSafeEntry({ uid, id }) {
  if (!ensure()) return null;
  if (!uid) uid = auth?.currentUser?.uid;
  if (!uid) return null;
  const snap = await getDoc(userSafeDoc(uid, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// List entries, newest first
export async function listSafeEntries({ uid }) {
  if (!ensure()) return [];
  if (!uid) uid = auth?.currentUser?.uid;
  if (!uid) return [];
  const q = query(userSafesCol(uid), orderBy("updatedAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Subscribe to live changes
export function onSafeEntries({ uid }, callback) {
  if (!ensure()) return () => {};
  if (!uid) uid = auth?.currentUser?.uid;
  if (!uid) return () => {};
  const q = query(userSafesCol(uid), orderBy("updatedAt", "desc"));
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    try { callback(items); } catch (_) {}
  });
}

// Optional: initialize a default entry for new accounts
export async function seedDefaultSafeIfEmpty(uid) {
  if (!ensure()) return;
  if (!uid) uid = auth?.currentUser?.uid;
  if (!uid) return;
  const items = await listSafeEntries({ uid });
  if (!items.length) {
    await addSafeEntry({ uid, content: "Welcome to your private safe." });
  }
}

export default {
  addSafeEntry,
  updateSafeEntry,
  deleteSafeEntry,
  getSafeEntry,
  listSafeEntries,
  onSafeEntries,
  seedDefaultSafeIfEmpty,
};
