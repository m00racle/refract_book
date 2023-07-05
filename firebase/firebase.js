import { initializeApp } from "firebase/app";


// import auth
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    console.log("localhost detected, init emulator")
    // init auth emulator
    const auth = getAuth();
    connectAuthEmulator(auth, "http://127.0.0.1:9099");

    // init firestore emulator
    const db = getFirestore();
    connectFirestoreEmulator(db, '127.0.0.1', 8080);

    // init storage emulator
    const storage = getStorage();
    connectStorageEmulator(storage, "127.0.0.1", 9199);
} else {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const storage = getStorage(app);
}
