// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUR36OhWlke_poYKvtAU-SHc1mPobb_gI",
  authDomain: "habersitesi-49c43.firebaseapp.com",
  projectId: "habersitesi-49c43",
  storageBucket: "habersitesi-49c43.firebasestorage.app",
  messagingSenderId: "330691528022",
  appId: "1:330691528022:web:96d0145cdcf3f9788dc2f7",
  measurementId: "G-5L46F4RDSY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);