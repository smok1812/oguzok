import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDu0v_yy_GuJOQd7H0nYYI-U7-uNNETDEo",
  authDomain: "igor-8e1a0.firebaseapp.com",
  projectId: "igor-8e1a0",
  storageBucket: "igor-8e1a0.firebasestorage.app",
  messagingSenderId: "1040267278448",
  appId: "1:1040267278448:web:13e52e1fad81f6fa049cb5",
  measurementId: "G-65N1HTZQR8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;