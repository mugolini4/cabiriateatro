// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAUgz4wycbxD-rB3KcYp-vYX1yItCciMfk",
    authDomain: "cabiriateatro-f62f0.firebaseapp.com",
    projectId: "cabiriateatro-f62f0",
    storageBucket: "cabiriateatro-f62f0.appspot.com",
    messagingSenderId: "233229835674",
    appId: "1:233229835674:web:c0222ef0a10a2326be2e23",
    measurementId: "G-P7GXC4DXBN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);