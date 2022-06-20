import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCx_ESyL76XW9PmSguW1kWyyOQlI77Z82M",
  authDomain: "coinports.firebaseapp.com",
  projectId: "coinports",
  storageBucket: "coinports.appspot.com",
  messagingSenderId: "202154190048",
  appId: "1:202154190048:web:03bb20440330fac2115c85"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {
    db
}