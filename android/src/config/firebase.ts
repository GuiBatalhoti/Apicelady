// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import data from '../../.env.json'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

interface apikey {
    FIREBASE_API_KEY: string
}

const apikey: apikey = data

const firebaseConfig = {
  apiKey: apikey.FIREBASE_API_KEY,
  authDomain: "apicelady.firebaseapp.com",
  projectId: "apicelady",
  storageBucket: "apicelady.appspot.com",
  messagingSenderId: "665797204550",
  appId: "1:665797204550:web:c0c5a2cf25118507cac847",
  measurementId: "G-TN1ZVHGSP4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
if (app) {
  console.log('')
  console.log('Connected to Firebase')
  console.log('')
}
export const db = getFirestore(app);
