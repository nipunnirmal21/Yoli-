const Store = require('../models/Store');

function slugifyName(name) {
    if (!name || typeof name !== 'string') return '';
    return name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}

function storeToSellerDTO(store, fallback = {}) {
    if (!store) {
        const name = fallback.name || 'Unknown shop';
        return {
            name,
            slug: fallback.slug || slugifyName(name),
            logo: fallback.logo || '',
            banner: fallback.banner || '',
            description: fallback.description || '',
            location: fallback.location || '',
            rating: fallback.rating ?? 4.5,
            totalSales: fallback.totalSales ?? 0,
            joined: fallback.joined || '2024',
        };
    }
    return {
        name: store.name,
        slug: store.slug || slugifyName(store.name),
        logo: store.logo_url || fallback.logo || '',
        banner: store.banner_url || '',
        description: store.description || '',
        location: store.location || '',
        rating: store.rating ?? 4.5,
        totalSales: store.totalSales ?? 0,
        joined: store.joined || '2024',
    };
}

function findStoreForRawSeller(raw, byName, bySlug) {
    if (typeof raw === 'string') {
        const key = raw.trim().toLowerCase();
        if (!key) return null;
        let s = byName.get(key);
        if (s) return s;
        const guessSlug = slugifyName(raw);
        return bySlug.get(guessSlug) || null;
    }
    if (raw && typeof raw === 'object') {
        if (raw.name) {
            const k = String(raw.name).trim().toLowerCase();
            let s = byName.get(k);
            if (s) return s;
        }
        if (raw.slug) {
            const s = bySlug.get(String(raw.slug).toLowerCase());
            if (s) return s;
        }
    }
    return null;
}

async function loadStoreMaps() {
    const stores = await Store.find().lean();
    const byName = new Map();
    const bySlug = new Map();
    for (const s of stores) {
        if (s.name) byName.set(String(s.name).trim().toLowerCase(), s);
        if (s.slug) bySlug.set(String(s.slug).trim().toLowerCase(), s);
    }
    return { byName, bySlug };
}

function resolveSellerFromMaps(raw, byName, bySlug) {
    const store = findStoreForRawSeller(raw, byName, bySlug);
    const fallback =
        typeof raw === 'object' && raw !== null
            ? raw
            : { name: String(raw || '').trim() || 'Unknown shop' };
    return storeToSellerDTO(store, fallback);
}

async function enrichProductSeller(productPlain) {
    const { byName, bySlug } = await loadStoreMaps();
    const seller = resolveSellerFromMaps(productPlain.seller, byName, bySlug);
    return { ...productPlain, _id: String(productPlain._id), seller };
}

async function enrichProductsSellers(productsPlain) {
    const { byName, bySlug } = await loadStoreMaps();
    return productsPlain.map((p) => ({
        ...p,
        _id: String(p._id),
        seller: resolveSellerFromMaps(p.seller, byName, bySlug),
    }));
}

/** Build Mongo query to find products belonging to a store (by slug). */
function productBelongsToStoreClauses(storeDoc) {
    const slug = storeDoc.slug;
    const name = storeDoc.name;
    const esc = String(name || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const nameInsensitive = esc ? new RegExp(`^${esc}$`, 'i') : null;
    const or = [
        { 'seller.slug': slug },
        { seller: name },
        { 'seller.name': name },
    ];
    if (nameInsensitive) {
        or.push({ seller: nameInsensitive }, { 'seller.name': nameInsensitive });
    }
    return { $or: or };
}

module.exports = {
    slugifyName,
    storeToSellerDTO,
    loadStoreMaps,
    resolveSellerFromMaps,
    enrichProductSeller,
    enrichProductsSellers,
    productBelongsToStoreClauses,
};
