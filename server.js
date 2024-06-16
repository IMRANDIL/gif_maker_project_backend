const express = require('express');
const app = express();
const { setupRoutes } = require('./routers/routes');
const { setupMulter } = require('./utils/multerSetup');

// Set up middleware
app.use(express.static('public'));
setupMulter(app); // Set up multer

// Set up routes
setupRoutes(app);

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
