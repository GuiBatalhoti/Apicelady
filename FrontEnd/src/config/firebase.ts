import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Predio } from "../types/DataStructures/Predio";

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

export const getAllPredios = async () => {
  try {
    const prediosSnapshot = await getDocs(collection(db, "predio"));
    const predios = prediosSnapshot.docs.map((doc) => ({
      id: doc.id, // Inclui o ID do documento
      ...doc.data(),
    }));
    return predios;
  } catch (error) {
    console.error("Erro ao buscar prédios:", error);
    throw error;
  }
};

export const createPredio = async (predio: Predio) => {
  try {
    const docRef = await addDoc(collection(db, "predio"), predio);
    return docRef.id;
  } catch (error) {
    console.error("Erro ao criar prédio:", error);
    throw error;
  }
};

export const updatePredio = async (id: string, updatedData: Partial<Predio>) => {
  try {
    const predioRef = doc(db, "predio", id);
    await updateDoc(predioRef, updatedData);
    console.log("Prédio atualizado com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar prédio:", error);
    throw error;
  }
};

export const deletePredio = async (id: string) => {
  try {
    const predioRef = doc(db, "predio", id);
    await deleteDoc(predioRef);
    console.log("Prédio deletado com sucesso!");
  } catch (error) {
    console.error("Erro ao deletar prédio:", error);
    throw error;
  }
};
