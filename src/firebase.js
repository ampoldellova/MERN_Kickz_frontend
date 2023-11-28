// Import the functions you need from the SDKs you need
import firebase from 'firebase/app';
import 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDx24N6ahcQxR8xb2ZkF3AO9Mp9enExES0",
    authDomain: "arboreal-tracer-406202.firebaseapp.com",
    projectId: "arboreal-tracer-406202",
    storageBucket: "arboreal-tracer-406202.appspot.com",
    messagingSenderId: "1083253662042",
    appId: "1:1083253662042:web:1f600cf2a55c9907e19363",
    measurementId: "G-59NMDE53ZS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;