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
const todosCol = (uid) => collection(db, "users", uid, "todos");
const todoDoc = (uid, id) => doc(db, "users", uid, "todos", id);

export function onTodos(opts, cb) {
  if (!ensure()) { try { cb([]); } catch(_) {} return () => {}; }
  let uid = opts?.uid || auth?.currentUser?.uid;
  if (!uid) { try { cb([]); } catch(_) {} return () => {}; }
  const q = query(todosCol(uid), orderBy("date", "asc"));
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    try { cb(items); } catch(_) {}
  });
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
  if (!ensure()) return;
  const uid = auth?.currentUser?.uid; if (!uid) return;
  await deleteDoc(todoDoc(uid, id));
}

export default { onTodos, addTodoDoc, deleteTodoDoc };
