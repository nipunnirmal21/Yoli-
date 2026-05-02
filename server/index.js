const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// සරලම ක්‍රමය: ෆයිල් එකෙන් ඩේටා අරන් දෙන එක
app.get('/api/products', (req, res) => {
    try {
        const dataPath = path.join(__dirname, 'data', 'products.json');
        const productsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        res.json({ products: productsData });
    } catch (error) {
        res.status(500).json({ message: "File read error" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Static server running on port ${PORT}`);
});