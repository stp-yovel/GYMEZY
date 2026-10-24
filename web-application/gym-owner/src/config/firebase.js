import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

const isConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId
);

let initializedApp = null;
let initializedAuth = null;
let googleProvider = null;

if (isConfigured) {
  try {
    initializedApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    initializedAuth = getAuth(initializedApp);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
  } catch (err) {
    console.warn('⚠️ Error initializing Firebase client:', err.message);
  }
}

export const getFirebaseApp = () => initializedApp;
export const getFirebaseAuth = () => initializedAuth;

/**
 * Triggers Google Sign-In popup
 * @returns {Promise<{ idToken: string, user: { email: string, displayName: string, photoURL: string, uid: string } }>}
 */
export const signInWithGoogle = async () => {
  if (isConfigured && initializedAuth && googleProvider) {
    const result = await signInWithPopup(initializedAuth, googleProvider);
    const idToken = await result.user.getIdToken();
    return {
      idToken,
      user: {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      },
    };
  }

  // Development Fallback Mode: When live Firebase client keys are not yet configured in .env
  console.info('⚠️ Firebase client credentials not set in VITE_FIREBASE_*. Prompting for simulated Google Sign-In.');
  
  const devEmail = window.prompt(
    '[DEV MODE - Firebase Keys Not Set]\nEnter Google Email to simulate Sign-In:',
    'owner@gymezy.com'
  );

  if (!devEmail) {
    throw new Error('Google Sign-In was cancelled.');
  }

  const cleanEmail = devEmail.trim().toLowerCase();
  const simulatedName = cleanEmail.split('@')[0].replace(/[._]/g, ' ');
  const mockPayload = {
    sub: `mock_google_${Date.now()}`,
    email: cleanEmail,
    name: simulatedName.charAt(0).toUpperCase() + simulatedName.slice(1),
    picture: 'https://lh3.googleusercontent.com/a/default-user',
  };

  const header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify(mockPayload));
  const mockToken = `${header}.${payload}.mockSignature`;

  return {
    idToken: mockToken,
    user: {
      uid: mockPayload.sub,
      email: mockPayload.email,
      displayName: mockPayload.name,
      photoURL: mockPayload.picture,
    },
  };
};

export { isConfigured };
