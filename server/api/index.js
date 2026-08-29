const app = require('../app');
const connectDB = require('../config/db');

// Ensure MongoDB is connected when Vercel spins up the serverless function
connectDB();

module.exports = app;
