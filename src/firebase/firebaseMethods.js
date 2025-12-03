// src/firebase/firebaseMethods.js
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  setDoc,
  increment,
} from "firebase/firestore";

import { auth, db } from "./firebaseConfig";

// ------------------------------------------------------------
// 🚀 AUTH METHODS
// ------------------------------------------------------------

// 🔵 Login (Admin only)
export const loginAdmin = async (email, password) => {
  const adminEmail = "yadgarautos1@gmail.com";
  const adminPassword = "yadgar123";

  if (email !== adminEmail || password !== adminPassword) {
    return {
      success: false,
      message: "❌ Invalid admin credentials!",
    };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      adminEmail,
      adminPassword
    );

    return {
      success: true,
      user: userCredential.user,
    };
  } catch (err) {
    return {
      success: false,
      message: "❌ Firebase admin login failed!",
    };
  }
};

// 🔴 Logout
export const logoutAdmin = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch {
    return { success: false, message: "Logout failed!" };
  }
};

// ------------------------------------------------------------
// 💼 Generate Insurance Job Bill Number
// ------------------------------------------------------------
export const generateBillNo = async (incrementFlag = true) => {
  const counterRef = doc(db, "counters", "jobFiles");

  // Get current counter
  const counterSnap = await getDoc(counterRef);
  let currentNumber = 0;

  if (!counterSnap.exists()) {
    await setDoc(counterRef, { current: 0 });
  } else {
    const data = counterSnap.data();
    currentNumber = Number(data?.current) || 0;

    if (incrementFlag) {
      await updateDoc(counterRef, { current: increment(1) });
      currentNumber += 1;
    }
  }

  const padded = currentNumber.toString().padStart(4, "0");
  return `YAI-${padded}`;
};

// 👤 Listen to auth state
export const getCurrentUser = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// ------------------------------------------------------------
// 📦 Firestore Methods
// ------------------------------------------------------------

// ➕ Add data
export const addData = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return { success: true, id: docRef.id };
  } catch (err) {
    return { success: false, message: "Error adding data" };
  }
};

// 📥 Get all documents
export const getAllData = async (collectionName) => {
  try {
    const snapshot = await getDocs(collection(db, collectionName));

    const list = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    return { success: true, data: list };
  } catch (err) {
    return { success: false, message: "Error getting data" };
  }
};

// 📄 Get single document
export const getSingleData = async (collectionName, id) => {
  try {
    const snap = await getDoc(doc(db, collectionName, id));

    if (snap.exists()) {
      return { success: true, data: snap.data() };
    } else {
      return { success: false, message: "Document not found" };
    }
  } catch (err) {
    return { success: false, message: "Error fetching document" };
  }
};

// 🔄 Update document
export const updateData = async (collectionName, id, newData) => {
  try {
    await updateDoc(doc(db, collectionName, id), newData);
    return { success: true };
  } catch (err) {
    return { success: false, message: "Error updating document" };
  }
};

// ❌ Delete document
export const deleteData = async (collectionName, id) => {
  try {
    await deleteDoc(doc(db, collectionName, id));
    return { success: true };
  } catch (err) {
    return { success: false, message: "Error deleting data" };
  }
};
