const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const shopRoutes = require('./routes/shopRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/shops', shopRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Yoli API is running 🌿 (local data mode)' });
});

// Start server — no MongoDB needed, using local in-memory data
app.listen(PORT, () => {
    console.log(`🚀 Yoli server running on http://localhost:${PORT}`);
    console.log('📦 Using local product data (no MongoDB required)');
});
