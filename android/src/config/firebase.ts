import { initializeApp } from "firebase/app";
/** Por hora não haverá login no App */
// import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Predio } from "../types/DataStructures/Predio";
import { Bem } from "../types/DataStructures/Bem";
import { Departamento } from "../types/DataStructures/Departamento";
import { Sala } from "../types/DataStructures/Sala";
import { Funcionario } from "../types/DataStructures/Funcionario";
import { Conferencia } from "../types/DataStructures/Conferencia";
import data from "../../.env.json";

interface apikey {
  FIREBASE_API_KEY: string
}

const apikey: apikey = data;

const firebaseConfig = {
  apiKey: apikey.FIREBASE_API_KEY,
  authDomain: "apicelady.firebaseapp.com",
  projectId: "apicelady",
  storageBucket: "apicelady.appspot.com",
  messagingSenderId: "665797204550",
  appId: "1:665797204550:web:c0c5a2cf25118507cac847",
  measurementId: "G-TN1ZVHGSP4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/** Por hora não haverá login no App */
// export const auth = getAuth(app);
// export const googleProvider = new GoogleAuthProvider();

export const getAllFromCollection = async (collectionName: string) => {
  try {
    const dbCollectionResults = await getDocs(collection(db, collectionName));
    const collectionItems = dbCollectionResults.docs.map((doc) => ({
      id: doc.id, // Inclui o ID do documento
      ...doc.data(),
    }));
    return collectionItems;
  } catch (error) {
    console.error("Erro ao buscar:", error);
    throw error;
  }
};

export const createItem = async (collectionName: string, item: Predio | Bem | Departamento | Sala | Funcionario | Conferencia) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), item);
    return docRef.id;
  } catch (error) {
    console.error("Erro ao criar:", error);
    throw error;
  }
};

export const updateItem = async (collectionName: string,id: string, updatedData: Partial<Predio | Bem | Departamento | Sala | Funcionario | Conferencia>) => {
  try {
    const predioRef = doc(db, collectionName, id);
    await updateDoc(predioRef, updatedData);
    console.log("Atualizado com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar:", error);
    throw error;
  }
};

export const deleteItem = async (collectionName: string, id: string) => {
  try {
    await deleteDoc(doc(db, collectionName, id));
    console.log("Deletado com sucesso!");
  } catch (error) {
    console.error("Erro ao deletar:", error);
    throw error;
  }
};
