const express = require('express');
const {
  registerUser,
} = require('./user.controller');

const userRouter = express.Router();

userRouter.post('/api/auth/register', registerUser);

module.exports = userRouter;