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

const ensure = () => {
  if (!auth || !db) throw new Error("Firebase is not configured.");
};

const msgsCol = (uid, sessionId = "default") =>
  collection(db, "users", uid, "chatSessions", sessionId, "messages");

export function onChatMessages({ uid, sessionId = "default" }, cb) {
  ensure();
  if (!uid) uid = auth?.currentUser?.uid;
  if (!uid) throw new Error("No user");
  const q = query(msgsCol(uid, sessionId), orderBy("ts", "asc"));
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    cb(items);
  });
}

export async function addChatMessage({ uid, sessionId = "default", sender, text, tsClient }) {
  ensure();
  if (!uid) uid = auth?.currentUser?.uid;
  if (!uid) throw new Error("No user");
  await addDoc(msgsCol(uid, sessionId), {
    sender,
    text,
    ts: serverTimestamp(),
    tsClient: tsClient || Date.now(),
  });
}

export async function clearChat({ uid, sessionId = "default" }) {
  ensure();
  if (!uid) uid = auth?.currentUser?.uid;
  if (!uid) throw new Error("No user");
  const snap = await getDocs(msgsCol(uid, sessionId));
  const batch = writeBatch(db);
  snap.forEach((d) => batch.delete(d.ref));
  await batch.commit();
}

export default { onChatMessages, addChatMessage, clearChat };
