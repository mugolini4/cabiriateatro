// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import 'firebase/compat/database'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
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
const app = firebase.initializeApp(firebaseConfig);
export const firestore = firebase.firestore()
export const auth = firebase.auth()

const analytics = getAnalytics(app);