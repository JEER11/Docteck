import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { app, auth } from "lib/firebase";

const storage = app ? getStorage(app) : null;

export async function uploadUserFile(file, path = "files") {
  if (!storage || !auth?.currentUser) throw new Error("Storage not available or not signed in.");
  const uid = auth.currentUser.uid;
  const key = `${path}/${Date.now()}-${file.name}`;
  const r = ref(storage, `users/${uid}/${key}`);
  await uploadBytes(r, file);
  const url = await getDownloadURL(r);
  return { path: key, url };
}

export async function deleteUserFile(key) {
  if (!storage || !auth?.currentUser) throw new Error("Storage not available or not signed in.");
  const uid = auth.currentUser.uid;
  const r = ref(storage, `users/${uid}/${key}`);
  await deleteObject(r);
}

export default { uploadUserFile, deleteUserFile };
