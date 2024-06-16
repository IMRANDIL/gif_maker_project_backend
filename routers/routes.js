const path = require('path');
const { createGif } = require('../utils/videoProcessing');
const fs = require('fs');

function setupRoutes(app, upload) {
  // Serve the HTML form
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  // Handle file upload and GIF creation
  app.post('/upload', upload.single('video'), async (req, res) => {
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
      res.status(500).send('Error creating GIF');
    } finally {
      // Clean up uploaded video
      fs.unlinkSync(inputVideoPath);
    }
  });
}

module.exports = { setupRoutes };
