require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// ─────────────────────────────────────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// CORS Configuration
// ─────────────────────────────────────────────────────────────────────────────

const allowedOrigins = new Set([
    'https://yoli.lk',
    'https://www.yoli.lk',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]);

const corsOptions = {
    origin(origin, callback) {

        // Allow requests without an Origin header
        // Example: direct API requests / server-to-server requests
        if (!origin) {
            return callback(null, true);
        }

        // Allow trusted Yoli frontend origins
        if (allowedOrigins.has(origin)) {
            return callback(null, true);
        }

        console.warn(`🚫 Blocked CORS origin: ${origin}`);

        return callback(
            new Error('Not allowed by CORS')
        );
    },

    methods: [
        'GET',
        'POST',
        'PUT',
        'PATCH',
        'DELETE',
        'OPTIONS',
    ],

    allowedHeaders: [
        'Content-Type',
        'Authorization',
    ],

    optionsSuccessStatus: 204,
};

// Apply CORS before all API routes
app.use(cors(corsOptions));

// Parse JSON request bodies
app.use(express.json());

// ─────────────────────────────────────────────────────────────────────────────
// MongoDB Atlas Connection
// ─────────────────────────────────────────────────────────────────────────────

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('❌ MONGO_URI is missing from environment variables');
    process.exit(1);
}

mongoose
    .connect(MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        retryReads: true,
    })
    .then(() => {
        console.log('✅ Connected to MongoDB Atlas');
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
    });

// Log connection state changes for debugging
mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
    console.log('🔄 MongoDB reconnected');
});

// ─────────────────────────────────────────────────────────────────────────────
// Models
// ─────────────────────────────────────────────────────────────────────────────

const Store = require('./models/Store');
const Product = require('./models/Product');

