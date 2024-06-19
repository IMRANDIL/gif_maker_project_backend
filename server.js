const express = require('express');
require('dotenv').config()
const cors = require('cors')
const path = require('path');
const { errorHandler } = require('./middlewares/errorMiddleware');
const { connectDB } = require('./db/dbConfig');
const authMiddleware = require('./middlewares/authMiddleware');

const app = express();
const port = 3001;
app.use(cors())


// Serve the 'gifs' directory statically
app.use('/gifs', express.static(path.join(__dirname, 'gifs')));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

 // Serve the HTML form
 app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/download/:filename', authMiddleware, (req, res) => {
  const filePath = path.join(__dirname, 'gifs', req.params.filename);
  res.download(filePath, (err) => {
    if (err) {
      res.status(500).send('Error downloading file');
    }
  });
});

app.use('/api/users', require('./routers/user'))
app.use('/api/orders', require('./routers/order'))

app.use('/', require('./routers/routes'))

app.use(errorHandler)

connectDB().then(()=>{
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
})

