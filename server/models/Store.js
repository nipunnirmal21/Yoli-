const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema(
    {
        name:              { type: String, required: true, trim: true },
        slug:              { type: String, unique: true, lowercase: true },
        logo_url:          { type: String, required: true },
        location:          { type: String, required: true, trim: true },
        description:       { type: String, default: '' },
        catalogLink:       { type: String, default: '' },
        whatsapp: {
            type: String,
            required: true,
            match: [/^947\d{8}$/, 'WhatsApp must be in format 947XXXXXXXX'],
        },
        category: {
            type: String,
            required: true,
            enum: ['Food', 'Jewelers', 'Clothing', 'Skincare', 'Accessories'],
        },
        productCategories: [{ type: String }],
        banner_url:        { type: String, default: '' },
        tagline:           { type: String, default: '' },
        rating:            { type: Number, default: 4.8 },
        totalSales:        { type: Number, default: 0 },
        joined:            { type: String, default: '2024' },
    },
    { timestamps: true }
);

// Slug generation hook
storeSchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.slug = this.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
    next();
});

module.exports = mongoose.model('Store', storeSchema);
