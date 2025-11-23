import admin from 'firebase-admin';

if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY && process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n');
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey
    })
  });
}
const db = admin.firestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { uid, email, displayName, role = 'user' } = req.body;
  if (!uid) return res.status(400).json({ error: 'uid required' });
  await db.collection('users').doc(uid).set({ uid, email, displayName: displayName || '', role, createdAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
  return res.status(200).json({ ok: true });
}