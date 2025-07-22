// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "你的 API KEY",
//   authDomain: "your-app.firebaseapp.com",
//   projectId: "your-app-id",
//   storageBucket: "your-app.appspot.com",
//   messagingSenderId: "xxx",
//   appId: "xxx",
// };

const firebaseConfig = {
    apiKey: "AIzaSyDlu7EgtFGVqByWXjkyQaNoyu08YHAu86U",
  authDomain: "stormbet-36469.firebaseapp.com",
  projectId: "stormbet-36469",
  storageBucket: "stormbet-36469.firebasestorage.app",
  messagingSenderId: "282866302720",
  appId: "1:282866302720:web:20a81b6ad2f14a26a9fde5",
  measurementId: "G-E988HK2V4W"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
