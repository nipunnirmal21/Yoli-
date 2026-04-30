import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../services/api';
import ProductCard from './ProductCard';

const CATEGORIES = ['all', 'jewellery', 'clothing', 'accessories', 'skincare', 'home', 'food'];
const SORT_OPTIONS = [
    { label: 'Most Popular', value: 'popularity' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Newest', value: 'newest' },
];

function SkeletonCard() {
    return (
        <div className="card overflow-hidden">
            <div className="skeleton aspect-square w-full" />
            <div className="p-3 space-y-2">
                <div className="skeleton h-3 w-full rounded" />
                <div className="skeleton h-3 w-3/4 rounded" />
                <div className="skeleton h-4 w-1/2 rounded" />
                <div className="skeleton h-8 w-full rounded mt-1" />
            </div>
        </div>
    );
}

export default function ProductGrid({ limit, featuredOnly = false }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const category = searchParams.get('category') || 'all';
    const sort = searchParams.get('sort') || 'popularity';
    const search = searchParams.get('search') || '';

    const load = useCallback(async () => {
        setLoading(true); setError(null);
        try {
            const p = {};
            if (category !== 'all') p.category = category;
            if (sort) p.sort = sort;
            if (search) p.search = search;
            if (limit) p.limit = limit;
            if (featuredOnly) p.featured = 'true';
            setProducts(await fetchProducts(p));
        } catch { setError('Failed to load products.'); }
        finally { setLoading(false); }
    }, [category, sort, search, limit]);

    useEffect(() => { load(); }, [load]);

    const set = (key, val) => {
        const n = new URLSearchParams(searchParams);
        if (key === 'category') {
            val === 'all' ? n.delete('category') : n.set('category', val);
        } else {
            n.set(key, val);
        }
        setSearchParams(n);
    };

    return (
        <div>
            {/* Controls — hidden in featured mode */}
            {!featuredOnly && (
                <div className="bg-white rounded-lg shadow-card p-4 mb-5">
                    {/* Search chips */}
                    {search && (
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <span className="text-sm text-gray-600">Results for</span>
                            <span className="bg-orange-100 text-primary text-sm font-medium px-2 py-0.5 rounded">"{search}"</span>
                            <button
                                onClick={() => { const n = new URLSearchParams(searchParams); n.delete('search'); setSearchParams(n); }}
                                className="text-xs text-gray-400 hover:text-red-500 transition-colors underline"
                            >
                                Clear
                            </button>
                        </div>
                    )}

                    {/* Category tabs */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {CATEGORIES.map((c) => (
                            <button
                                key={c}
                                onClick={() => set('category', c)}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${category === c
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-primary'
                                    }`}
                            >
                                {c === 'all' ? 'All' : c}
                            </button>
                        ))}
                    </div>

                    {/* Sort + count row */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                        <p className="text-xs text-gray-400">
                            {loading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Sort by:</span>
                            <select
                                value={sort}
                                onChange={(e) => set('sort', e.target.value)}
                                className="text-xs border border-gray-200 rounded px-2 py-1.5 text-gray-700 outline-none focus:ring-2 focus:ring-primary/20 bg-white cursor-pointer"
                            >
                                {SORT_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-sm mb-3">{error}</p>
                    <button onClick={load} className="btn-outline text-xs px-5 py-2">Retry</button>
                </div>
            )}

            {/* Grid */}
            {!error && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {loading
                        ? Array.from({ length: limit || 10 }).map((_, i) => <SkeletonCard key={i} />)
                        : products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)
                    }
                </div>
            )}

            {/* Empty */}
            {!loading && !error && products.length === 0 && (
                <div className="text-center py-16 bg-white rounded-lg">
                    <div className="text-5xl mb-3">🔍</div>
                    <p className="text-gray-600 font-medium mb-1">No products found</p>
                    <p className="text-gray-400 text-sm">Try a different category or search term</p>
                </div>
            )}
        </div>
    );
}
