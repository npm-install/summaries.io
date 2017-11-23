const admin = require('./node_modules/firebase-admin')

const data = require('./data.json')
const serviceAccount = require('./service-key.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://summary-73ccc.firebaseio.com'
});

data && Object.keys(data).forEach(key => {
    const nestedContent = data[key];
    nestedContent.forEach(source => {
            admin.firestore()
                .collection(key)
                .doc(source.id)
                .set(source)
                .then((res) => {
                    console.log("Document successfully written!");
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
        });
});
