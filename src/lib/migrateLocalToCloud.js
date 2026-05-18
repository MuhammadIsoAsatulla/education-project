import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase.js';

const LOCAL_PROGRESS_KEY = 'meros:progress';

function readLocalProgress() {
  try {
    const raw = localStorage.getItem(LOCAL_PROGRESS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * On the first Google sign-in for a given UID, create the user's Firestore
 * document. The document is seeded with whatever progress was already in
 * localStorage (so a guest's points/achievements carry over), and the name
 * is auto-set to the Google `displayName` only if the user hadn't customized
 * it (i.e. it's still the default `Mehmon`).
 *
 * Subsequent sign-ins are a no-op aside from updating `lastSeenAt` and
 * refreshing the avatar/email from Google (in case the user changed them).
 *
 * Returns true if the doc was created, false if it already existed.
 */
export async function ensureCloudUserDoc(fbUser) {
  if (!db || !fbUser?.uid) return false;
  const ref = doc(db, 'users', fbUser.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    // Touch lastSeenAt + refresh avatar/email so the leaderboard etc. stay
    // current after a Google profile change. Never overwrite the stored name —
    // that's user-editable in /profil.
    const updates = {
      lastSeenAt: serverTimestamp(),
    };
    if (fbUser.photoURL) updates.picture = fbUser.photoURL;
    if (fbUser.email) updates.email = fbUser.email;
    try {
      await updateDoc(ref, updates);
    } catch {
      /* ignore — doc may have just been created in a parallel tab */
    }
    return false;
  }

  // Doc doesn't exist — migrate from localStorage and seed the Google profile.
  const local = readLocalProgress() || {};
  const localName = typeof local.name === 'string' ? local.name.trim() : '';
  const isDefaultName = !localName || localName === 'Mehmon';

  const initial = {
    ...local,
    name: isDefaultName
      ? fbUser.displayName || fbUser.email || 'MEROS foydalanuvchi'
      : localName,
    email: fbUser.email || null,
    picture: fbUser.photoURL || null,
    provider: 'google',
    cloudCreatedAt: serverTimestamp(),
    lastSeenAt: serverTimestamp(),
  };

  await setDoc(ref, initial);
  return true;
}
