import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';

export default function Home() {
    return (
        <>
            <Hero />

            {/* Featured products */}
            <div className="max-w-7xl mx-auto px-4 py-6">

                {/* Flash Sale strip */}
                <div className="flex items-center justify-between mb-4 bg-white rounded-lg px-4 py-3 shadow-card">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">⚡</span>
                        <h2 className="section-title text-primary">Flash Sale</h2>
                    </div>
                    <Link to="/products" className="text-xs text-primary font-semibold hover:underline">
                        See All →
                    </Link>
                </div>

                <ProductGrid limit={10} featuredOnly />

                {/* Load more CTA */}
                <div className="text-center mt-8">
                    <Link to="/products" className="btn-outline px-10 py-3 text-sm">
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
        </>
    );
}
