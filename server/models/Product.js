const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        // Embedded seller object from admin, or legacy string store name (resolved via Stores collection in API)
        seller: { type: mongoose.Schema.Types.Mixed, required: true },
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
