// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFHzbX_8_t78vVLazO1Xkh25oqZyI_j7s",
  authDomain: "myportfolio-ff472.firebaseapp.com",
  projectId: "myportfolio-ff472",
  storageBucket: "myportfolio-ff472.firebasestorage.app",
  messagingSenderId: "223653507021",
  appId: "1:223653507021:web:0ac3a03b6e675fd7c39e84",
  measurementId: "G-TK911LPC3M"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);