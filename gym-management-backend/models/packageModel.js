const { db } = require("../utils/firebaseAdmin");

// Firebase Firestore reference to 'packages' collection
const packagesCollection = db.collection("packages");

module.exports = { packagesCollection };
