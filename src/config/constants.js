import firebase from 'firebase'
// Required for side-effects
require('firebase/firestore')

const config = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  databaseURL: process.env.REACT_APP_databaseURL,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  serviceAccountKey: process.env.REACT_APP_serviceAccountKey
}

firebase.initializeApp(config)
export const db = firebase.firestore()
export const firebaseAuth = firebase.auth
