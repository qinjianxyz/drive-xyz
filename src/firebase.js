import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

/*
const app = firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: "G-BZTPFJ44L4",
});
*/

const app = firebase.initializeApp({
  apiKey: "AIzaSyBrGmN8SpybPIRW9fgrrz5OkpVuztjSgrs",
  authDomain: "auth-development-bec1f.firebaseapp.com",
  projectId: "auth-development-bec1f",
  storageBucket: "auth-development-bec1f.appspot.com",
  messagingSenderId: "140931333027",
  appId: "1:140931333027:web:60e5a94c8ba857fe3eb816",
  measurementId: "G-SSBM36QX9Z",
});

const firestore = app.firestore();
export const database = {
  folders: firestore.collection("folders"),
  files: firestore.collection("files"),
  formatDoc: (doc) => {
    return { id: doc.id, ...doc.data() };
  },
  getCurrentTimestamp: firebase.firestore.FieldValue.serverTimestamp,
};

export const storage = app.storage();
export const auth = app.auth();
export default app;
