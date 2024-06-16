const multer = require('multer');

function setupMulter(app) {
  const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 10 * 1024 * 1024 }, // Max file size 10 MB
    fileFilter: (req, file, cb) => {
      const allowedFormats = ['video/mp4', 'video/mpeg', 'video/quicktime']; // Add more formats if needed
      if (!allowedFormats.includes(file.mimetype)) {
        cb(new Error('Only video files in MP4, MPEG, or QuickTime formats are allowed'));
      } else {
        cb(null, true);
      }
    }
  });

  // Use the upload middleware for handling file uploads
  app.post('/upload', (req, res, next) => {
    upload.single('video')(req, res, (err) => {
      if (err) {
        return next(err); // Pass the error to the error-handling middleware
      }
      next();
    });
  });
}

module.exports = { setupMulter };
