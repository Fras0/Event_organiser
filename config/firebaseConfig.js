// backend/config/firebaseConfig.js
const admin = require("firebase-admin");
// const path = require("path");

// const serviceAccount = path.join(__dirname, "serviceAccountKey.json");
const serviceAccount = require("./../sonaa-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
