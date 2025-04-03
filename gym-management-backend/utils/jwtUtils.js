const jwt = require("jsonwebtoken");

const generateJWT = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const verifyJWT = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error("Invalid Token");
  }
};

module.exports = { generateJWT, verifyJWT };
