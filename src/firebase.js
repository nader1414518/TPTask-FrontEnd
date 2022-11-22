// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBTOjpRX2Mds_MS5QF2gaghxihmsXXjeAU",
  authDomain: "basf-simulator.firebaseapp.com",
  projectId: "basf-simulator",
  storageBucket: "basf-simulator.appspot.com",
  messagingSenderId: "526252224093",
  appId: "1:526252224093:web:556fa858f1b8ab7ae167b4",
  measurementId: "G-DSHMCPDJQH",
  databaseURL: "https://basf-simulator-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app;