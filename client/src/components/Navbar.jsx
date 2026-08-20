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
            <div className="bg-violet-gradient">
                {/* Main Row */}
                <div className="max-w-7xl mx-auto px-4 flex items-center h-16 gap-4">
                    
                    {/* 1. Left Side: Logo & Branding */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                <span className="text-white font-bold text-xs sm:text-sm">Y</span>
                            </div>
                            <span className="text-white font-display font-bold text-lg sm:text-xl tracking-tight">Yoli</span>
                        </Link>
                        
                        <div className="h-6 sm:h-8 w-[1px] bg-white/20 mx-1"></div> 

                        <img 
                            src={rotaryLogo} 
                            alt="Rotary Logo" 
                            className="h-5 sm:h-7 w-auto object-contain brightness-0 invert opacity-90" 
                        />
                    </div>

                    {/* 2. Right Side: Desktop Search Bar (Pushed to right via ml-auto) */}
                    <form onSubmit={search} className="hidden md:flex flex-1 max-w-[450px] ml-auto h-10 items-center gap-2">
                        <input
                            type="text"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Search products..."
                            className="flex-1 px-4 py-2 text-sm text-gray-900 bg-white rounded-full shadow-sm outline-none placeholder-gray-400 focus:ring-2 focus:ring-amber/50 transition-all h-full"
                        />
                        <button type="submit" className="w-10 h-10 flex-shrink-0 rounded-full text-white bg-amber hover:bg-amber-dark shadow-sm transition-colors flex items-center justify-center focus:ring-2 focus:ring-amber/50 outline-none">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </form>

                    {/* 3. Mobile Menu Button (Only visible on small screens) */}
                    <div className="flex items-center md:hidden ml-auto">
                        <button className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors" onClick={() => setOpen(v => !v)} aria-label="Menu">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {open ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                            </svg>
                        </button>
                    </div>

                    {/* Hidden Cart Logic */}
                    <button onClick={openCart} style={{ display: 'none' }} className="relative items-center gap-1.5 text-white hover:text-white/80 transition-colors" aria-label="Cart">
                        <span className="hidden sm:inline text-sm font-medium">Cart</span>
                    </button>
                </div>

                {/* Mobile Search Row - visible on mobile only */}
                <div className="md:hidden px-4 pb-3">
                    <form onSubmit={search} className="flex w-full h-10 gap-2">
                        <input
                            type="text"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Search products..."
                            className="flex-1 px-4 py-2 text-sm text-gray-900 bg-white rounded-full shadow-sm outline-none placeholder-gray-400 focus:ring-2 focus:ring-amber/50 transition-all h-full"
                        />
                        <button type="submit" className="w-10 h-10 flex-shrink-0 rounded-full text-white bg-amber hover:bg-amber-dark shadow-sm transition-colors flex items-center justify-center focus:ring-2 focus:ring-amber/50 outline-none">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </header>
    );
}