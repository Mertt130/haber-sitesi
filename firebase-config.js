// Firebase SDK'yı başlat
const firebaseConfig = {
  apiKey: "AIzaSyDUR36OhWlke_poYKvtAU-SHc1mPobb_gI",
  authDomain: "habersitesi-49c43.firebaseapp.com",
  projectId: "habersitesi-49c43",
  storageBucket: "habersitesi-49c43.appspot.com",
  messagingSenderId: "330691528022",
  appId: "1:330691528022:web:96d0145cdcf3f9788dc2f7",
  measurementId: "G-5L46F4RDSY"
};

// Firebase başlat
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
