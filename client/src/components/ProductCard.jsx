import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const BADGE = {
    Bestseller: 'badge-amber',
    Limited: 'badge-red',
    New: 'badge-green',
    Sale: 'badge-purple',
};

export default function ProductCard({ product }) {
    const { addToCart } = useCart();

    const fmt = (n) =>
        new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 }).format(n);

    return (
        <div className="card group flex flex-col overflow-hidden">
            {/* Image */}
            <Link to={`/products/${product._id}`} className="relative block bg-subtle overflow-hidden rounded-t-2xl">
                <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {product.badge && (
                    <span className={`absolute top-2.5 left-2.5 ${BADGE[product.badge] || 'badge-purple'}`}>
                        {product.badge}
                    </span>
                )}
                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <span className="text-gray-500 text-xs font-semibold uppercase tracking-widest">Out of Stock</span>
                    </div>
                )}
                {/* Quick add overlay */}
                <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button
                        onClick={(e) => { e.preventDefault(); if (product.stock > 0) addToCart(product); }}
                        disabled={product.stock === 0}
                        className="w-full bg-primary text-white text-xs font-bold py-2 rounded-xl backdrop-blur-sm hover:bg-primary-dark transition-colors"
                    >
                        + Add to Cart
                    </button>
                </div>
            </Link>

            {/* Info */}
            <div className="p-3 flex flex-col flex-1 gap-1.5">
                {/* Shop name */}
                {product.seller && (
                    <Link to={`/shop/${product.seller.slug}`}
                        className="text-[10px] text-primary font-semibold uppercase tracking-wider hover:underline w-fit">
                        {product.seller.name}
                    </Link>
                )}

                <Link to={`/products/${product._id}`}>
                    <p className="text-gray-800 text-sm font-medium leading-snug line-clamp-2 hover:text-primary transition-colors">
                        {product.name}
                    </p>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                        {product.rating}
                        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </div>
                    <span className="text-[10px] text-gray-400">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2 mt-auto pt-1">
                    <span className="text-primary font-bold text-base">{fmt(product.price)}</span>
                    <span className="text-gray-400 text-xs line-through">{fmt(Math.round(product.price * 1.35))}</span>
                    <span className="text-emerald-600 text-[11px] font-bold">35% off</span>
                </div>
            </div>
        </div>
    );
}
