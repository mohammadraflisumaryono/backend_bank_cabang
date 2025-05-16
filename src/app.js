const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

const bodyParser = require('body-parser');
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
// Middleware setup
app.use(cors());
app.use(express.json({ limit: '10mb' }));  // Allow larger body size
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use('/public', express.static(path.resolve(process.cwd(), 'public')));
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));


// API info endpoint
app.get('/', (req, res) => {
    return res.json({
        code: 0,
        description: 'backend-api service Bank Cabang Sister',
        author: 'Mohammad Rafli Sumaryono 😎😎😎',
    });
});

// Import and use the routes from router.js
const router = require('./routes/router');
app.use('/api', router);

// Not found handler
app.use('*', function (req, res) {
    return res.status(404).json({ code: 404, message: 'URL Not Found', data: null });
});

// Error handler
app.use((err, req, res, next) => {
    console.log(err);
    let response = {
        code: err.status || 500,
        message: err.message || 'Internal Server Error',
        data: null,
    };
    return res.status(response.code).json(response);
});

module.exports = app;
