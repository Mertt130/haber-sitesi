// Firebase modüllerini içe aktarıyoruz
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase yapılandırma bilgileri (Firebase Console'dan al)
const firebaseConfig = {
  apiKey: "AIzaSyDUR36OhWlke_poYKvtAU-SHc1mPobb_gI",
  authDomain: "habersitesi-49c43.firebaseapp.com",
  projectId: "habersitesi-49c43",
  storageBucket: "habersitesi-49c43.firebasestorage.app",
  messagingSenderId: "330691528022",
  appId: "1:330691528022:web:96d0145cdcf3f9788dc2f7",
  measurementId: "G-5L46F4RDSY"
};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

// Firestore veritabanını başlat
const db = getFirestore(app);

// Firestore'u dışa aktar, başka dosyalarda kullanabilirsin
export { db };
