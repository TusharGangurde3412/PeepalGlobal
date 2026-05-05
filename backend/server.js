const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser tools (no origin) and allow all if env list is empty.
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204
};

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Routes

// Serve uploaded images as static files (for backward compatibility with old uploads)
// New uploads are handled via Cloudinary
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Serve static files from Angular build (if exists)
// Check common Angular output paths and pick the one that contains index.html.
const fs = require('fs');
const candidateBuildPaths = [
  path.join(__dirname, '../frontend/dist/peepal-export-frontend/browser'),
  path.join(__dirname, '../frontend/dist/peepal-export-frontend'),
  path.join(__dirname, '../frontend/dist/frontend/browser')
];

const frontendBuildPath = candidateBuildPaths.find((buildPath) =>
  fs.existsSync(path.join(buildPath, 'index.html'))
);

console.log('Frontend build path resolved to:', frontendBuildPath);
if (frontendBuildPath) {
  app.use(express.static(frontendBuildPath));
} else {
  console.error('No frontend build found. Checked paths:', candidateBuildPaths);
}

// Apply CORS only to API routes.
app.use('/api', cors(corsOptions));
app.options('/api/*', cors(corsOptions));

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/inquiries', require('./routes/inquiries'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/users', require('./routes/users'));
app.use('/api/upload', require('./routes/upload'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running' });
});

// Serve Angular app for all non-API routes (SPA routing)
app.get('*', (req, res) => {
  if (!frontendBuildPath) {
    return res.status(500).json({ error: 'Frontend build not found on server' });
  }

  res.sendFile(path.join(frontendBuildPath, 'index.html'), (err) => {
    if (err) {
      res.status(404).json({ error: 'Not found' });
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
