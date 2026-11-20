
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCTIMhWFD1pqcjzYJ2gXI-mH7Ljo--FrDg",
    authDomain: "fifth-bloom.firebaseapp.com",
    projectId: "fifth-bloom",
    storageBucket: "fifth-bloom.firebasestorage.app",
    messagingSenderId: "454074076085",
    appId: "1:454074076085:web:a644b5a7669389114527fc",
    measurementId: "G-6C3CMKBL1T"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const provedorGoogle = new GoogleAuthProvider();
