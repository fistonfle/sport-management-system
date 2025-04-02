const { db } = require("../utils/firebaseAdmin");

// Firestore reference to 'classes' collection
const classesCollection = db.collection("classes");

module.exports = { classesCollection };
