/**
 * BEAUTY SALON NEOMORPHIC APP - Firebase Configuration
 * Store-Ready Mobile Application
 */

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import { getFunctions } from 'firebase/functions';

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

requiredEnvVars.forEach(key => {
  if (!import.meta.env[key]) {
    console.warn(`[Firebase Config] Critical Warning: ${key} is missing. Application features might be unstable.`);
  }
});

let app;
let auth;
let db;
let storage;
let analytics;
let functions;

try {
  // Only attempt to initialize if we have at least an API key
  if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
    functions = getFunctions(app);
  } else {
    throw new Error("Missing API Key");
  }
} catch (error) {
  console.error("[Firebase] Fatal Initialization Error:", error);
  // Create mock objects to prevent crash on import
  // These mocks allow the app to mount so ConfigGuard can show the error toast
  const mockService = {
    app: { name: '[MOCK]', options: {} },
  };

  app = { name: '[MOCK]', options: {} };
  // Cast to any to bypass strict type checks for the mock
  auth = mockService as any;
  db = mockService as any;
  storage = mockService as any;
  functions = mockService as any;
  analytics = null;
}

// Export initialized services (real or mock)
export { auth, db, storage, analytics, functions };
export { app };

export const isFirebaseInitialized = !!firebaseConfig.apiKey;

// Auth providers
export const googleProvider = new GoogleAuthProvider();

export default app;
