import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../services/api';
import { useCart } from '../context/CartContext';

const BADGE = { Bestseller: 'badge-amber', Limited: 'badge-red', New: 'badge-green', Sale: 'badge-purple' };

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, openCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [qty, setQty] = useState(1);
    const [imgOk, setImgOk] = useState(false);

    useEffect(() => {
        setLoading(true); setError(null); setImgOk(false);
        fetchProductById(id).then(setProduct).catch(() => setError('Product not found.')).finally(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="skeleton aspect-square rounded-2xl" />
            <div className="space-y-4 pt-4">{[80, 60, 40, 90, 50].map((w, i) => <div key={i} className="skeleton h-4 rounded-xl" style={{ width: `${w}%` }} />)}</div>
        </div>
    );

    if (error || !product) return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 px-4">
            <span className="text-5xl">😕</span>
            <p className="text-gray-600 font-medium">{error || 'Product not found'}</p>
            <button onClick={() => navigate('/products')} className="btn-primary text-sm px-6 py-2">← Browse Products</button>
        </div>
    );

    const fmt = (n) =>
        new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 }).format(n);
    const original = Math.round(product.price * 1.35);

    const handleAdd = () => { for (let i = 0; i < qty; i++) addToCart(product); openCart(); };

    return (
        <div className="max-w-5xl mx-auto px-4 py-5">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-5 flex-wrap">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <span>/</span>
                <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
                <span>/</span>
                <Link to={`/products?category=${product.category}`} className="hover:text-primary transition-colors capitalize">{product.category}</Link>
                <span>/</span>
                <span className="text-gray-600 truncate max-w-[140px]">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image */}
                <div className="card overflow-hidden">
                    <div className="relative aspect-square bg-subtle">
                        {!imgOk && <div className="absolute inset-0 skeleton" />}
                        <img src={product.image} alt={product.name} onLoad={() => setImgOk(true)}
                            className={`w-full h-full object-contain p-4 transition-opacity duration-300 ${imgOk ? 'opacity-100' : 'opacity-0'}`} />
                        {product.badge && <span className={`absolute top-3 left-3 ${BADGE[product.badge] || 'badge-purple'}`}>{product.badge}</span>}
                    </div>
                </div>

                {/* Info */}
                <div className="flex flex-col gap-4">
                    {/* Category + name */}
                    <div>
                        <p className="section-eyebrow mb-1">{product.category}</p>
                        <h1 className="text-gray-900 font-bold text-xl sm:text-2xl leading-tight">{product.name}</h1>
                    </div>

                    {/* Rating + stock */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-1 bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
                            {product.rating}
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        </div>
                        <span className="text-sm text-gray-400">{product.reviews} reviews</span>
                        <span className={`text-xs font-semibold ${product.stock > 5 ? 'text-emerald-600' : product.stock > 0 ? 'text-amber-dark' : 'text-red-500'}`}>
                            {product.stock === 0 ? '❌ Out of stock' : product.stock <= 5 ? `⚠️ Only ${product.stock} left` : '✅ In Stock'}
                        </span>
                    </div>

                    {/* Price */}
                    <div className="bg-primary/5 rounded-2xl p-4">
                        <div className="flex items-baseline gap-3 mb-1">
                            <span className="text-primary font-bold text-3xl">{fmt(product.price)}</span>
                            <span className="text-gray-400 text-base line-through">{fmt(original)}</span>
                            <span className="badge badge-green">35% off</span>
                        </div>
                        <p className="text-emerald-600 text-sm font-medium">You save {fmt(original - product.price)}</p>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>

                    {/* ── SHOP CARD ── */}
                    {product.seller && (
                        <Link to={`/shop/${product.seller.slug}`}
                            className="flex items-center gap-3 p-4 rounded-2xl border-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all group">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-primary/10 flex-shrink-0">
                                {product.seller.logo
                                    ? <img src={product.seller.logo} alt={product.seller.name} className="w-full h-full object-cover" />
                                    : <div className="w-full h-full flex items-center justify-center text-2xl">🏪</div>
                                }
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-500 mb-0.5">Sold by</p>
                                <p className="font-semibold text-gray-800 group-hover:text-primary transition-colors">{product.seller.name}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs text-gray-400">⭐ {product.seller.rating}</span>
                                    <span className="text-gray-200 text-xs">|</span>
                                    <span className="text-xs text-gray-400">{product.seller.location}</span>
                                </div>
                            </div>
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    )}

                    {/* Qty + buttons */}
                    {product.stock > 0 && (
                        <>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600 font-medium">Qty:</span>
                                <div className="flex items-center border-2 border-border rounded-xl overflow-hidden">
                                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 text-base">−</button>
                                    <span className="w-10 text-center text-sm font-bold text-gray-800">{qty}</span>
                                    <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 text-base">+</button>
                                </div>
                                <span className="text-xs text-gray-400">Max {product.stock}</span>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={handleAdd} className="btn-outline flex-1 py-3 text-sm">Add to Cart</button>
                                <button onClick={handleAdd} className="btn-primary flex-1 py-3 text-sm">Buy Now</button>
                            </div>
                        </>
                    )}

                    {/* Delivery */}
                    <div className="bg-gray-50 rounded-2xl p-3.5 space-y-2 text-sm">
                        {[['🚚', 'Express delivery available'], ['💬', 'WhatsApp order — simple & secure'], ['🔄', 'Easy returns']].map(([i, t]) => (
                            <div key={t} className="flex items-center gap-2 text-gray-600"><span>{i}</span><span>{t}</span></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
