import { db, firebaseAuth } from '../config/constants'

export function auth(email, pw) {
  return firebaseAuth()
    .createUserWithEmailAndPassword(email, pw)
    .then(saveUser)
}

export function logout() {
  return firebaseAuth().signOut()
}

export function login(email, pw) {
  return firebaseAuth().signInWithEmailAndPassword(email, pw)
}

export function loginWithGoogle() {
  const provider = new firebaseAuth.GoogleAuthProvider()
  firebaseAuth().signInWithRedirect(provider)
  firebaseAuth
    .getRedirectResult()
    .then(function(authData) {
      console.log(authData)
    })
    .catch(function(error) {
      console.log(error)
    })
}

export function resetPassword(email, actionCodeSettings) {
  return firebaseAuth().sendPasswordResetEmail(email, actionCodeSettings)
}

export function saveUser(user) {
  return db
    .collection(`users`)
    .add({
      email: user.email,
      uid: user.uid
    })
    .then(docRef => docRef)
    .catch(function(error) {
      console.error('Error adding document: ', error)
    })
}
