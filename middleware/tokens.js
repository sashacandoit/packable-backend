const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */

function createToken(user) {

  let payload = {
    username: user.username,
    user_id: user.id
  };

  return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };
