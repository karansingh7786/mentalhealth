const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const predictionRoutes = require('./routes/predictionRoutes');
const historyRoutes = require('./routes/historyRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root API
app.get('/', (req, res) => {
  res.json({ status: 'MindAlert API is running with PostgreSQL!' });
});

// Route Handlers
app.use('/', authRoutes);
app.use('/', predictionRoutes);
app.use('/', historyRoutes);

// Global 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 MindAlert Node.js Backend listening on port ${PORT}`);
});
