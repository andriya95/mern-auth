const jwt = require('jsonwebtoken');

const { 
  REFRESH_TOKEN, 
  ACTIVATION_TOKEN,
  ACCESS_TOKEN
} = process.env;


const createToken = {
  activation: (payload) => {
    return jwt.sign(
      payload,
      ACTIVATION_TOKEN,
      { expiresIn: "5m" }
    );
  },
  refresh: (payload) => {
    return jwt.sign(
      payload,
      REFRESH_TOKEN,
      { expiresIn: "24h" }
    );
  },
  access: (payload) => {
    return jwt.sign(
      payload,
      ACCESS_TOKEN,
      { expiresIn: "15m" }
    );
  },
}

module.exports = createToken;