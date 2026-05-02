const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// කෙලින්ම JSON ෆයිල් එකෙන් ඩේටා ගන්නා හැටි
app.get('/api/products', (req, res) => {
    const dataPath = path.join(__dirname, 'data', 'products.json');
    const productsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    res.json({ products: productsData });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} (Static Mode)`);
});