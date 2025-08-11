
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYyHWgmQ9JhuDJCw4vN6BhLppMX4aF-hU",
  authDomain: "eduquest-mobile.firebaseapp.com",
  projectId: "eduquest-mobile",
  storageBucket: "eduquest-mobile.firebasestorage.app",
  messagingSenderId: "297783818094",
  appId: "1:297783818094:web:c44fbeed16413d7f24b37f"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
