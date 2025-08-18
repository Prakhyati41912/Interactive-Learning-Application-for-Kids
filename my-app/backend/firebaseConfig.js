const admin = require("firebase-admin");
const serviceAccount = require("./abc-firebase-adminsdk-secretkey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "abc.appspot.com",
});

const bucket = admin.storage().bucket();
const db = admin.firestore();

module.exports = { bucket, db };

