import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchShop } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function ShopPage() {
    const { slug } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true); setError(null);
        fetchShop(slug).then(setData).catch(() => setError('Shop not found.')).finally(() => setLoading(false));
    }, [slug]);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="skeleton h-48 rounded-2xl mb-6" />
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="skeleton aspect-square rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 px-4">
                <span className="text-5xl">🏪</span>
                <p className="text-gray-600 font-medium">{error || 'Shop not found'}</p>
                <Link to="/products" className="btn-primary text-sm px-6 py-2">← Browse Products</Link>
            </div>
        );
    }

    const { shop, products, productCount } = data;

    const fmt = (n) => n?.toLocaleString('en-LK');

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Shop Hero */}
            <div className="relative overflow-hidden rounded-2xl bg-violet-gradient p-8 mb-8">
                {/* Decorative */}
                <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
                <div className="absolute -bottom-8 right-24 w-40 h-40 rounded-full bg-amber/10 pointer-events-none" />

                <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    {/* Logo */}
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/20 border-4 border-white/30 flex-shrink-0">
                        {shop.logo
                            ? <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-4xl">🏪</div>
                        }
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h1 className="font-display text-white text-2xl sm:text-3xl font-bold">{shop.name}</h1>
                            <span className="bg-amber text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                                ⭐ {shop.rating}
                            </span>
                        </div>
                        <p className="text-purple-200 text-sm mb-4 max-w-xl">{shop.description}</p>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-6">
                            {[
                                { label: 'Products', value: productCount },
                                { label: 'Total Sales', value: `${fmt(shop.totalSales)}+` },
                                { label: 'Location', value: shop.location },
                                { label: 'Member since', value: shop.joined },
                            ].map(({ label, value }) => (
                                <div key={label}>
                                    <p className="text-white font-bold text-base">{value}</p>
                                    <p className="text-purple-300 text-xs">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Products from this shop */}
            <div className="flex items-center gap-2 mb-5">
                <h2 className="section-eyebrow">From {shop.name}</h2>
                <span className="text-gray-400 text-xs">({productCount} items)</span>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-16 card">
                    <p className="text-gray-500">No products found for this shop.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {products.map((p) => <ProductCard key={p._id} product={p} />)}
                </div>
            )}
        </div>
    );
}
