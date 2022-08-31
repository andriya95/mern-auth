const express = require('express');

const userRouter = require('./user/user.router');
const uploadRouter = require('./upload/upload.router');

const api = express.Router()

api.use('/v1', userRouter);
api.use('/v1', uploadRouter);

module.exports = api;
