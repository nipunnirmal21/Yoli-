import { Link } from 'react-router-dom';

const CATS = [
    { label: 'Jewellery', slug: 'jewellery', emoji: '💎', color: 'from-yellow-400/20 to-yellow-50' },
    { label: 'Clothing', slug: 'clothing', emoji: '👗', color: 'from-rose-400/20 to-rose-50' },
    { label: 'Accessories', slug: 'accessories', emoji: '🧺', color: 'from-purple-400/20 to-purple-50' },
    { label: 'Skincare', slug: 'skincare', emoji: '🥥', color: 'from-green-400/20 to-green-50' },
    { label: 'Home Décor', slug: 'home', emoji: '🕯️', color: 'from-orange-400/20 to-orange-50' },
];

export default function Hero() {
    return (
        <div className="max-w-7xl mx-auto px-4 pt-5 pb-3 space-y-5">

            {/* Hero banner */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-auto lg:h-64">
                {/* Main hero */}
                <div className="lg:col-span-3 relative overflow-hidden rounded-2xl bg-violet-gradient p-8 flex flex-col justify-between min-h-[200px]">
                    {/* Decorative circles */}
                    <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
                    <div className="absolute -bottom-8 -right-4 w-32 h-32 rounded-full bg-amber/20 pointer-events-none" />

                    <div className="relative z-10">
                        <span className="inline-block bg-amber text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                            🇱🇰 Shop Sri Lankan
                        </span>
                        <h1 className="font-display text-white text-3xl sm:text-4xl font-bold leading-tight mb-2">
                            Authentic Ceylon Goods<br />
                            <span className="text-amber-light">Priced in Sri Lankan Rs.</span>
                        </h1>
                        <p className="text-purple-200 text-sm mb-5">Gems · Batik · Crafts · Coconut Skincare · Home</p>
                        <Link to="/products" className="btn-secondary text-sm px-6 py-2.5 w-fit">
                            Explore Products →
                        </Link>
                    </div>
                </div>

                {/* Side banners — Sri Lankan shops */}
                <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                    <Link to="/shop/coconut-glow"
                        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 p-4 flex flex-col justify-end min-h-[120px]">
                        <img src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80" alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                        <p className="relative text-white font-bold text-sm">Coconut Glow</p>
                        <p className="relative text-green-100 text-xs">Natural Skincare →</p>
                    </Link>
                    <Link to="/shop/ceylon-gems"
                        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-4 flex flex-col justify-end min-h-[120px]">
                        <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80" alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                        <p className="relative text-white font-bold text-sm">Ceylon Gems</p>
                        <p className="relative text-amber-100 text-xs">Jewellery →</p>
                    </Link>
                    <Link to="/shop/silk-lanka"
                        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-400 to-blue-600 p-4 flex flex-col justify-end min-h-[120px]">
                        <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80" alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                        <p className="relative text-white font-bold text-sm">Silk Lanka</p>
                        <p className="relative text-blue-100 text-xs">Batik & Sarees →</p>
                    </Link>
                    <Link to="/shop/heritage-home"
                        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-600 p-4 flex flex-col justify-end min-h-[120px]">
                        <img src="https://images.unsplash.com/photo-1603905700235-cc13ee5b6f7b?w=400&q=80" alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                        <p className="relative text-white font-bold text-sm">Heritage Home</p>
                        <p className="relative text-teal-100 text-xs">Home Décor →</p>
                    </Link>
                </div>
            </div>

            {/* Category pill strip */}
            <div className="flex gap-3 overflow-x-auto pb-1">
                {CATS.map((c) => (
                    <Link key={c.slug} to={`/products?category=${c.slug}`}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r ${c.color} border border-white/60 hover:shadow-md transition-all flex-shrink-0 group`}>
                        <span className="text-lg">{c.emoji}</span>
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-primary transition-colors">{c.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
