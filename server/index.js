const express = require('express');
const cors = require('cors');
// මෙන්න මෙතැනදී අපි කෙලින්ම ඔයාගේ localProducts.js එක ගන්නවා
const productsData = require('./data/localProducts');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API එකෙන් ඩේටා දෙන හැටි
app.get('/api/products', (req, res) => {
    // localProducts.js එක ඇතුළේ ඩේටා ටික තියෙන නිසා කෙලින්ම යවනවා
    res.json({ products: productsData });
});

app.listen(PORT, () => {
    console.log(`🚀 Static server running on port ${PORT}`);
});