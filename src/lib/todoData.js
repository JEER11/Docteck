import { auth, db } from "lib/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

const ensure = () => Boolean(auth && db && auth?.currentUser?.uid);
export function isTodosAvailable() { return ensure(); }
const todosCol = (uid) => collection(db, "users", uid, "todos");
const todoDoc = (uid, id) => doc(db, "users", uid, "todos", id);

// onTodos(opts, cbSuccess, cbError?)
export function onTodos(opts, cb, cbError) {
  // If Firestore or user context isn't available, don't invoke the callback —
  // let the caller decide how to hydrate (localStorage) so we don't clear UI unexpectedly.
  if (!ensure()) { return () => {}; }
  let uid = opts?.uid || auth?.currentUser?.uid;
  if (!uid) { try { cb([]); } catch(_) {} return () => {}; }
  const q = query(todosCol(uid), orderBy("date", "asc"));
  try {
    return onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      try { cb(items); } catch(_) {}
    }, (err) => {
      // Enhanced diagnostics for 400 issues
      try {
        const diag = {
          code: err?.code,
            name: err?.name,
            message: err?.message,
            stack: (err?.stack || '').split('\n').slice(0,4),
            hasUser: Boolean(auth?.currentUser?.uid),
            uid: auth?.currentUser?.uid || null,
            hasDb: Boolean(db),
            time: new Date().toISOString(),
        };
        // Avoid spamming – only log first occurrence
        if (!window.__TODOS_FS_ERR__) {
          window.__TODOS_FS_ERR__ = true;
          // eslint-disable-next-line no-console
          console.error('[TodosFirestore] onSnapshot error', diag);
        }
      } catch(_) {}
      try { cbError && cbError(err); } catch(_) {}
    });
  } catch (err) {
    try { cbError && cbError(err); } catch(_) {}
    return () => {};
  }
}

export async function addTodoDoc(todo) {
  if (!ensure()) return null;
  const uid = auth?.currentUser?.uid; if (!uid) return null;
  const payload = {
    label: todo.label || todo.text || "Task",
    type: todo.type || "note",
    date: todo.date ? (todo.date instanceof Date ? todo.date.toISOString() : todo.date) : null,
    createdAt: Date.now(),
  };
  const ref = await addDoc(todosCol(uid), payload);
  return { id: ref.id, ...payload };
}

export async function deleteTodoDoc(id) {
  if (!ensure()) return false;
  const uid = auth?.currentUser?.uid; if (!uid) return false;
  await deleteDoc(todoDoc(uid, id));
  return true;
}

// One-off self test to help diagnose Firestore writes (called manually from console if needed)
export async function __diagnoseTodosWrite() {
  if (!ensure()) { console.warn('[TodosFirestore] diagnose: user/db not ready'); return; }
  const uid = auth?.currentUser?.uid;
  try {
    const payload = { label: 'diag-temp', createdAt: Date.now() };
    const ref = await addDoc(todosCol(uid), payload);
    console.log('[TodosFirestore] diagnose write success id=', ref.id);
    try { await deleteDoc(todoDoc(uid, ref.id)); console.log('[TodosFirestore] cleaned temp'); } catch(e_del) { console.warn('[TodosFirestore] temp cleanup failed', e_del); }
  } catch (e) {
    console.error('[TodosFirestore] diagnose write failed', { code: e?.code, message: e?.message, name: e?.name, stack: (e?.stack||'').split('\n')[0] });
  }
}

export default { onTodos, addTodoDoc, deleteTodoDoc, __diagnoseTodosWrite };
