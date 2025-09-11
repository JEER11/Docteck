// Firestore chat persistence: users/{uid}/chatSessions/{sessionId}/messages
import { auth, db } from "lib/firebase";
import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";

// Don't throw here; return availability so callers can opt-out gracefully.
const ensure = () => Boolean(auth && db);

const msgsCol = (uid, sessionId = "default") =>
  collection(db, "users", uid, "chatSessions", sessionId, "messages");

export function onChatMessages({ uid, sessionId = "default" }, cb) {
  if (!ensure()) return () => {};
  if (!uid) uid = auth?.currentUser?.uid;
  if (!uid) return () => {};
  const q = query(msgsCol(uid, sessionId), orderBy("ts", "asc"));
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    try { cb(items); } catch (_) {}
  });
}

export async function addChatMessage({ uid, sessionId = "default", sender, text, tsClient }) {
  if (!ensure()) return null;
  if (!uid) uid = auth?.currentUser?.uid;
  if (!uid) return null;
  await addDoc(msgsCol(uid, sessionId), {
    sender,
    text,
    ts: serverTimestamp(),
    tsClient: tsClient || Date.now(),
  });
}

export async function clearChat({ uid, sessionId = "default" }) {
  if (!ensure()) return;
  if (!uid) uid = auth?.currentUser?.uid;
  if (!uid) return;
  const snap = await getDocs(msgsCol(uid, sessionId));
  const batch = writeBatch(db);
  snap.forEach((d) => batch.delete(d.ref));
  await batch.commit();
}

export default { onChatMessages, addChatMessage, clearChat };
