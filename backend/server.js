const express = require('express');
const dotenv = require('dotenv').config(); // Load environment variables from .env file
const colors = require('colors');
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const Post = require('./models/projectModel'); // Import the Post model
const projectRouter = require('./routes/projectRoutes')(Post); // Pass the Post model to the router

connectDB(); // Connect to the database
const app = express();

// Middleware to handle preflight OPTIONS requests
app.options("/posts", function(req, res) {
    res.header('Allow', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Accept', 'application/json');
    res.set('Content-Type', 'application/json');
    res.sendStatus(200);
});

app.options("/posts/:itemId", function(req, res) {
    res.header('Allow', 'GET, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, PATCH, DELETE, OPTIONS');
    res.set('Content-Type', 'application/json');
    res.set('Accept', 'application/json');
    res.sendStatus(200);
});

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Custom middleware to handle JSON requests
app.use(function(req, res, next) {
    if (req.accepts('json')) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, Content-Length, X-Requested-With');
        next();
    } else {
        res.sendStatus(404); // Return 404 for non-JSON requests
    }
});

// Mount the projectRouter under the /posts route
app.use('/posts', projectRouter);

// Root route
app.get('/', function(req, res) {
    res.send('Welcome to my API');
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
