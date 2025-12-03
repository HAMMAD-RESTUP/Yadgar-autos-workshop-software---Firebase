// firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCTDpoNNM4VBs1zZtKMyTA2W4Ql_tGiEC8",
  authDomain: "yadgar-workshop-management.firebaseapp.com",
  projectId: "yadgar-workshop-management",
  storageBucket: "yadgar-workshop-management.firebasestorage.app",
  messagingSenderId: "270473450152",
  appId: "1:270473450152:web:261ca85015ca1fcabaa89d",
  measurementId: "G-8ZT0DN3M9E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth
export const auth = getAuth(app);

// Export Firestore DB
export const db = getFirestore(app);
export const storage = getStorage(app);