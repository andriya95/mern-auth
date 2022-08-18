const express = require('express');

const userRouter = require('./user.router');

const api = express.Router()

api.use('/v1', userRouter);

module.exports = api;
