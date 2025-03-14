// src/config/firebase.js

const admin = require('firebase-admin');
const serviceAccount = require('./path/to/serviceAccountKey.json'); // Update with the path to your service account key

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://<YOUR-FIREBASE-PROJECT-ID>.firebaseio.com' // Update with your Firebase project ID
});

const db = admin.firestore();

module.exports = { admin, db };