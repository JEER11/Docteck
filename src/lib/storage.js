import { storage, auth } from "lib/firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

const ensure = () => Boolean(storage);

function userPrefix(uid) {
  return `users/${uid || auth?.currentUser?.uid || 'guest'}`;
}

export async function uploadUserFile(fileOrBlob, path = "files") {
  if (!ensure()) throw new Error('Storage not configured');
  const uid = auth?.currentUser?.uid || 'guest';
  const key = `${path}/${Date.now()}`;
  const full = `${userPrefix(uid)}/${key}`;
  const r = ref(storage, full);
  const meta = { customMetadata: { uid } };
  const snap = await uploadBytes(r, fileOrBlob, meta);
  const url = await getDownloadURL(snap.ref);
  return { path: key, url };
}

export async function deleteUserFile(key, path = "files") {
  if (!ensure()) throw new Error('Storage not configured');
  const uid = auth?.currentUser?.uid || 'guest';
  const full = `${userPrefix(uid)}/${key.startsWith(path) ? key : `${path}/${key}`}`;
  const r = ref(storage, full);
  await deleteObject(r);
}

export default { uploadUserFile, deleteUserFile };
