const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const validateEmail = require('../services/validateEmail');
const createToken = require('../services/createToken');

const {
  sendEmailRegister,
  sendEmailReset,
} = require('../services/sendMail');


const { REFRESH_TOKEN, ACTIVATION_TOKEN } = process.env;


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
    const user = await User.findOne({email});

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
    sendEmailRegister(email, url, "Verify your email!");

    //registration succesful
    return res.status(200).json({
      message: "Welcome! Please check your email."
    });

  } catch(err) {
    return res.status(500).json({ error: err.message });
  }
}

async function activateUser(req, res) {
  try {
    //get token
    const { activation_token } = req.body;

    //verify token
    const user = jwt.verify(
      activation_token,
      ACTIVATION_TOKEN
    );
    const { name, email, password } = user;

    //double check the user
    const check = await User.findOne({email});

    if (check) {
      return res.status(400).json({
        error: 'This email is already in use!'
      })
    }
    
    //add user in db 
    await User.updateOne({
      email: email
    }, {
      name: name,
      email: email,
      password: password
    }, {
      upsert: true
    })
    
    //activation success
    return res.status(201).json({
      message: 'Your account has been activated, you can sign in now.'
    })

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function userSignIn(req, res) {
  try {
    //get credentials
    const { email, password } = req.body;

    //check email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: 'Email not registered!'
      })
    }

    //check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({
        error: 'Password is incorrect!'
      })
    }
    //refresh token
    const rf_token = createToken.refresh({ id: user._id });

    res.cookie('_apprftoken', rf_token, {
      httpOnly: true,
      path: "/v1/api/auth/access",
      maxAge: 24 * 60 * 60 * 1000,
    });

    //singing in success
    return res.status(200).json({
      message: "Successful sign in!"
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function access(req, res) {
  try {
    //getting rftoken from the cookie object set above
    const rf_token = req.cookies._apprftoken;
    if(!rf_token) {
      return res.status(400).json({
        error: "Please sign in!"
      });
    }

    //validate rftoken taken from the cookie
    jwt.verify(rf_token, REFRESH_TOKEN, (err, user) => {
      if(err) {
        return res.status(400).json({
          error: 'Please sign in again'
        });
      }
      //create access token
      const ac_token = createToken.access({ id: user.id });
      //access successful
      return res.status(200).json({ ac_token });
    });
  
  } catch (err) {
    return res.status(500).json({
      error: err.message
    })
  }
}

async function forgot(req, res) {
  try {
    //get Email
    const { email } = req.body;

    //check if email exists
    const user = await User.findOne({ email });
    if(!user) {
      return res.status(404).json({
        message: 'This email is not registered!'
      })
    }

    //create access token
    const ac_token = createToken.access({ id: user.id });

    //send email with access token
    const url = `http://localhost:3000/auth/reset-password/${ac_token}`;
    const name = user.name;
    sendEmailReset(email, url, "Reset your password", name);

    //success
    return res.status(200).json({
      message: 'Check your email! Follow the link in your email to reset your password.'
    })

  } catch(err) {
    res.status(500).json({ message: err.message })
  }
}

async function resetPassword(req, res) {
  try {
    //get the password
    const { password } = req.body;

    //hash Password
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    //update password
    await User.findOneAndUpdate({
      _id: req.user.id
    }, {
      password: hashPassword
    });

    //reset successful
    return res.status(200).json({
      message: 'Password was updated successfully!'
    });

  } catch (err) {
    return res.status(500).json({ message: err.message});
  }
}

module.exports = {
  registerUser,
  activateUser,
  userSignIn,
  access,
  forgot,
  resetPassword,
}