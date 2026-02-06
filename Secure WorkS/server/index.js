const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { initDB } = require('./db');
const authRoutes = require('./auth');
const accessRoutes = require('./accessControl');
const cryptoRoutes = require('./cryptoUtils'); // For demo endpoints

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize Database
initDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/access', accessRoutes);
app.use('/api/features', require('./features')); // New Smart Features
app.use('/api/crypto', cryptoRoutes); // Encryption demos

// Serve static files (if we build client later, but likely separate dev servers)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Server restarted with JSON error handling fixes.');
});
