import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Ensure the environment variables are loaded
console.log("Firebase API Key:", process.env.REACT_APP_FIREBASE_API_KEY);

const firebaseConfig = {
  apiKey: "AIzaSyBBi_x0BtGKENC0cRHN-RMuGyWap0usvHg",
  authDomain: "sports-edu-ad6ff.firebaseapp.com",
  projectId: "sports-edu-ad6ff",
  storageBucket: "sports-edu-ad6ff.firebasestorage.app",
  messagingSenderId: "613176637186",
  appId: "1:613176637186:web:61a0f915d5ff3ee83bb41b",
};

let app;
let auth;
let db;

try {
  app = initializeApp(firebaseConfig); // Initialize Firebase app
  auth = getAuth(app); // Initialize Firebase Auth
  db = getFirestore(app); // Initialize Firestore
} catch (error) {
  console.error("Firebase initialization error:", error); // Log any initialization errors
}

export { auth, db };
export default app;
