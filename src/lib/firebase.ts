
'use client';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAVmRQCGVHAlSd_GQsOGq43w_eAgrvPro4",
  authDomain: "adroit-cortex-448707-n5.firebaseapp.com",
  projectId: "adroit-cortex-448707-n5",
  storageBucket: "adroit-cortex-448707-n5.firebasestorage.app",
  messagingSenderId: "618931367385",
  appId: "1:618931367385:web:21d9aebf554a161281bdc8"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
