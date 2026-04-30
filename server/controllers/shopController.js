const localProducts = require('../data/localProducts');

// GET /api/shops/:slug
const getShop = (req, res) => {
    try {
        const { slug } = req.params;

        const shopProducts = localProducts
            .filter(p => p.seller.slug === slug)
            .sort((a, b) => b.popularity - a.popularity);

        if (shopProducts.length === 0) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        res.json({
            shop: shopProducts[0].seller,
            products: shopProducts,
            productCount: shopProducts.length,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getShop };
