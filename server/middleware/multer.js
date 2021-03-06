const multer = require('multer');

// MULTER 
const storage = multer.diskStorage({
    filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
const upload = multer({storage: storage})

module.exports = upload;