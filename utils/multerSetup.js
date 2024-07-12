const multer = require('multer');

function setupMulter() {
  const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 10 * 1024 * 1024 }, // Max file size 10 MB
    fileFilter: (req, file, cb) => {
      const allowedFormats = ['video/mp4', 'video/mpeg', 'video/quicktime']; // Add more formats if needed
      if (!allowedFormats.includes(file.mimetype)) {
        return cb(new Error('Only video files in MP4, MPEG, or QuickTime formats are allowed'));
      } else {
        return cb(null, true);
      }
    }
  });

  return { upload }; // Return an object with 'upload' property
}

module.exports = { setupMulter };
