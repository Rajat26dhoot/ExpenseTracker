// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeAuth,getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3xncLAKtc_wM8C4UOFPGG4eNjeqfWl0Q",
  authDomain: "expense-tracker-82e81.firebaseapp.com",
  projectId: "expense-tracker-82e81",
  storageBucket: "expense-tracker-82e81.firebasestorage.app",
  messagingSenderId: "654500482359",
  appId: "1:654500482359:web:8ccf585529e9599887deb2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// auth
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// db
export const firestore = getFirestore(app);