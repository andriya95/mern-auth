const bcrypt = require('bcryptjs');

const User = require('../models/user.model');
const validateEmail = require('../services/validateEmail');
const createToken = require('../services/createToken');
const sendMail = require('../services/sendMail');
const { activation } = require("../services/createToken");


async function registerUser(req, res) {
  try {
    //getting user information
    const { name, email, password } = req.body;

    //check if there is missing data
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Please fill in all the information!"
      });
    }
    //check email
    if(!validateEmail(email)) {
      return res.status(400).json({
        error: 'Please enter a valid email adress!'
      })
    }
    //check if user exists already
    const user = await User.findOne({
      email
    });
    if (user) {
      return res.status(400).json({
        error: "This email is already in use!"
      });
    }

    //check password
    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must have at least 6 characters!"
      });
    }

    //hash password
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    //create token
    const newUser = {name, email, password: hashPassword};
    const activation_token = createToken.activation(newUser);
    
    //send email
    const url = `http://localhost:3000/api/auth/activate/${activation_token}`;
    sendMail.sendEmailRegister(email, url, "Verify your email!");

    //registration succesful
    res.status(200).json({
      message: "Welcome! Please check your email."
    });

  } catch(err) {
    res.status(500).json({
      error: err.message
    });
  }
}

module.exports = {
  registerUser,
}