/**
 * BEAUTY SALON NEOMORPHIC APP - Firebase Configuration
 * Store-Ready Mobile Application
 */

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { getFunctions, Functions } from 'firebase/functions';

// Firebase configuration for Marcela Makeup project
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || import.meta.env.VITE_GA_TRACKING_ID
};

// Environment Validation
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(key => !import.meta.env[key]);
if (missingVars.length > 0) {
  console.error(`[Firebase Config] CRITICAL: Missing environment variables: ${missingVars.join(', ')}`);
  console.error('[Firebase Config] The application will not work without proper Firebase configuration.');
}

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;
let analytics: Analytics | null = null;
let functions: Functions | undefined;
let initializationError: Error | null = null;

try {
  // Only attempt to initialize if we have at least an API key
  if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    // analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
    analytics = null; // Temporarily disabled to debug Auth
    functions = getFunctions(app);
    console.log('[Firebase] Successfully initialized');
  } else {
    throw new Error("Missing Firebase API Key - check your .env file");
  }
} catch (error) {
  console.error("[Firebase] Fatal Initialization Error:", error);
  initializationError = error as Error;
  // Don't create mock objects - let services handle undefined
}

// Helper function to ensure Firestore is ready
export const checkFirestoreReady = (): Firestore => {
  if (!db) {
    const errorMsg = initializationError
      ? `Firebase initialization failed: ${initializationError.message}`
      : 'Firebase Firestore not initialized. Check your environment variables.';
    throw new Error(errorMsg);
  }
  return db;
};

// Export initialized services (may be undefined if init failed)
export { auth, db, storage, analytics, functions };
export { app };

export const isFirebaseInitialized = !!firebaseConfig.apiKey && !!db;

// Auth providers
export const googleProvider = auth ? new GoogleAuthProvider() : undefined;

export default app;
