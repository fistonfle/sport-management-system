const { db } = require("../utils/firebaseAdmin");

// Firestore reference to 'clients' collection
const clientsCollection = db.collection("clients");

module.exports = { clientsCollection };
