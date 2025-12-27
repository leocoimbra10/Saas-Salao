/**
 * BEAUTY SALON NEOMORPHIC APP - Firebase Configuration
 * Store-Ready Mobile Application
 */

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration for Marcela Makeup project
const firebaseConfig = {
  apiKey: "AIzaSyDJEmYizD6g9mztCpcCr2vBVc0wjK_Ubxg",
  authDomain: "marcela-makeup.firebaseapp.com",
  projectId: "marcela-makeup",
  storageBucket: "marcela-makeup.firebasestorage.app",
  messagingSenderId: "126198636482",
  appId: "1:126198636482:web:58834f801659d1dc7f005b",
  measurementId: "G-9XEEDQ97TR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Auth providers
export const googleProvider = new GoogleAuthProvider();

export default app;
