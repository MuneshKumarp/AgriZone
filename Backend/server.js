const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const passwordRoutes = require('./routes/password');
const zoneRoutes = require('./routes/zones');
const cropsRoutes = require('./routes/crops');
const profileRoutes = require('./routes/profile');
const harisRoutes = require('./routes/haris');
const assignmentsRoutes = require('./routes/assignments');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = 'mongodb://localhost:27017/agrizone';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✓ Connected to MongoDB');
  })
  .catch((err) => {
    console.error('✗ MongoDB connection error:', err);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/zones', zoneRoutes);
app.use('/api/crops', cropsRoutes);
app.use('/api/haris', harisRoutes);
app.use('/api/assignments', assignmentsRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging for easier debugging
app.use((req, res, next) => {
  console.log(`--> ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AgriZone Backend is running' });
});

// 404 handler for unmatched API routes
app.use((req, res, next) => {
  console.warn(`No route matched: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Not found', message: 'API route not found' });
});

// Start server
const PORT = process.env.PORT || 3000;
try { fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true }); } catch {}
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ AgriZone Backend Server running on port ${PORT}`);
});

module.exports = app;