// ─────────────────────────────────────────────────────────────────────────────
// Public Product List
// ─────────────────────────────────────────────────────────────────────────────
//
// GET /api/products
//
// Optional query:
// ?search=necklace
//
// Products still come exclusively from MongoDB.
// Search only filters the returned array.
// It DOES NOT edit/delete/update MongoDB records.
//
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/products', async (req, res) => {
    try {
        const search = String(req.query.search || '').trim();

        // 1. Fetch products from MongoDB
        //
        // Newest products remain first because createdAt is descending.
        let dbProducts = [];

        try {
            dbProducts = await Product.find()
                .lean()
                .sort({ createdAt: -1 });

            console.log(
                `📦 Fetched ${dbProducts.length} products from MongoDB`
            );
        } catch (dbErr) {
            console.error(
                '❌ Product.find() error:',
                dbErr.message
            );
        }

        // 2. Convert MongoDB _id values to strings
        let normalized = dbProducts.map((product) => ({
            ...product,
            _id: String(product._id),
        }));

        // 3. Batch-resolve sellers that are not already
        // proper embedded seller objects.
        //
        // Supports legacy seller data such as:
        // - Store name string
        // - Mongo ObjectId string
        // - Embedded seller object

        const needsResolution = normalized.some((product) => {
            const seller = product.seller;

            return !(
                seller &&
                typeof seller === 'object' &&
                seller.name &&
                seller.slug
            );
        });

        if (needsResolution) {
            let allStores = [];

            try {
                allStores = await Store.find().lean();
            } catch (_) {
                allStores = [];
            }

            // Build lookup maps once
            const byId = {};
            const byName = {};

            allStores.forEach((store) => {
                byId[String(store._id)] = store;

                if (store.name) {
                    byName[String(store.name).toLowerCase()] = store;
                }
            });

            const toSeller = (store) => ({
                name: store.name,

                slug:
                    store.slug ||
                    store.name
                        .toLowerCase()
                        .replace(/ /g, '-')
                        .replace(/[^\w-]+/g, ''),

                logo:
                    store.logo_url ||
                    store.logo ||
                    '',

                rating:
                    store.rating ||
                    4.5,

                location:
                    store.location ||
                    '',
            });

            normalized = normalized.map((product) => {
                const seller = product.seller;

                const isProperSeller =
                    seller &&
                    typeof seller === 'object' &&
                    seller.name &&
                    seller.slug;

                // Seller is already normalized
                if (isProperSeller) {
                    return product;
                }

                const sellerString = seller
                    ? String(seller)
                    : '';

                let store = null;

                if (/^[a-f\d]{24}$/i.test(sellerString)) {
                    store = byId[sellerString] || null;
                } else if (sellerString) {
                    store =
                        byName[sellerString.toLowerCase()] ||
                        null;
                }

                let resolvedSeller = null;

                if (store) {
                    resolvedSeller = toSeller(store);
                } else if (sellerString) {
                    resolvedSeller = {
                        name: sellerString,

                        slug: sellerString
                            .toLowerCase()
                            .replace(/ /g, '-')
                            .replace(/[^\w-]+/g, ''),

                        logo: '',
                        rating: null,
                        location: '',
                    };
                }

                return {
                    ...product,
                    seller: resolvedSeller,
                };
            });
        }

        // ─────────────────────────────────────────────────────────────────────
        // 4. PRODUCT SEARCH
        // ─────────────────────────────────────────────────────────────────────
        //
        // IMPORTANT:
        //
        // This ONLY filters the response in memory.
        //
        // It does NOT:
        // - modify MongoDB
        // - update products
        // - delete products
        // - change product IDs
        // - change product ordering
        // - change createdAt
        //
        // Example:
        // GET /api/products?search=necklace
        //
        // Search fields:
        // - Product name
        // - Description
        // - Category
        // - Seller name
        // - Seller slug
        //
        // ─────────────────────────────────────────────────────────────────────

        if (search) {
            const query = search.toLowerCase();

            normalized = normalized.filter((product) => {
                let sellerName = '';
                let sellerSlug = '';

                if (
                    product.seller &&
                    typeof product.seller === 'object'
                ) {
                    sellerName =
                        product.seller.name ||
                        '';

                    sellerSlug =
                        product.seller.slug ||
                        '';
                } else if (product.seller) {
                    sellerName =
                        String(product.seller);
                }

                const searchableValues = [
                    product.name,
                    product.description,
                    product.category,
                    sellerName,
                    sellerSlug,
                ];

                return searchableValues.some((value) =>
                    String(value || '')
                        .toLowerCase()
                        .includes(query)
                );
            });

            console.log(
                `🔎 Search "${search}" returned ${normalized.length} product(s)`
            );
        }

        // 5. Return products
        res.json({
            products: normalized,
        });
    } catch (err) {
        console.error(
            '❌ /api/products error:',
            err.message
        );

        res.status(500).json({
            message: err.message,
        });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// Single Product
// ─────────────────────────────────────────────────────────────────────────────
//
// GET /api/products/:id
//
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;

        let product = null;

        try {
            // Only query MongoDB if ID looks like a MongoDB ObjectId
            if (/^[a-f\d]{24}$/i.test(id)) {
                const doc = await Product.findById(id).lean();

                if (doc) {
                    product = {
                        ...doc,
                        _id: String(doc._id),
                    };

                    // ─────────────────────────────────────────────────────────
                    // Resolve seller
                    // ─────────────────────────────────────────────────────────
                    //
                    // seller may be:
                    //
                    // - proper embedded seller object
                    // - plain store-name string
                    // - ObjectId string
                    //
                    // ─────────────────────────────────────────────────────────

                    const seller = product.seller;

                    const isProperSeller =
                        seller &&
                        typeof seller === 'object' &&
                        seller.name &&
                        seller.slug;

                    if (!isProperSeller && seller) {
                        const sellerString = String(seller);

                        let store = null;

                        try {
                            // Try seller as Store ObjectId
                            if (
                                /^[a-f\d]{24}$/i.test(
                                    sellerString
                                )
                            ) {
                                store =
                                    await Store.findById(
                                        sellerString
                                    ).lean();
                            }

                            // If not found by ID,
                            // try matching Store name
                            if (!store) {
                                const escaped =
                                    sellerString.replace(
                                        /[.*+?^${}()|[\]\\]/g,
                                        '\\$&'
                                    );

                                store =
                                    await Store.findOne({
                                        name: {
                                            $regex:
                                                new RegExp(
                                                    '^' +
                                                    escaped +
                                                    '$',
                                                    'i'
                                                ),
                                        },
                                    }).lean();
                            }
                        } catch (_) {
                            // Ignore seller resolution errors
                        }

                        if (store) {
                            product.seller = {
                                name:
                                    store.name,

                                slug:
                                    store.slug ||
                                    store.name
                                        .toLowerCase()
                                        .replace(/ /g, '-')
                                        .replace(/[^\w-]+/g, ''),

                                logo:
                                    store.logo_url ||
                                    store.logo ||
                                    '',

                                rating:
                                    store.rating ||
                                    4.5,

                                location:
                                    store.location ||
                                    '',
                            };
                        } else {
                            product.seller = {
                                name:
                                    sellerString,

                                slug:
                                    sellerString
                                        .toLowerCase()
                                        .replace(/ /g, '-')
                                        .replace(/[^\w-]+/g, ''),

                                logo: '',
                                rating: null,
                                location: '',
                            };
                        }
                    }
                }
            }
        } catch (_) {
            // Ignore and fall through to 404
        }

        if (!product) {
            return res.status(404).json({
                message: 'Product not found',
            });
        }

        res.json({
            product,
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// Public Stores
// ─────────────────────────────────────────────────────────────────────────────
//
// GET /api/stores
//
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/stores', async (req, res) => {
    try {
        const stores = await Store.find()
            .lean()
            .sort({ createdAt: -1 });

        res.json({
            stores,
        });
    } catch (err) {
        console.error(
            '❌ /api/stores error:',
            err.message
        );

        res.status(500).json({
            message: err.message,
        });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// Admin Authentication Middleware
// ─────────────────────────────────────────────────────────────────────────────

const authMiddleware = require('./middleware/authMiddleware');

// ─────────────────────────────────────────────────────────────────────────────
// Admin Login
// ─────────────────────────────────────────────────────────────────────────────
//
// POST /api/admin/login
//
// ─────────────────────────────────────────────────────────────────────────────

app.post('/api/admin/login', (req, res) => {
    const {
        username,
        password,
    } = req.body;

    if (
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
    ) {
        const token = jwt.sign(
            {
                username,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '8h',
            }
        );

        return res.json({
            success: true,
            token,
        });
    }

    return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Admin Store Routes
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/admin/stores
// Register new store

app.post(
    '/api/admin/stores',
    authMiddleware,
    async (req, res) => {
        try {
            const store = new Store(req.body);

            const saved = await store.save();

            res.status(201).json({
                success: true,
                store: saved,
            });
        } catch (err) {
            if (err.code === 11000) {
                return res.status(400).json({
                    success: false,
                    message:
                        'A store with this name already exists.',
                });
            }

            res.status(400).json({
                success: false,
                message: err.message,
            });
        }
    }
);

// GET /api/admin/stores
// Get all stores

app.get(
    '/api/admin/stores',
    authMiddleware,
    async (req, res) => {
        try {
            const stores = await Store.find()
                .sort({ createdAt: -1 });

            res.json({
                success: true,
                stores,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    }
);

// GET /api/admin/stores/:id
// Get one store

app.get(
    '/api/admin/stores/:id',
    authMiddleware,
    async (req, res) => {
        try {
            const store =
                await Store.findById(
                    req.params.id
                );

            if (!store) {
                return res.status(404).json({
                    success: false,
                    message: 'Store not found',
                });
            }

            res.json({
                success: true,
                store,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    }
);

const {
    updateStore,
    deleteStore,
} = require('./controllers/adminStoreController');

// PATCH /api/admin/stores/:id

app.patch(
    '/api/admin/stores/:id',
    authMiddleware,
    updateStore
);

// DELETE /api/admin/stores/:id

app.delete(
    '/api/admin/stores/:id',
    authMiddleware,
    deleteStore
);

// ─────────────────────────────────────────────────────────────────────────────
// Admin Product Routes
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/admin/products
// Add new product

app.post(
    '/api/admin/products',
    authMiddleware,
    async (req, res) => {
        try {
            const product =
                new Product(req.body);

            const saved =
                await product.save();

            res.status(201).json({
                success: true,
                product: saved,
            });
        } catch (err) {
            res.status(400).json({
                success: false,
                message: err.message,
            });
        }
    }
);

// GET /api/admin/products
// Get all products

app.get(
    '/api/admin/products',
    authMiddleware,
    async (req, res) => {
        try {
            const products =
                await Product.find()
                    .sort({
                        createdAt: -1,
                    });

            res.json({
                success: true,
                products,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    }
);

const {
    updateProduct,
    deleteProduct,
} = require('./controllers/adminProductController');

// PATCH /api/admin/products/:id

app.patch(
    '/api/admin/products/:id',
    authMiddleware,
    updateProduct
);

// DELETE /api/admin/products/:id

app.delete(
    '/api/admin/products/:id',
    authMiddleware,
    deleteProduct
);

// ─────────────────────────────────────────────────────────────────────────────
// Shop Routes
// ─────────────────────────────────────────────────────────────────────────────

const shopRoutes =
    require('./routes/shopRoutes');

app.use(
    '/api/shops',
    shopRoutes
);

// ─────────────────────────────────────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
    console.log(
        `🚀 Yoli server running on http://localhost:${PORT}`
    );
});