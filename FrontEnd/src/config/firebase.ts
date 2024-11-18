import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const apiKey = import.meta.env.VITE_API_KEY;
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "apicelady.firebaseapp.com",
  projectId: "apicelady",
  storageBucket: "apicelady.firebasestorage.app",
  messagingSenderId: "665797204550",
  appId: "1:665797204550:web:c0c5a2cf25118507cac847",
  measurementId: "G-TN1ZVHGSP4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const getPredios = async () => {
  const prediosCollection = collection(db, 'predio');
  const prediosSnapshot = await getDocs(prediosCollection);
  const predios = prediosSnapshot.docs.map(doc => doc.data());
  return predios;
}