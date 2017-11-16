import firebase from 'firebase';
// Required for side-effects
require('firebase/firestore');

const config = {
  apiKey: "AIzaSyAkc2x4ZAXRgOQHGkf6KGYyLTHz47PBqxs",
  authDomain: "summary-73ccc.firebaseapp.com",
  databaseURL: "https://summary-73ccc.firebaseio.com",
  projectId: "summary-73ccc",
  storageBucket: "summary-73ccc.appspot.com",
  messagingSenderId: "494672399890"
};

firebase.initializeApp(config);

export const db = firebase.firestore();
export const firebaseAuth = firebase.auth;
