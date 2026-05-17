const mongoose = require('mongoose');
const Product = require('../models/Product');

async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: 'Invalid product id' });
        }
        const {
            name,
            price,
            description,
            category,
            image,
            images,
            stock,
            popularity,
            badge,
            rating,
            reviews,
            discountedPrice,
            maxOrder,
            seller,
        } = req.body;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        if (name !== undefined && name !== null) {
            product.name = String(name).trim();
        }
        if (description !== undefined && description !== null) {
            product.description = String(description).trim();
        }
        if (price !== undefined && price !== null && price !== '') {
            const n = Number(price);
            if (Number.isNaN(n) || n < 0) {
                return res.status(400).json({ success: false, message: 'Invalid price' });
            }
            product.price = n;
        }
        if (category !== undefined && category !== null) {
            const validCategories = ['clothing', 'accessories', 'skincare', 'home', 'jewellery', 'food', 'services'];
            if (!validCategories.includes(category)) {
                return res.status(400).json({ success: false, message: 'Invalid category' });
            }
            product.category = category;
        }
        if (image !== undefined && image !== null) {
            product.image = String(image).trim();
        }
        if (images !== undefined && images !== null) {
            if (Array.isArray(images)) {
                product.images = images.map(img => String(img).trim());
            } else if (typeof images === 'string') {
                product.images = images.split(',').map(img => img.trim()).filter(Boolean);
            }
        }
        if (stock !== undefined && stock !== null && stock !== '') {
            const n = Number(stock);
            if (Number.isNaN(n) || n < 0) {
                return res.status(400).json({ success: false, message: 'Invalid stock value' });
            }
            product.stock = n;
        }
        if (popularity !== undefined && popularity !== null && popularity !== '') {
            const n = Number(popularity);
            if (Number.isNaN(n) || n < 0) {
                return res.status(400).json({ success: false, message: 'Invalid popularity' });
            }
            product.popularity = n;
        }
        if (badge !== undefined && badge !== null) {
            const validBadges = ['New', 'Bestseller', 'Limited', 'Sale', ''];
            if (!validBadges.includes(badge)) {
                return res.status(400).json({ success: false, message: 'Invalid badge' });
            }
            product.badge = badge;
        }
        if (rating !== undefined && rating !== null && rating !== '') {
            const n = Number(rating);
            if (Number.isNaN(n) || n < 0 || n > 5) {
                return res.status(400).json({ success: false, message: 'Invalid rating (must be 0-5)' });
            }
            product.rating = n;
        }
        if (reviews !== undefined && reviews !== null && reviews !== '') {
            const n = Number(reviews);
            if (Number.isNaN(n) || n < 0) {
                return res.status(400).json({ success: false, message: 'Invalid reviews count' });
            }
            product.reviews = n;
        }
        if (discountedPrice !== undefined && discountedPrice !== null) {
            product.discountedPrice = String(discountedPrice).trim();
        }
        if (maxOrder !== undefined && maxOrder !== null && maxOrder !== '') {
            const n = Number(maxOrder);
            if (Number.isNaN(n) || n < 1) {
                return res.status(400).json({ success: false, message: 'Invalid max order' });
            }
            product.maxOrder = n;
        }
        if (seller !== undefined && seller !== null) {
            product.seller = seller;
        }

        await product.save();
        res.json({ success: true, product });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: 'Invalid product id' });
        }
        const deleted = await Product.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = { updateProduct, deleteProduct };
