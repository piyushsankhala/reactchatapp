import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_QT-S7f-ZIx_ZqJl4eZ5FSclw6YbnsZc",
  authDomain: "chat-app-6aa02.firebaseapp.com",
  projectId: "chat-app-6aa02",
  storageBucket: "chat-app-6aa02.appspot.com", // ✅ correct URL
  messagingSenderId: "949894030075",
  appId: "1:949894030075:web:e94d1ba39ac53f0dc2465e",
};

const app = initializeApp(firebaseConfig);

// ✅ Export both
export const auth = getAuth(app);
export const db = getFirestore(app);
