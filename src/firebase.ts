// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyApe01yUv30GTrK96mVw_OwA3ujMSoXYFU",
  authDomain: "nwitter-reloaded-c42e0.firebaseapp.com",
  projectId: "nwitter-reloaded-c42e0",
  storageBucket: "nwitter-reloaded-c42e0.appspot.com",
  messagingSenderId: "1049157754702",
  appId: "1:1049157754702:web:7e9b9957d9f0e61312c81f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);