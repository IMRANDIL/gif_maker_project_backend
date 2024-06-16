const path = require('path');
const { createGif } = require('../utils/videoProcessing');
const fs = require('fs');
const {setupMulter} = require('../utils/multerSetup')
const router = require('express').Router();
const {upload} = setupMulter()
  // Handle file upload and GIF creation
  router.post('/upload', upload.single('video'), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded or invalid file type' });
    }
    const inputVideoPath = req.file.path;
    const outputGifPath = path.join('gifs', 'output.gif');

    let startTime = parseInt(req.body.startTime, 10);
    let duration = parseInt(req.body.duration, 10);

    // Check if startTime and duration are valid integers
    if (isNaN(startTime)) {
      startTime = 0; // Default to 0 if not a valid integer
    }
    if (isNaN(duration)) {
      duration = 2; // Default to 2 seconds if not a valid integer
    }

    try {
      await createGif(inputVideoPath, outputGifPath, startTime, duration);
      res.status(200).json({
        msg: 'GIF created successfully',
        gifUrl: `http://localhost:3001/${outputGifPath}`
      });
    } catch (err) {
      res.status(500).send(err);
    } finally {
      // Clean up uploaded video
      fs.unlinkSync(inputVideoPath);
    }
  });

 


module.exports = router;
