// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBeLcIpyppieiIGUUS_R_XeQNT9WVMXJPw",
  authDomain: "test-app-1c11d.firebaseapp.com",
  projectId: "test-app-1c11d",
  storageBucket: "test-app-1c11d.firebasestorage.app",
  messagingSenderId: "383446452595",
  appId: "1:383446452595:web:9e6a317da9de8635bfdd06"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore instance
export const db = getFirestore(app);