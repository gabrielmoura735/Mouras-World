import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Detecta se está rodando no domínio web.app para usar Same-Origin Auth (evita bloqueio de cookies de terceiros)
const isWebAppHosting = typeof window !== 'undefined' && window.location.hostname.includes('web.app');

const firebaseConfig = {
  apiKey: "AIzaSyDVtP6Dud2pDTmuDjc8H_q6CVkA-XNaG0I",
  authDomain: isWebAppHosting ? window.location.hostname : "encurtador-links-8719.firebaseapp.com",
  projectId: "encurtador-links-8719",
  storageBucket: "encurtador-links-8719.firebasestorage.app",
  messagingSenderId: "123256503758",
  appId: "1:123256503758:web:9aa049e995352b628f7f9f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
