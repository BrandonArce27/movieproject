// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLiyZPcTi_P5-ILVbsp8fprgAflj7vlw0",
  authDomain: "movieproject-de118.firebaseapp.com",
  projectId: "movieproject-de118",
  storageBucket: "movieproject-de118.appspot.com",
  messagingSenderId: "248549843124",
  appId: "1:248549843124:web:b8283fcd986125503cb7e1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
