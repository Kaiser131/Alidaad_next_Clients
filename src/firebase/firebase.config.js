import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBR55cId3Da3QRrOptRYUF0aaXFp3DObDY",
    authDomain: "al-idaat.firebaseapp.com",
    projectId: "al-idaat",
    storageBucket: "al-idaat.firebasestorage.app",
    messagingSenderId: "80297068651",
    appId: "1:80297068651:web:a56683eab7c88ec1b2092e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
export default auth;