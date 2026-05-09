const Product = require('../models/Product');
const { enrichProductsSellers } = require('../utils/sellerResolve');

// GET /api/products — with optional ?category, ?sort, ?search, ?limit (if mounted on router)
const getAllProducts = async (req, res) => {
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

        res.json({ success: true, count: results.length, products: results });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        res.json({ success: true, categories: ['all', ...categories.filter(Boolean)] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const { enrichProductSeller } = require('../utils/sellerResolve');
        const id = req.params.id;
        if (!/^[a-f\d]{24}$/i.test(id)) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        const doc = await Product.findById(id).lean();
        if (!doc) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        const product = await enrichProductSeller(doc);
        res.json({ success: true, product });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { getAllProducts, getProductById, getCategories };
