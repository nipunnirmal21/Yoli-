const mongoose = require('mongoose');
const Store = require('../models/Store');

async function updateStore(req, res) {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: 'Invalid store id' });
        }
        const {
            name, slug, logo_url, location, description, catalogLink, whatsapp,
            category, productCategories, banner_url, tagline, rating, totalSales, joined
        } = req.body;
        
        const store = await Store.findById(id);
        if (!store) {
            return res.status(404).json({ success: false, message: 'Store not found' });
        }
        
        if (name !== undefined && name !== null) store.name = String(name).trim();
        if (slug !== undefined && slug !== null) store.slug = String(slug).trim().toLowerCase();
        if (logo_url !== undefined && logo_url !== null) store.logo_url = String(logo_url).trim();
        if (location !== undefined && location !== null) store.location = String(location).trim();
        if (description !== undefined && description !== null) store.description = String(description).trim();
        if (catalogLink !== undefined && catalogLink !== null) store.catalogLink = String(catalogLink).trim();
        if (whatsapp !== undefined && whatsapp !== null) store.whatsapp = String(whatsapp).trim();
        if (category !== undefined && category !== null) store.category = String(category).trim();
        if (productCategories !== undefined && productCategories !== null) {
            store.productCategories = Array.isArray(productCategories) ? productCategories : [];
        }
        if (banner_url !== undefined && banner_url !== null) store.banner_url = String(banner_url).trim();
        if (tagline !== undefined && tagline !== null) store.tagline = String(tagline).trim();
        if (rating !== undefined && rating !== null) store.rating = Number(rating);
        if (totalSales !== undefined && totalSales !== null) store.totalSales = Number(totalSales);
        if (joined !== undefined && joined !== null) store.joined = String(joined).trim();

        await store.save();
        res.json({ success: true, store });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: 'A store with this name or slug already exists.' });
        }
        res.status(400).json({ success: false, message: err.message });
    }
}

async function deleteStore(req, res) {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: 'Invalid store id' });
        }
        const deleted = await Store.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Store not found' });
        }
        res.json({ success: true, message: 'Store deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = { updateStore, deleteStore };
