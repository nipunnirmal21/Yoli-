const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        seller: {
            name: { type: String, required: true },
            slug: { type: String, required: true, lowercase: true },
            logo: { type: String, default: '' },
            description: { type: String, default: '' },
            location: { type: String, default: 'Pakistan' },
            rating: { type: Number, default: 4.5 },
            totalSales: { type: Number, default: 0 },
            joined: { type: String, default: '2023' },
        },
        category: {
            type: String,
            required: true,
            enum: ['clothing', 'accessories', 'skincare', 'home', 'jewellery'],
        },
        image: { type: String, required: true },
        images: [{ type: String }],
        stock: { type: Number, default: 10, min: 0 },
        popularity: { type: Number, default: 0 },
        badge: {
            type: String,
            enum: ['New', 'Bestseller', 'Limited', 'Sale', ''],
            default: '',
        },
        rating: { type: Number, default: 4.5, min: 0, max: 5 },
        reviews: { type: Number, default: 0 },
    },
    { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);
