const Product = require('../models/Product');
const Store = require('../models/Store');
const { enrichProductsSellers, productBelongsToStoreClauses } = require('../utils/sellerResolve');

// GET /api/shops/:slug — products from MongoDB for this store
const getShop = async (req, res) => {
    try {
        const slug = String(req.params.slug || '').toLowerCase();
        const store = await Store.findOne({ slug });
        if (!store) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        const q = productBelongsToStoreClauses(store);
        let shopProducts = await Product.find(q).lean().sort({ popularity: -1 });
        shopProducts = await enrichProductsSellers(shopProducts);

        if (shopProducts.length === 0) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        const shopObj = store.toObject();
        res.json({
            shop: { ...shopObj, logo: shopObj.logo_url },
            products: shopProducts,
            productCount: shopProducts.length,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getShop };
