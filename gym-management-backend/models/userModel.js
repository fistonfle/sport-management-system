const { db } = require("../utils/firebaseAdmin");

const userCollection = db.collection("users");

const getUserById = async (id) => {
  const user = await userCollection.doc(id).get();
  return user.exists ? user.data() : null;
};

const createUser = async (data) => {
  const user = await userCollection.add(data);
  return user.id;
};

module.exports = { getUserById, createUser };
