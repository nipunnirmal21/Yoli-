import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
// Rotary Logo එක import කිරීම
import rotaryLogo from '../assets/Rotary_centered_logo.png';

const CATS = [
    { label: 'All', to: '/products' },
    { label: 'Jewellery', to: '/products?category=jewellery' },
    { label: 'Clothing', to: '/products?category=clothing' },
    { label: 'Accessories', to: '/products?category=accessories' },
    { label: 'Skincare', to: '/products?category=skincare' },
    { label: 'Home Décor', to: '/products?category=home' },
];

export default function Navbar() {
    const { cartCount, openCart } = useCart();
    const [q, setQ] = useState('');
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const search = (e) => {
        e.preventDefault();
        if (q.trim()) { 
            navigate(`/products?search=${encodeURIComponent(q.trim())}`); 
            setQ(''); 
            setOpen(false); 
        }
    };

    return (
        <header className="sticky top-0 z-50 shadow-nav">
            {/* Main bar */}
            <div className="bg-violet-gradient">
                <div className="max-w-7xl mx-auto px-4 flex items-center h-16 gap-4">
                    
                    {/* 1. නිවැරදි කළ Logo Section (Mobile optimized) */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                <span className="text-white font-bold text-xs sm:text-sm">Y</span>
                            </div>
                            <span className="text-white font-display font-bold text-lg sm:text-xl tracking-tight">Yoli</span>
                        </Link>
                        
                        {/* Separator line - Mobile/Desktop දෙකටම */}
                        <div className="h-6 sm:h-8 w-[1px] bg-white/20 mx-1"></div> 

                        {/* Rotary Logo - Mobile වලදීත් පෙනෙන සේ සකසා ඇත */}
                        <img 
                            src={rotaryLogo} 
                            alt="Rotary Logo" 
                            className="h-5 sm:h-7 w-auto object-contain brightness-0 invert opacity-90" 
                        />
                    </div>

                    {/* 2. Search Bar — Desktop (දැන් මෙය නිවැරදි තැන පිහිටයි) */}
                    <form onSubmit={search} className="hidden md:flex flex-1 max-w-2xl mx-auto">
                        <div className="flex w-full rounded-xl overflow-hidden shadow-md">
                            <input
                                type="text"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Search products, shops..."
                                className="flex-1 px-4 py-2.5 text-sm text-gray-800 bg-white outline-none"
                            />
                            <button type="submit" className="bg-amber text-white px-5 py-2.5 text-sm font-semibold hover:bg-amber-dark transition-colors flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                Search
                            </button>
                        </div>
                    </form>

                    {/* 3. Right side icons (Cart/Menu) */}
                    <div className="flex items-center gap-3 ml-auto md:ml-0">
                        <button onClick={openCart} className="relative flex items-center gap-1.5 text-white hover:text-white/80 transition-colors" aria-label="Cart">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="hidden sm:inline text-sm font-medium">Cart</span>
                            <AnimatePresence>
                                {cartCount > 0 && (
                                    <motion.span key="c" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                                        className="absolute -top-2 -right-2 bg-amber text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                                        {cartCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                        <button className="md:hidden text-white" onClick={() => setOpen(v => !v)} aria-label="Menu">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {open ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}