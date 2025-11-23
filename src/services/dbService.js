import { db, storage, serverTimestamp } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc,
  limit
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const usersCol = collection(db, 'users');
const postsCol = collection(db, 'posts');
const challengesCol = collection(db, 'challenges');

export const createUserRecord = async (user) => {
  const refDoc = doc(usersCol, user.uid);
  await setDoc(refDoc, { uid: user.uid, email: user.email, displayName: user.displayName || '', role: user.role || 'user', createdAt: serverTimestamp() }, { merge: true });
};

export const getUserById = async (uid) => {
  const snap = await getDoc(doc(usersCol, uid));
  return snap.exists() ? snap.data() : null;
};

export const createPost = async ({ uid, text, mediaFiles = [], location = null, isChallengeEvidence = false }) => {
  const mediaUrls = [];
  for (const file of mediaFiles) {
    const fileRef = ref(storage, `posts/${uid}/${Date.now()}_${file.name}`);
    const task = uploadBytesResumable(fileRef, file);
    await task;
    const url = await getDownloadURL(fileRef);
    mediaUrls.push({ url, name: file.name });
  }
  const docRef = await addDoc(postsCol, {
    uid,
    text,
    media: mediaUrls,
    location,
    isChallengeEvidence,
    createdAt: serverTimestamp()
  });
  return docRef.id;
};

export const getFeed = async ({ limitNum = 20 }) => {
  const q = query(postsCol, orderBy('createdAt', 'desc'), limit(limitNum));
  const snaps = await getDocs(q);
  return snaps.docs.map(d => ({ id: d.id, ...d.data() }));
};