const express = require('express');
const upload = require('../../middlewares/upload');
const uploadImage = require('../../middlewares/uploadImage');
const auth = require('../../middlewares/auth');

const { uploadAvatar }= require('./upload.controller');


const uploadRouter = express.Router();


uploadRouter.post('/api/upload', uploadImage, upload, auth, uploadAvatar);


module.exports = uploadRouter;