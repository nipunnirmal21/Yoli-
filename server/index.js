const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // මෙන්න මේක අනිවාර්යයි
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const shopRoutes = require('./routes/shopRoutes');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// MongoDB Connection ලොජික් එක
const mongoURI = "mongodb+srv://nipun:12345678a.@cluster0.ygbf9pf.mongodb.net/Yoli?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
    .then(() => console.log('✅ Connected to MongoDB Atlas Successfully!'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

app.use('/api/products', productRoutes);
app.use('/api/shops', shopRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Yoli server running on port ${PORT}`);
});