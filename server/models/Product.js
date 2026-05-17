const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        // seller can be:
        //   • a full embedded object { name, slug, logo, ... }  (from AddProductForm)
        //   • a plain string store name  (from old/legacy data)
        //   • an ObjectId string  (if someone saved a store _id)
        // The API routes normalise this before sending to the frontend.
        seller: { type: mongoose.Schema.Types.Mixed, default: null },
        category: {
            type: String,
            required: true,
            enum: ['clothing', 'accessories', 'skincare', 'home', 'jewellery', 'food', 'services'],
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
        discountedPrice: { type: String, default: '0' },
        maxOrder: { type: Number, default: 5, min: 1 },
    },
    { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);
