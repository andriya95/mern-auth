const fs = require('fs');

async function uploadImage(req, res, next)  {
  //check if file exists
  if (typeof req.file === 'undefined' || typeof req.body === 'undefined') {
    return res.status(500).json({
      error: 'THere is an issue with uploading this image!'
    });
  }

  //use the upload folder
  let image = req.file.path;

  //file type
  if (
    !req.file.mimetype.includes('jpeg') &&
    !req.file.mimetype.includes('jpg') &&
    !req.file.mimetype.includes('png')
  ) {
    //remove file
    fs.unlinkSync(image)

    return res.status(400).json({
      error: 'This file is not supported.'
    });
  }

  //file size
  if (req.file.size > 1024 * 1024) {
    //remove file
    fs.unlinkSync(image)
    return res.status(400).json({
      error: 'This file is too large (Max: 1MB).'
    });
  }
  //success
  next();
}

module.exports = uploadImage;