const jwt = require("jsonwebtoken");

function signToken(userId) {
  return jwt.sign({ id: userId.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

module.exports = signToken;
