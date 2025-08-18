const admin = require("firebase-admin");
const serviceAccount = require("./kidquest-2840b-firebase-adminsdk-fbsvc-956c139f59.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "kidquest-2840b.appspot.com",
});

const bucket = admin.storage().bucket();
const db = admin.firestore();

module.exports = { bucket, db };
