const { db } = require("../utils/firebaseAdmin");

// Firestore reference to 'trainers' collection
const trainersCollection = db.collection("trainers");

module.exports = { trainersCollection };
