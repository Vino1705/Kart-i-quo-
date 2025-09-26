
'use client';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCVfVjD-7pW0M-CoDS4d_1sU_Lafdsg6J4",
    authDomain: "kart-i-quo-financial-guide-502a1.firebaseapp.com",
    projectId: "kart-i-quo-financial-guide-502a1",
    storageBucket: "kart-i-quo-financial-guide-502a1.appspot.com",
    messagingSenderId: "367352358872",
    appId: "1:367352358872:web:60a92795c65a95f2e87c80",
    measurementId: "G-8Z0B3S6E31"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
