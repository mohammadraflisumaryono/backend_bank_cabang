const app = require('./app');  // Import the app instance from app.js

// Load environment variables
const port = process.env.EXPRESS_PORT || 3000;

// Start the server
app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});


