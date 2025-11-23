
import { auth } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as fbSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile as fbUpdateProfile
} from 'firebase/auth';
import { db, storage, serverTimestamp } from '../firebase';
import { collection, addDoc, doc, setDoc, getDoc, getDocs, query, orderBy, limit, where, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const supabase = {
  auth: {
    signUp: async ({ email, password, options }) => {
      try {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        if (options && options.data && options.data.full_name) {
          await fbUpdateProfile(userCred.user, { displayName: options.data.full_name });
        }
        await fetch('/api/users/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: userCred.user.uid, email, displayName: userCred.user.displayName || '', role: options?.data?.role || 'user' })
        });
        return { data: { user: userCred.user }, error: null };
      } catch (e) {
        return { data: null, error: e };
      }
    },
    signInWithPassword: async ({ email, password }) => {
      try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        return { data: { user: userCred.user }, error: null };
      } catch (e) {
        return { data: null, error: e };
      }
    },
    signOut: async () => {
      try {
        await fbSignOut(auth);
        return { error: null };
      } catch (e) {
        return { error: e };
      }
    },
    resetPasswordForEmail: async (email) => {
      try {
        await sendPasswordResetEmail(auth, email);
        return { data: null, error: null };
      } catch (e) {
        return { data: null, error: e };
      }
    },
    getUser: async () => {
      const user = auth.currentUser;
      return { data: { user }, error: null };
    },
    getSession: async () => {
      const user = auth.currentUser;
      return { data: { session: user ? { user } : null }, error: null };
    },
    onAuthStateChange: (cb) => {
      return onAuthStateChanged(auth, (user) => {
        cb('SIGNED_IN', { session: user ? { user } : null });
      });
    },
    updateUser: async ({ data }) => {
      try {
        if (!auth.currentUser) throw new Error('No user');
        await fbUpdateProfile(auth.currentUser, data);
        return { data: { user: auth.currentUser }, error: null };
      } catch (e) {
        return { data: null, error: e };
      }
    }
  },
  storage: {
    from: (bucket) => ({
      upload: async (path, file, options) => {
        try {
          const storageRef = ref(storage, `${bucket}/${path}`);
          const snap = await uploadBytesResumable(storageRef, file);
          const url = await getDownloadURL(storageRef);
          return { data: { Key: path, publicURL: url }, error: null };
        } catch (e) {
          return { data: null, error: e };
        }
      },
      getPublicUrl: async (path) => {
        try {
          const storageRef = ref(storage, `${bucket}/${path}`);
          const url = await getDownloadURL(storageRef);
          return { data: { publicURL: url }, error: null };
        } catch (e) {
          return { data: null, error: e };
        }
      }
    })
  },
  from: (table) => {
    const coll = collection(db, table);
    return {
      insert: async (payload) => {
        try {
          let dataToInsert = Array.isArray(payload) ? payload[0] : payload;
          if (table === 'posts') {
            if (dataToInsert.isChallengeEvidence) {
              const medalsCol = collection(db, 'medals');
              await addDoc(medalsCol, { uid: dataToInsert.uid, challengeId: dataToInsert.challenge_id || null, createdAt: serverTimestamp(), type: 'challenge' });
              const userDoc = doc(db, 'users', dataToInsert.uid);
              try {
                const u = await getDoc(userDoc);
                const current = u.exists() ? u.data().medals || [] : [];
                await setDoc(userDoc, { medals: [...current, { challengeId: dataToInsert.challenge_id || null, date: serverTimestamp() }] }, { merge: true });
              } catch(e){ }
            }

            const docRef = await addDoc(coll, { ...dataToInsert, createdAt: serverTimestamp() });
            return { data: [{ id: docRef.id, ...dataToInsert }], error: null };
          } else {
            const docRef = await addDoc(coll, { ...dataToInsert, createdAt: serverTimestamp() });
            return { data: [{ id: docRef.id, ...dataToInsert }], error: null };
          }
        } catch (e) {
          return { data: null, error: e };
        }
      },
      select: async () => {
        try {
          const q = query(coll, orderBy('createdAt', 'desc'), limit(50));
          const snaps = await getDocs(q);
          const rows = snaps.docs.map(d => ({ id: d.id, ...d.data() }));
          return { data: rows, error: null };
        } catch (e) {
          return { data: null, error: e };
        }
      },
      update: async (payload) => {
        try {
          const [first] = Array.isArray(payload) ? payload : [payload];
          const id = first.id || first?.uid || first?.user_id;
          if (!id) throw new Error('id required');
          const docRef = doc(db, table, id);
          await updateDoc(docRef, first);
          const updated = await getDoc(docRef);
          return { data: [ { id: updated.id, ...updated.data() } ], error: null };
        } catch (e) {
          return { data: null, error: e };
        }
      },
      delete: async (queryObj) => {
        try {
          if (queryObj && queryObj[0] && queryObj[0].id) {
            await deleteDoc(doc(db, table, queryObj[0].id));
            return { data: null, error: null };
          }
          return { data: null, error: new Error('unsupported delete') };
        } catch (e) {
          return { data: null, error: e };
        }
      }
    };
  }
};

export { supabase };
