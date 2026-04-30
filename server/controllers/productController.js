const localProducts = require('../data/localProducts');

// GET /api/products — with optional ?category, ?sort, ?search, ?limit
const getAllProducts = (req, res) => {
    try {
        const { category, sort, search, limit, featured } = req.query;
        let results = [...localProducts];

        // Category filter
        if (category && category !== 'all') {
            results = results.filter(p => p.category === category);
        }
        
        // Text search (name, description, category)
        if (search) {
            const q = search.toLowerCase();
            results = results.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q)
            );
        }

        // Apply Sorting
        results.sort((a, b) => {
            // Primary sort: Featured status (if requested)
            if (featured === 'true') {
                if (a.isFeatured && !b.isFeatured) return -1;
                if (!a.isFeatured && b.isFeatured) return 1;
            }

            // Secondary sort: User-requested sort
            if (sort === 'price_asc') return a.price - b.price;
            if (sort === 'price_desc') return b.price - a.price;
            if (sort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);

            // Default secondary: Popularity
            return b.popularity - a.popularity;
        });

        // Limit
        if (limit) results = results.slice(0, parseInt(limit));

        res.json({ success: true, count: results.length, products: results });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/products/categories
const getCategories = (req, res) => {
    try {
        const categories = [...new Set(localProducts.map(p => p.category))];
        res.json({ success: true, categories: ['all', ...categories] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/products/:id
const getProductById = (req, res) => {
    try {
        const product = localProducts.find(p => p._id === req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, product });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { getAllProducts, getProductById, getCategories };
