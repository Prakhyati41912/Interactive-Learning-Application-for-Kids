import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Storage

// Firebase configuration
const firebaseConfig = {
  apiKey: "secretkey",
  authDomain: "secretkey",
  projectId: "secretkey",
  storageBucket: "secretkeyp",
  messagingSenderId: "secretkey",
  appId: "secretkey",
  measurementId: "secretkey"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize Storage



export { auth, db, storage };
