import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import rotaryLogo from '../assets/Rotary_centered_logo.png';

export default function Navbar() {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();

        const term = searchTerm.trim();

        if (!term) {
            navigate('/products');
            return;
        }

        navigate(`/products?search=${encodeURIComponent(term)}`);
    };

    return (
        <header className="sticky top-0 z-50 shadow-nav">
            <div className="bg-violet-gradient">

                {/* Main Navbar Row */}
                <div className="max-w-7xl mx-auto px-4 min-h-16 flex items-center gap-4">

                    {/* Left - Yoli Branding */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

                        <Link
                            to="/"
                            className="flex items-center gap-2"
                        >
                            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                <span className="text-white font-bold text-sm">
                                    Y
                                </span>
                            </div>

                            <span className="text-white font-display font-bold text-xl tracking-tight">
                                Yoli
                            </span>
                        </Link>

                        <div className="h-8 w-px bg-white/20 mx-1" />

                        <img
                            src={rotaryLogo}
                            alt="Rotary Logo"
                            className="h-7 w-auto object-contain brightness-0 invert opacity-90"
                        />
                    </div>

                    {/* Desktop Search */}
                    <form
                        onSubmit={handleSearch}
                        className="hidden md:flex ml-auto w-full max-w-[460px] items-center gap-3"
                    >
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search products..."
                            className="
                                flex-1
                                h-11
                                px-5
                                bg-white
                                text-gray-800
                                text-sm
                                rounded-full
                                outline-none
                                border-0
                                placeholder:text-sky-300
                                shadow-[0_6px_14px_rgba(0,0,0,0.14)]
                                focus:ring-2
                                focus:ring-white/40
                                transition-all
                            "
                        />

                        <button
                            type="submit"
                            aria-label="Search products"
                            className="
                                w-11
                                h-11
                                flex-shrink-0
                                rounded-full
                                bg-white
                                text-sky-400
                                flex
                                items-center
                                justify-center
                                shadow-[0_6px_14px_rgba(0,0,0,0.14)]
                                hover:bg-gray-50
                                hover:scale-105
                                transition-all
                            "
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0z"
                                />
                            </svg>
                        </button>
                    </form>
                </div>

                {/* Mobile Search */}
                <div className="md:hidden px-4 pb-3">
                    <form
                        onSubmit={handleSearch}
                        className="flex items-center gap-3 w-full"
                    >
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search products..."
                            className="
                                flex-1
                                min-w-0
                                h-11
                                px-5
                                bg-white
                                text-gray-800
                                text-sm
                                rounded-full
                                outline-none
                                border-0
                                placeholder:text-sky-300
                                shadow-[0_6px_14px_rgba(0,0,0,0.14)]
                            "
                        />

                        <button
                            type="submit"
                            aria-label="Search products"
                            className="
                                w-11
                                h-11
                                flex-shrink-0
                                rounded-full
                                bg-white
                                text-sky-400
                                flex
                                items-center
                                justify-center
                                shadow-[0_6px_14px_rgba(0,0,0,0.14)]
                            "
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0z"
                                />
                            </svg>
                        </button>
                    </form>
                </div>

            </div>
        </header>
    );
}