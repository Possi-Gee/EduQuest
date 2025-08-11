
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "notespark-igm4h.firebaseapp.com",
  projectId: "notespark-igm4h",
  storageBucket: "notespark-igm4h.appspot.com",
  messagingSenderId: "367373336345",
  appId: "1:367373336345:web:a663473180c98f98363776",
  measurementId: "G-8LRT0D1XN6"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
