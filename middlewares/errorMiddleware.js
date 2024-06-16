
const multer = require('multer');


// Create error handling middleware
const errorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      // Handle Multer errors
      console.log('Multer error:', err);
      return res.status(400).json({ error: err.message });
    } else if (err && err.message === 'Only video files in MP4, MPEG, or QuickTime formats are allowed') {
      // Handle the specific error thrown by fileFilter
      console.log('File filter error:', err.message);
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // Handle other errors
      console.log('Other error:', err);
      return res.status(500).json({ error: err.message });
    }
    next();
  };
  
 module.exports = {errorHandler}
  