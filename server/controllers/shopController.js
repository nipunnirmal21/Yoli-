const Store   = require('../models/Store');
const Product = require('../models/Product');

// GET /api/shops/:slug
const getShop = async (req, res) => {
    try {
        const { slug } = req.params;

        // 1. Find the store in MongoDB by slug
        const store = await Store.findOne({ slug }).lean();
        if (!store) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        // 2. Build the shop object the frontend expects
        const shop = {
            name:        store.name,
            slug:        store.slug,
            logo:        store.logo_url || '',
            logo_url:    store.logo_url || '',
            description: store.description || '',
            location:    store.location || '',
            rating:      store.rating   || 4.8,
            totalSales:  store.totalSales || 0,
            joined:      store.joined   || '2024',
            banner_url:  store.banner_url || '',
            tagline:     store.tagline  || '',
        };

        // 3. Find products that belong to this store.
        //    Products may store seller as:
        //      a) an embedded object with seller.name matching store name
        //      b) an embedded object with seller.slug matching store slug
        const products = await Product.find({
            $or: [
                { 'seller.slug': slug },
                { 'seller.name': { $regex: new RegExp('^' + store.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') } },
            ],
        }).lean().sort({ createdAt: -1 });

        // Normalize _id to string for React
        const normalized = products.map((p) => ({ ...p, _id: String(p._id) }));

        res.json({
            shop,
            products: normalized,
            productCount: normalized.length,
        });
    } catch (err) {
        console.error('❌ getShop error:', err.message);
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getShop };
