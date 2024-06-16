const express = require('express');
const multer = require('multer');
const cors = require('cors')
const path = require('path');
const { setupRoutes } = require('./routers/routes');

const app = express();
const port = 3001;
app.use(cors())
// Middleware to handle file uploads
const upload = multer({ dest: 'uploads/' });

// Serve the 'gifs' directory statically
app.use('/gifs', express.static(path.join(__dirname, 'gifs')));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup routes
setupRoutes(app, upload);

app.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'gifs', req.params.filename);
  res.download(filePath, (err) => {
    if (err) {
      res.status(500).send('Error downloading file');
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
