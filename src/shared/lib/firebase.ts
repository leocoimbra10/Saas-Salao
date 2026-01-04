/**
 * BEAUTY SALON NEOMORPHIC APP - Firebase Configuration
 * Store-Ready Mobile Application
 */

import { initializeApp, FirebaseApp, FirebaseOptions } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { getFunctions, Functions } from 'firebase/functions';

// 1. Validate API Key immediately
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
if (!apiKey) {
  throw new Error("Missing Firebase API Key. Check your .env file.");
}

// 2. Typed Configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim(),
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET?.trim(),
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID?.trim(),
  appId: import.meta.env.VITE_FIREBASE_APP_ID?.trim(),
  measurementId: (import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || import.meta.env.VITE_GA_TRACKING_ID)?.trim()
};

console.log('[Firebase Info] Initializing with Project ID:', firebaseConfig.projectId);

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let analytics: Analytics | null = null;
let functions: Functions;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  functions = getFunctions(app);

  // Analytics only in browser
  if (typeof window !== 'undefined') {
    // analytics = getAnalytics(app); 
    // Temporarily disabled to prevent ad-blocker issues during dev
    analytics = null;
  }

  console.log('[Firebase] Successfully initialized');
} catch (error) {
  console.error('[Firebase] Initialization Failed:', error);
  throw error; // Re-throw to be caught by ErrorBoundary
}

// Export initialized services
// Note: We are now exporting initialized instances directly. 
// If init fails, the app should have crashed by now (expected behavior for critical config).
export { auth, db, storage, analytics, functions };
export { app };

// Helper to check status (legacy support)
export const isFirebaseInitialized = true;

export const checkFirestoreReady = () => {
  if (!db) {
    throw new Error("Firestore not initialized. Check your environment variables and firebase.ts configuration.");
  }
  return db;
};

// Auth providers
export const googleProvider = new GoogleAuthProvider();

export default app;

