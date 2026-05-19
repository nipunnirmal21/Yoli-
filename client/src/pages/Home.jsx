import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import api from '../services/api';

const STORE_THEMES = [
    { bg: 'from-green-400 to-emerald-600', text: 'text-green-100' },
    { bg: 'from-amber-400 to-orange-500', text: 'text-amber-100' },
    { bg: 'from-indigo-400 to-blue-600', text: 'text-blue-100' },
    { bg: 'from-teal-400 to-cyan-600', text: 'text-teal-100' },
    { bg: 'from-rose-400 to-pink-600', text: 'text-rose-100' },
    { bg: 'from-purple-400 to-violet-600', text: 'text-purple-100' },
];

export default function Home() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [stores, setStores] = useState([]);
    const [loadingStores, setLoadingStores] = useState(true);

    useEffect(() => {
        api.get('/stores')
            .then(r => setStores(r.data.stores || []))
            .catch(e => console.error("Failed to load stores", e))
            .finally(() => setLoadingStores(false));
    }, []);

    return (
        <>
            <Hero selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

            {selectedCategory === 'stores' ? (
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h2 className="section-title text-primary mb-4">Our Featured Stores</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {loadingStores ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="skeleton rounded-2xl min-h-[160px] w-full" />
                            ))
                        ) : stores.length === 0 ? (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                No stores available at the moment.
                            </div>
                        ) : (
                            stores.map((store, index) => {
                                const theme = STORE_THEMES[index % STORE_THEMES.length];
                                const slug = store.slug || store.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                                const bgImg = store.banner_url || store.logo_url || 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=400&q=80';
                                
                                return (
                                    <Link key={store._id} to={`/shop/${slug}`}
                                        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${theme.bg} p-4 flex flex-col justify-end min-h-[160px]`}>
                                        <img src={bgImg} alt={store.name} className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay" />
                                        <p className="relative text-white font-bold text-lg leading-tight mb-0.5">{store.name}</p>
                                        <p className={`relative ${theme.text} text-sm font-medium`}>{store.category} →</p>
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto px-4 py-6">

                    {/* Flash Sale strip */}
                    <div className="flex items-center justify-between mb-4 bg-white rounded-lg px-4 py-3 shadow-card">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">⚡</span>
                            <h2 className="section-title text-primary">
                                {selectedCategory === 'all' ? 'Flash Sale' : `Top ${selectedCategory} Products`}
                            </h2>
                        </div>
                        <Link to={`/products${selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''}`} className="text-xs text-primary font-semibold hover:underline">
                            See All →
                        </Link>
                    </div>

                    <ProductGrid limit={10} featuredOnly categoryOverride={selectedCategory} />

                    {/* Load more CTA */}
                    <div className="text-center mt-8">
                        <Link to={`/products${selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''}`} className="btn-outline px-10 py-3 text-sm">
                            View All Products
                        </Link>
                    </div>

                    {/* Info strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10">
                        {[
                            { emoji: '🚚', title: 'Fast Delivery', desc: 'Express available' },
                            { emoji: '💬', title: 'WhatsApp Orders', desc: 'Easy & secure' },
                            { emoji: '💯', title: 'Quality Assured', desc: 'Authentic products' },
                            { emoji: '🔄', title: 'Easy Returns', desc: 'Hassle-free policy' },
                        ].map(({ emoji, title, desc }) => (
                            <div key={title} className="bg-white rounded-lg shadow-card p-4 flex flex-col items-center text-center gap-1.5">
                                <span className="text-2xl">{emoji}</span>
                                <p className="text-sm font-semibold text-gray-700">{title}</p>
                                <p className="text-xs text-gray-400">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
