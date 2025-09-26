
'use client';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDe4_dIGBlOmP0s6N-YOwEWCYrlKBmCqf0",
    authDomain: "kart-i-quo-financial-guide.firebaseapp.com",
    projectId: "kart-i-quo-financial-guide",
    storageBucket: "kart-i-quo-financial-guide.appspot.com",
    messagingSenderId: "389651574924",
    appId: "1:389651574924:web:e7c31d999e4f2666877995",
    measurementId: "G-SQ05TDD2R6"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
