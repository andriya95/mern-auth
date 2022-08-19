const jwt = require('jsonwebtoken');

async function auth(req, res, next) {
  try {
    //check for ac token
    const token = req.header("Authorization")
    
    if(!token) {
      return res.status(400).json({
        message: 'Authentication failed'
      });
    }

    //validate ac token
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
      if(err) {
        return res.status(400).json({
          error: 'Authentication failed'
        });
      }
      //success
      req.user = user;
      next();
    });

    
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
} 

module.exports = auth;
