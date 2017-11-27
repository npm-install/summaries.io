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
  firebaseAuth()
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
  db // removed return
    .collection(`users`)
    .doc(user.email)
    .set({
      email: user.email,
      uid: user.uid,
    })
    .then(docRef => {
      const batch = db.batch() // we set a batch up to connect to the database once
      // upon creation we add default subscriptions to the newly created user
      batch.set(db.collection(docRef.path + '/subscriptions/').doc('bloomberg'), {
        name: 'Bloomberg',
      })
      batch.set(db.collection(docRef.path + '/subscriptions/').doc('abc-news'), {
        name: 'ABC News',
      })
      batch
        .commit()
        .then(console.log)
        .catch(console.error)
    })
    .catch(function(error) {
      console.error('Error adding document: ', error)
    })
}
