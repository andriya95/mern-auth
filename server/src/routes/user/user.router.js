const express = require('express');
const auth = require('../../middlewares/auth');
const {
  registerUser,
  activateUser,
  userSignIn,
  access,
  forgot,
  resetPassword,
  userInfo,
  update,
  signOut,
  googleSignIn,
} = require('./user.controller');

const userRouter = express.Router();

userRouter.post('/api/auth/register', registerUser);
userRouter.post('/api/auth/activation', activateUser);
userRouter.post('/api/auth/signin', userSignIn);
userRouter.post('/api/auth/access', access);
userRouter.post('/api/auth/forgot_pass', forgot);
userRouter.post('/api/auth/reset_pass', auth, resetPassword);
userRouter.get('/api/auth/user', auth, userInfo);
userRouter.patch('/api/auth/user_update', auth, update);
userRouter.get('/api/auth/signout', signOut);
userRouter.post('/api/auth/google_signin', googleSignIn);

module.exports = userRouter;