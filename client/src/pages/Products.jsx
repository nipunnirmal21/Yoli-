import ProductGrid from '../components/ProductGrid';

export default function Products() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">🛍️</span>
                <h1 className="text-lg font-bold text-gray-800">All Products</h1>
            </div>
            <ProductGrid />
        </div>
    );
}
