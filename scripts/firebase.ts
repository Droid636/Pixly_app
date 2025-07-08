// scripts/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// 🔁 Reemplaza estos valores con los de tu proyecto en Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDYYAwKTPko6WjAOV3F3J-viRVIHA4daX0",
  authDomain: "pixly-educative.firebaseapp.com",
  projectId: "pixly-educative",
  storageBucket: "pixly-educative.firebasestorage.app",
  messagingSenderId: "228530081150",
  appId: "1:228530081150:web:60dfd948a689f0b2bcb72f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
