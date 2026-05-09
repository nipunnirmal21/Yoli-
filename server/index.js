const express = require('express');
const cors    = require('cors');
const mongoose = require('mongoose');
const { enrichProductSeller, enrichProductsSellers } = require('./utils/sellerResolve');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ─── MongoDB Atlas Connection ─────────────────────────────────────────────────
const MONGO_URI =
    process.env.MONGO_URI ||
    'mongodb+srv://nipun:Nipun123@cluster0.ygbf9pf.mongodb.net/Yoli?retryWrites=true&w=majority';

mongoose
    .connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch((err) => console.error('❌ MongoDB connection error:', err.message));

// ─── Models ───────────────────────────────────────────────────────────────────
const Store   = require('./models/Store');
const Product = require('./models/Product');

// ─── Public Product API (MongoDB only) ───────────────────────────────────────
app.get('/api/products', async (req, res) => {
    try {
        const { category, sort, search, limit, featured } = req.query;

        const dbProducts = await Product.find().lean().sort({ createdAt: -1 });
        let results = await enrichProductsSellers(dbProducts);

        if (category && category !== 'all') {
            results = results.filter((p) => p.category === category);
        }

        if (search) {
            const q = search.toLowerCase();
            results = results.filter(
                (p) =>
                    (p.name && p.name.toLowerCase().includes(q)) ||
                    (p.description && p.description.toLowerCase().includes(q)) ||
                    (p.category && p.category.toLowerCase().includes(q))
            );
        }

        results.sort((a, b) => {
            if (featured === 'true') {
                if (a.isFeatured && !b.isFeatured) return -1;
                if (!a.isFeatured && b.isFeatured) return 1;
            }
            if (sort === 'price_asc') return a.price - b.price;
            if (sort === 'price_desc') return b.price - a.price;
            if (sort === 'newest') {
                return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            }
            return (b.popularity || 0) - (a.popularity || 0);
        });

        if (limit) results = results.slice(0, parseInt(limit, 10));

        res.json({ products: results });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Must be registered before /api/products/:id
app.get('/api/products/categories', async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        res.json({ categories: ['all', ...categories.filter(Boolean)] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[a-f\d]{24}$/i.test(id)) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const doc = await Product.findById(id).lean();
        if (!doc) return res.status(404).json({ message: 'Product not found' });

        const product = await enrichProductSeller(doc);
        res.json({ product });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// ─── Admin Store Routes ───────────────────────────────────────────────────────

// POST /api/admin/stores — Register a new store
app.post('/api/admin/stores', async (req, res) => {
    try {
        const store = new Store(req.body);
        const saved = await store.save();
        res.status(201).json({ success: true, store: saved });
    } catch (err) {
        // Friendly duplicate name message
        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: 'A store with this name already exists.' });
        }
        res.status(400).json({ success: false, message: err.message });
    }
});

// GET /api/admin/stores — Get all stores
app.get('/api/admin/stores', async (req, res) => {
    try {
        const stores = await Store.find().sort({ createdAt: -1 });
        res.json({ success: true, stores });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/admin/stores/:id — Get single store by ID
app.get('/api/admin/stores/:id', async (req, res) => {
    try {
        const store = await Store.findById(req.params.id);
        if (!store) return res.status(404).json({ success: false, message: 'Store not found' });
        res.json({ success: true, store });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ─── Admin Product Routes ─────────────────────────────────────────────────────

// POST /api/admin/products — Add a new product
app.post('/api/admin/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        const saved = await product.save();
        res.status(201).json({ success: true, product: saved });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// GET /api/admin/products — Get all products
app.get('/api/admin/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 }).lean();
        res.json({ success: true, products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ─── Shop Route ───────────────────────────────────────────────────────────────
const shopRoutes = require('./routes/shopRoutes');
app.use('/api/shops', shopRoutes);

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 Yoli server running on http://localhost:${PORT}`);
});