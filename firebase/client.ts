// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCyFA2-wcatGTylBxlvfl3ATKfrfrBNDzw",
  authDomain: "prepwise-6aff0.firebaseapp.com",
  projectId: "prepwise-6aff0",
  storageBucket: "prepwise-6aff0.firebasestorage.app",
  messagingSenderId: "156471576970",
  appId: "1:156471576970:web:66460af40ee0220263a073",
  measurementId: "G-KBXV7894GL"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);