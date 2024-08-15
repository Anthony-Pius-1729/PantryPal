import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCd5VdQ9EvgXflxKcGxOG1VY0H9nCXzqr0",
  authDomain: "pantrypal-65ef8.firebaseapp.com",
  projectId: "pantrypal-65ef8",
  storageBucket: "pantrypal-65ef8.appspot.com",
  messagingSenderId: "581342315296",
  appId: "1:581342315296:web:030c0bf64a9dae84e2cd45",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
