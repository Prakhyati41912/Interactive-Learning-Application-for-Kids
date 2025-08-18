import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Storage

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBr-pvMwu-P7l0ItHk7bQCyRjBwucd9ErA",
  authDomain: "kidquest-2840b.firebaseapp.com",
  projectId: "kidquest-2840b",
  storageBucket: "kidquest-2840b.firebasestorage.app",
  messagingSenderId: "1019351754067",
  appId: "1:1019351754067:web:0b0625ffd89c363d3e2da6",
  measurementId: "G-G3V9YD5FD0"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize Storage



export { auth, db, storage };
