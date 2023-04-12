import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592
const firebaseConfig = {
  apiKey: "AIzaSyBnANdYwv4oBbEHdBRV7ZOzkPU0sLPiEYU",
  authDomain: "ppec-19340.firebaseapp.com",
  projectId: "ppec-19340",
  storageBucket: "ppec-19340.appspot.com",
  messagingSenderId: "491673976017",
  appId: "1:491673976017:web:759908594e74fabf97d9f0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };