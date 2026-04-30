const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const Product = require('../models/Product');

// ── SHOPS ───────────────────────────────────────────────────────────────────
const SHOPS = {
    gems: {
        name: 'Ceylon Gems & Jewels',
        slug: 'ceylon-gems',
        logo: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&q=80',
        description: 'Authentic Ceylon gemstones and handcrafted jewellery from the gem capital of the world. Every stone is government-certified.',
        location: 'Colombo, Sri Lanka',
        rating: 4.9,
        totalSales: 2100,
        joined: '2020',
    },
    silk: {
        name: 'Silk Lanka',
        slug: 'silk-lanka',
        logo: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&q=80',
        description: 'Handloom sarees, batik, and traditional Kandyan fashion crafted by artisans from the Hill Country.',
        location: 'Kandy, Sri Lanka',
        rating: 4.7,
        totalSales: 4800,
        joined: '2019',
    },
    crafts: {
        name: 'Lanka Craft House',
        slug: 'lanka-crafts',
        logo: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=200&q=80',
        description: 'Traditional Sri Lankan handicrafts — lacquerwork, cane weaving, masks, and coconut-shell creations from Galle.',
        location: 'Galle, Sri Lanka',
        rating: 4.6,
        totalSales: 1750,
        joined: '2021',
    },
    glow: {
        name: 'Coconut Glow',
        slug: 'coconut-glow',
        logo: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=200&q=80',
        description: 'Natural skincare rooted in Ayurvedic tradition. Made with pure Sri Lankan coconut oil, turmeric, aloe vera and cinnamon.',
        location: 'Colombo, Sri Lanka',
        rating: 4.8,
        totalSales: 9200,
        joined: '2018',
    },
    heritage: {
        name: 'Heritage Home Lanka',
        slug: 'heritage-home',
        logo: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=200&q=80',
        description: 'Artisan home décor inspired by Sri Lankan culture — cinnamon candles, handpainted tiles, handwoven mats and more.',
        location: 'Negombo, Sri Lanka',
        rating: 4.7,
        totalSales: 3300,
        joined: '2021',
    },
};

const products = [
    // ── JEWELLERY — Ceylon Gems ────────────────────────────────────────────────
    {
        name: 'Ceylon Blue Sapphire Pendant', category: 'jewellery', seller: SHOPS.gems,
        description: 'Government-certified natural Ceylon blue sapphire set in 18K white gold. 1.2 carats. Comes with GIA certificate.',
        price: 185000, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80',
        stock: 3, popularity: 98, badge: 'Limited', rating: 5.0, reviews: 87,
    },
    {
        name: 'Gold Lotus Drop Earrings', category: 'jewellery', seller: SHOPS.gems,
        description: 'Handcrafted 22K gold earrings in the shape of the lotus — Sri Lanka\'s national flower.',
        price: 48500, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80',
        stock: 8, popularity: 88, badge: 'Bestseller', rating: 4.9, reviews: 213,
    },
    {
        name: 'Moonstone Sterling Ring', category: 'jewellery', seller: SHOPS.gems,
        description: 'Rainbow moonstone from Meetiyagoda, set in 925 sterling silver. A Sri Lankan treasure.',
        price: 28500, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80',
        stock: 10, popularity: 82, badge: 'New', rating: 4.8, reviews: 145,
    },
    {
        name: 'Star Ruby Bracelet', category: 'jewellery', seller: SHOPS.gems,
        description: 'Natural star ruby cabochons in a yellow gold bracelet. Moonstones alternate between each ruby.',
        price: 95000, image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80',
        stock: 4, popularity: 90, badge: 'Limited', rating: 4.9, reviews: 62,
    },
    {
        name: 'Cat\'s Eye Chrysoberyl Stone', category: 'jewellery', seller: SHOPS.gems,
        description: 'Rare Ceylon cat\'s eye chrysoberyl — 3.5 carats, loose stone with collector\'s certificate.',
        price: 320000, image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&q=80',
        stock: 2, popularity: 75, badge: 'Limited', rating: 5.0, reviews: 23,
    },
    {
        name: 'Amethyst Drop Necklace', category: 'jewellery', seller: SHOPS.gems,
        description: 'Deep purple Ceylon amethyst pendant on a sterling silver chain. 45cm length.',
        price: 22000, image: 'https://images.unsplash.com/photo-1619119069152-a2b331eb392a?w=600&q=80',
        stock: 12, popularity: 70, badge: '', rating: 4.6, reviews: 189,
    },

    // ── CLOTHING — Silk Lanka ─────────────────────────────────────────────────
    {
        name: 'Handwoven Batik Sarong', category: 'clothing', seller: SHOPS.silk,
        description: 'Traditional hand-drawn batik cotton sarong. Each piece is unique. Available in blue, red and green patterns.',
        price: 3200, image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80',
        stock: 25, popularity: 94, badge: 'Bestseller', rating: 4.8, reviews: 876,
    },
    {
        name: 'Kandyan Handloom Saree', category: 'clothing', seller: SHOPS.silk,
        description: 'Authentic Kandyan handloom saree woven on traditional pit looms by master weavers in Kandy.',
        price: 18500, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80',
        stock: 14, popularity: 88, badge: 'Bestseller', rating: 4.9, reviews: 412,
    },
    {
        name: 'Cotton Embroidered Kurta', category: 'clothing', seller: SHOPS.silk,
        description: 'Lightweight cotton kurta with traditional Sri Lankan floral embroidery. Comfortable and elegant.',
        price: 7500, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80',
        stock: 20, popularity: 78, badge: 'New', rating: 4.7, reviews: 234,
    },
    {
        name: 'Traditional Osariya Set', category: 'clothing', seller: SHOPS.silk,
        description: 'Complete osariya saree set with matching jacket and underskirt in Dumbara woven fabric.',
        price: 25000, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80',
        stock: 8, popularity: 84, badge: 'Limited', rating: 4.8, reviews: 176,
    },
    {
        name: 'Batik Print Summer Dress', category: 'clothing', seller: SHOPS.silk,
        description: 'Lightweight batik summer dress with classic elephant and lotus print. Perfect for Colombo weather.',
        price: 8500, image: 'https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=600&q=80',
        stock: 18, popularity: 72, badge: '', rating: 4.5, reviews: 321,
    },
    {
        name: 'Linen Bana Collar Shirt', category: 'clothing', seller: SHOPS.silk,
        description: 'Traditional Sri Lankan linen shirt with a Bana collar. Ideal for office or formal occasions.',
        price: 5200, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80',
        stock: 22, popularity: 65, badge: '', rating: 4.4, reviews: 143,
    },

    // ── ACCESSORIES — Lanka Crafts ────────────────────────────────────────────
    {
        name: 'Handwoven Cane Tote Bag', category: 'accessories', seller: SHOPS.crafts,
        description: 'Handwoven cane and rattan tote with cotton lining. Lightweight and eco-friendly.',
        price: 6500, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
        stock: 16, popularity: 85, badge: 'Bestseller', rating: 4.7, reviews: 398,
    },
    {
        name: 'Lacquerwork Jewellery Box', category: 'accessories', seller: SHOPS.crafts,
        description: 'Hand-lacquered wooden jewellery box with traditional Sri Lankan patterns. Hinged lid, 3 compartments.',
        price: 8200, image: 'https://images.unsplash.com/photo-1553531889-e6cf4d692b1b?w=600&q=80',
        stock: 10, popularity: 78, badge: 'New', rating: 4.8, reviews: 167,
    },
    {
        name: 'Traditional Devil Mask', category: 'accessories', seller: SHOPS.crafts,
        description: 'Hand-carved and painted Raksha mask from Ambalangoda. Authentic collector\'s item, 30cm height.',
        price: 9800, image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80',
        stock: 7, popularity: 70, badge: '', rating: 4.6, reviews: 89,
    },
    {
        name: 'Coconut Shell Earrings', category: 'accessories', seller: SHOPS.crafts,
        description: 'Lightweight earrings hand-carved from coconut shell, polished to a natural sheen.',
        price: 1200, image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&q=80',
        stock: 40, popularity: 90, badge: 'Bestseller', rating: 4.9, reviews: 1240,
    },
    {
        name: 'Pandanus Leaf Clutch Bag', category: 'accessories', seller: SHOPS.crafts,
        description: 'Handwoven pandanus (hana) leaf clutch bag from the Southern Province. Traditional craft technique.',
        price: 3800, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80',
        stock: 14, popularity: 73, badge: '', rating: 4.5, reviews: 210,
    },
    {
        name: 'Elephant Hair Bracelet', category: 'accessories', seller: SHOPS.crafts,
        description: 'Genuine imitation elephant hair bangle in brass — a traditional Sri Lankan good-luck charm.',
        price: 2400, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80',
        stock: 30, popularity: 80, badge: '', rating: 4.5, reviews: 334,
    },

    // ── SKINCARE — Coconut Glow ───────────────────────────────────────────────
    {
        name: 'Pure Virgin Coconut Oil', category: 'skincare', seller: SHOPS.glow,
        description: 'Cold-pressed extra virgin coconut oil from the Kurunegala district. For hair, skin and cooking. 500ml.',
        price: 1800, image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&q=80',
        stock: 60, popularity: 98, badge: 'Bestseller', rating: 4.9, reviews: 3420,
    },
    {
        name: 'Turmeric & Papaya Face Pack', category: 'skincare', seller: SHOPS.glow,
        description: 'Ayurvedic face pack with Sri Lankan turmeric (Curcuma longa) and raw papaya extract. Brightens and evens skin tone.',
        price: 2400, image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80',
        stock: 45, popularity: 92, badge: 'Bestseller', rating: 4.8, reviews: 2150,
    },
    {
        name: 'Ceylon Cinnamon Face Serum', category: 'skincare', seller: SHOPS.glow,
        description: 'Lightweight serum with true Ceylon cinnamon (Cinnamomum verum) extract and hyaluronic acid. Fights acne and aging.',
        price: 3200, image: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=600&q=80',
        stock: 35, popularity: 88, badge: 'New', rating: 4.8, reviews: 876,
    },
    {
        name: 'Fresh Aloe Vera Gel', category: 'skincare', seller: SHOPS.glow,
        description: 'Pure aloe vera gel from organically grown Sri Lankan aloe. Soothes sunburn and moisturises deeply. 200g.',
        price: 1500, image: 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&q=80',
        stock: 80, popularity: 95, badge: 'Bestseller', rating: 4.9, reviews: 4200,
    },
    {
        name: 'Sandalwood Night Cream', category: 'skincare', seller: SHOPS.glow,
        description: 'Rich night cream with Sri Lankan sandalwood essential oil and shea butter. Repairs skin overnight.',
        price: 2800, image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80',
        stock: 28, popularity: 82, badge: '', rating: 4.7, reviews: 654,
    },
    {
        name: 'Neem & Clay Purifying Mask', category: 'skincare', seller: SHOPS.glow,
        description: 'Deep-cleansing clay mask with Ceylon neem and kaolin clay. Unclogs pores in 15 minutes.',
        price: 2200, image: 'https://images.unsplash.com/photo-1601452574985-5b226a445af0?w=600&q=80',
        stock: 42, popularity: 78, badge: '', rating: 4.6, reviews: 987,
    },

    // ── HOME DÉCOR — Heritage Home ────────────────────────────────────────────
    {
        name: 'Ceylon Cinnamon Scented Candle', category: 'home', seller: SHOPS.heritage,
        description: 'Hand-poured soy wax candle infused with true Ceylon cinnamon essential oil. 60-hour burn time.',
        price: 3500, image: 'https://images.unsplash.com/photo-1603905700235-cc13ee5b6f7b?w=600&q=80',
        stock: 50, popularity: 97, badge: 'Bestseller', rating: 4.9, reviews: 2100,
    },
    {
        name: 'Hand-Painted Tile Coasters', category: 'home', seller: SHOPS.heritage,
        description: 'Set of 4 handpainted ceramic coasters with traditional kolam and lotus motifs. Cork-backed.',
        price: 2800, image: 'https://images.unsplash.com/photo-1556909114-9d5f1ad1a8c9?w=600&q=80',
        stock: 30, popularity: 86, badge: 'Bestseller', rating: 4.8, reviews: 543,
    },
    {
        name: 'Rattan Wall Hanging Basket', category: 'home', seller: SHOPS.heritage,
        description: 'Handwoven rattan wall basket — a statement piece for any wall. 45cm diameter.',
        price: 5200, image: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=600&q=80',
        stock: 14, popularity: 74, badge: 'New', rating: 4.6, reviews: 212,
    },
    {
        name: 'Ceylon Tea Storage Tin', category: 'home', seller: SHOPS.heritage,
        description: 'Vintage-style tin canister with hand-illustrated Ceylon tea garden artwork. Airtight lid. Holds 250g tea.',
        price: 1800, image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&q=80',
        stock: 60, popularity: 82, badge: '', rating: 4.7, reviews: 890,
    },
    {
        name: 'Lemongrass Reed Diffuser', category: 'home', seller: SHOPS.heritage,
        description: 'Sri Lankan lemongrass essential oil reed diffuser. 100ml, lasts 3 months. Naturally refreshing.',
        price: 4500, image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=600&q=80',
        stock: 25, popularity: 79, badge: '', rating: 4.7, reviews: 434,
    },
    {
        name: 'Handwoven Seagrass Floor Mat', category: 'home', seller: SHOPS.heritage,
        description: 'Eco-friendly seagrass floor mat woven by craftswomen in the Puttalam region. 60x90cm.',
        price: 7200, image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&q=80',
        stock: 12, popularity: 70, badge: '', rating: 4.5, reviews: 178,
    },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected');
        await Product.deleteMany({});
        console.log('🗑️  Cleared existing products');
        await Product.insertMany(products);
        console.log(`🇱🇰 Seeded ${products.length} Sri Lankan products successfully!`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed error:', err.message);
        process.exit(1);
    }
}

seed();
