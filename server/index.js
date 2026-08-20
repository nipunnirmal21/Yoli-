require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// NOTE: All product data now comes exclusively from MongoDB.

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ─── MongoDB Atlas Connection ─────────────────────────────────────────────────
const MONGO_URI =
    'mongodb+srv://nipun:Nipun123@cluster0.ygbf9pf.mongodb.net/Yoli?retryWrites=true&w=majority';

mongoose
    .connect(MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        retryReads: true,
    })
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch((err) => console.error('❌ MongoDB connection error:', err.message));

// Log connection state changes for debugging
mongoose.connection.on('disconnected', () => console.warn('⚠️  MongoDB disconnected'));
mongoose.connection.on('reconnected',  () => console.log('🔄 MongoDB reconnected'));

// ─── Models ───────────────────────────────────────────────────────────────────
const Store   = require('./models/Store');
const Product = require('./models/Product');

// ─── Public Product List ──────────────────────────────────────────────────────
// Returns ALL products from MongoDB with seller info resolved.
app.get('/api/products', async (req, res) => {
    try {
        // 1. Fetch products from MongoDB
        let dbProducts = [];
        try {
            dbProducts = await Product.find().lean().sort({ createdAt: -1 });
            console.log(`📦 Fetched ${dbProducts.length} products from MongoDB`);
        } catch (dbErr) {
            console.error('❌ Product.find() error:', dbErr.message);
        }

        // 2. Stringify _id
        let normalized = dbProducts.map((p) => ({ ...p, _id: String(p._id) }));

        // 3. Batch-resolve any sellers that are not proper embedded objects
        //    (e.g. saved as a plain string name or an ObjectId string)
        const needsResolution = normalized.some((p) => {
            const s = p.seller;
            return !(s && typeof s === 'object' && s.name && s.slug);
        });

        if (needsResolution) {
            let allStores = [];
            try {
                allStores = await Store.find().lean();
            } catch (_) {}

            // Build lookup maps once
            const byId   = {};
            const byName = {};
            allStores.forEach((st) => {
                byId[String(st._id)]          = st;
                byName[st.name.toLowerCase()]  = st;
            });

            const toSeller = (st) => ({
                name:     st.name,
                slug:     st.slug || st.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                logo:     st.logo_url || st.logo || '',
                rating:   st.rating   || 4.5,
                location: st.location || '',
            });

            normalized = normalized.map((p) => {
                const s = p.seller;
                const isProper = s && typeof s === 'object' && s.name && s.slug;
                if (isProper) return p;

                const selStr = s ? String(s) : '';
                const store  =
                    /^[a-f\d]{24}$/i.test(selStr) ? byId[selStr] :
                    selStr ? byName[selStr.toLowerCase()] : null;

                const seller = store
                    ? toSeller(store)
                    : selStr
                        ? { name: selStr, slug: selStr.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''), logo: '', rating: null, location: '' }
                        : null;

                return { ...p, seller };
            });
        }

        // 4. Return DB products only — no mock/hardcoded data
        res.json({ products: normalized });
    } catch (err) {
        console.error('❌ /api/products error:', err.message);
        res.status(500).json({ message: err.message });
    }
});


// GET /api/products/:id — fetch single product from MongoDB
app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Try MongoDB (only if id looks like a valid ObjectId)
        let product = null;
        try {
            if (/^[a-f\d]{24}$/i.test(id)) {
                const doc = await Product.findById(id).lean();
                if (doc) {
                    product = { ...doc, _id: String(doc._id) };

                    // ── Resolve seller ──────────────────────────────────────────
                    // seller may be: a proper embedded object, a plain string name,
                    // or an ObjectId string (saved by the old admin form).
                    const sel = product.seller;
                    const isProper = sel && typeof sel === 'object' && sel.name && sel.slug;

                    if (!isProper && sel) {
                        const selStr = String(sel);
                        let store = null;
                        try {
                            if (/^[a-f\d]{24}$/i.test(selStr)) {
                                store = await Store.findById(selStr).lean();
                            }
                            if (!store) {
                                const escaped = selStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                                store = await Store.findOne({
                                    name: { $regex: new RegExp('^' + escaped + '$', 'i') },
                                }).lean();
                            }
                        } catch (_) { /* ignore */ }

                        // Build a normalised seller object the frontend can use
                        product.seller = store
                            ? {
                                name:     store.name,
                                slug:     store.slug || store.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                                logo:     store.logo_url || store.logo || '',
                                rating:   store.rating   || 4.5,
                                location: store.location || '',
                              }
                            : {
                                name:     selStr,
                                slug:     selStr.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                                logo:     '',
                                rating:   null,
                                location: '',
                              };
                    }
                }
            }
        } catch (_) { /* ignore — fall through */ }

        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ product });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// GET /api/stores — fetch all stores from MongoDB
app.get('/api/stores', async (req, res) => {
    try {
        const stores = await Store.find().lean().sort({ createdAt: -1 });
        res.json({ stores });
    } catch (err) {
        console.error('❌ /api/stores error:', err.message);
        res.status(500).json({ message: err.message });
    }
});

const authMiddleware = require('./middleware/authMiddleware');

// ─── Admin Auth Route ─────────────────────────────────────────────────────────
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '8h' });
        return res.json({ success: true, token });
    }
    
    return res.status(401).json({ success: false, message: 'Invalid username or password' });
});

// ─── Admin Store Routes ───────────────────────────────────────────────────────

// POST /api/admin/stores — Register a new store
app.post('/api/admin/stores', authMiddleware, async (req, res) => {
    try {
        const store = new Store(req.body);
        const saved = await store.save();
        res.status(201).json({ success: true, store: saved });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: 'A store with this name already exists.' });
        }
        res.status(400).json({ success: false, message: err.message });
    }
});

// GET /api/admin/stores — Get all stores
app.get('/api/admin/stores', authMiddleware, async (req, res) => {
    try {
        const stores = await Store.find().sort({ createdAt: -1 });
        res.json({ success: true, stores });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/admin/stores/:id — Get single store by ID
app.get('/api/admin/stores/:id', authMiddleware, async (req, res) => {
    try {
        const store = await Store.findById(req.params.id);
        if (!store) return res.status(404).json({ success: false, message: 'Store not found' });
        res.json({ success: true, store });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

const { updateStore, deleteStore } = require('./controllers/adminStoreController');
app.patch('/api/admin/stores/:id', authMiddleware, updateStore);
app.delete('/api/admin/stores/:id', authMiddleware, deleteStore);

// ─── Admin Product Routes ─────────────────────────────────────────────────────

// POST /api/admin/products — Add a new product
app.post('/api/admin/products', authMiddleware, async (req, res) => {
    try {
        const product = new Product(req.body);
        const saved = await product.save();
        res.status(201).json({ success: true, product: saved });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// GET /api/admin/products — Get all products
app.get('/api/admin/products', authMiddleware, async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json({ success: true, products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

const { updateProduct, deleteProduct } = require('./controllers/adminProductController');
app.patch('/api/admin/products/:id', authMiddleware, updateProduct);
app.delete('/api/admin/products/:id', authMiddleware, deleteProduct);

// ─── Shop Route ───────────────────────────────────────────────────────────────
const shopRoutes = require('./routes/shopRoutes');
app.use('/api/shops', shopRoutes);

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 Yoli server running on http://localhost:${PORT}`);
});