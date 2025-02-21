// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjwlpLtfPbmZyoV4i0M15YBK7uIzOBCpM",
  authDomain: "lifehackapp-c8bd4.firebaseapp.com",
  projectId: "lifehackapp-c8bd4",
  storageBucket: "lifehackapp-c8bd4.appspot.com",
  messagingSenderId: "642756816595",
  appId: "1:642756816595:web:123fc3f4e9b291df636e26",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Export Firebase services for use in other parts of the app
export { auth, db };
