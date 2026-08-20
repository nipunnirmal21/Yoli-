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

                <div
                    className="
                        max-w-7xl
                        mx-auto
                        px-4
                        sm:px-5
                        min-h-[68px]
                        py-3
                        flex
                        items-center
                        gap-x-6
                        gap-y-3
                        flex-wrap
                        md:flex-nowrap
                    "
                >
                    {/* ─────────────────────
                        LEFT BRANDING
                    ───────────────────── */}
                    <div className="flex items-center gap-3 flex-shrink-0">

                        <Link
                            to="/"
                            className="flex items-center gap-2.5 group"
                        >
                            <div
                                className="
                                    w-9
                                    h-9
                                    rounded-xl
                                    bg-white/20
                                    flex
                                    items-center
                                    justify-center
                                    backdrop-blur-sm
                                    border
                                    border-white/10
                                "
                            >
                                <span className="text-white font-bold text-sm">
                                    Y
                                </span>
                            </div>

                            <span
                                className="
                                    text-white
                                    font-display
                                    font-bold
                                    text-xl
                                    tracking-tight
                                "
                            >
                                Yoli
                            </span>
                        </Link>

                        <div className="h-8 w-px bg-white/20" />

                        <img
                            src={rotaryLogo}
                            alt="Rotary Logo"
                            className="
                                h-7
                                sm:h-8
                                w-auto
                                object-contain
                                brightness-0
                                invert
                                opacity-90
                            "
                        />
                    </div>

                    {/* ─────────────────────
                        SEARCH AREA
                    ───────────────────── */}
                    <form
                        onSubmit={handleSearch}
                        className="
                            w-full
                            md:w-auto
                            md:flex-1
                            md:max-w-[440px]
                            lg:max-w-[460px]
                            md:ml-auto
                            flex
                            items-center
                            gap-2.5
                        "
                    >
                        {/* Search Input */}
                        <div className="relative flex-1 min-w-0">
                            <svg
                                className="
                                    absolute
                                    left-4
                                    top-1/2
                                    -translate-y-1/2
                                    w-[18px]
                                    h-[18px]
                                    text-gray-400
                                    pointer-events-none
                                "
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

                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                }
                                placeholder="Search products..."
                                aria-label="Search products"
                                className="
                                    w-full
                                    h-[42px]
                                    pl-11
                                    pr-5
                                    bg-white
                                    text-gray-800
                                    text-sm
                                    rounded-full
                                    border
                                    border-white/60
                                    outline-none
                                    placeholder:text-gray-400
                                    shadow-[0_3px_10px_rgba(0,0,0,0.10)]
                                    focus:ring-2
                                    focus:ring-white/40
                                    focus:shadow-[0_4px_14px_rgba(0,0,0,0.13)]
                                    transition-all
                                    duration-200
                                "
                            />
                        </div>

                        {/* Circular Search Button */}
                        <button
                            type="submit"
                            aria-label="Search"
                            title="Search"
                            className="
                                w-[42px]
                                h-[42px]
                                flex-shrink-0
                                rounded-full
                                bg-white
                                text-primary
                                flex
                                items-center
                                justify-center
                                border
                                border-white/60
                                shadow-[0_3px_10px_rgba(0,0,0,0.10)]
                                hover:bg-violet-50
                                hover:shadow-[0_4px_14px_rgba(0,0,0,0.14)]
                                hover:-translate-y-[1px]
                                active:translate-y-0
                                active:scale-95
                                transition-all
                                duration-200
                            "
                        >
                            <svg
                                className="w-[19px] h-[19px]"
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
