import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState('');

    useEffect(() => {
        axios.get('/api/admin/products')
            .then((r) => setProducts(r.data.products || []))
            .catch(() => setError('Failed to load products.'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="admin-form-wrapper">
            <div className="list-loading">
                <div className="loading-spinner" />
                <p>Loading products...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="admin-form-wrapper">
            <div className="list-error">{error}</div>
        </div>
    );

    return (
        <div className="admin-form-wrapper" style={{ maxWidth: '1100px' }}>
            <div className="form-card">
                <div className="form-card-header">
                    <h2 className="form-card-title">🛒 All Products</h2>
                    <p className="form-card-sub">{products.length} product{products.length !== 1 ? 's' : ''} listed</p>
                </div>

                {products.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">📦</span>
                        <p>No products added yet.</p>
                    </div>
                ) : (
                    <div className="product-table-wrapper">
                        <table className="product-table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Product Name</th>
                                    <th>Business</th>
                                    <th>Price</th>
                                    <th>Discount</th>
                                    <th>Stock</th>
                                    <th>Max Qty</th>
                                    <th>Added</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((p) => (
                                    <tr key={p._id} className="product-row">
                                        <td>
                                            {p.image_url
                                                ? <img src={p.image_url} alt={p.name} className="product-thumb" />
                                                : <div className="product-thumb-placeholder">📷</div>
                                            }
                                        </td>
                                        <td>
                                            <p className="product-name">{p.name}</p>
                                            <p className="product-desc-preview">
                                                {p.description?.length > 50 ? p.description.slice(0, 50) + '…' : p.description}
                                            </p>
                                        </td>
                                        <td><span className="seller-chip">{p.seller?.name || 'Unknown'}</span></td>
                                        <td><span className="price-tag">Rs. {Number(p.price).toLocaleString()}</span></td>
                                        <td>
                                            {p.discountedPrice && p.discountedPrice !== '0' && p.discountedPrice !== '00'
                                                ? <span className="discount-tag">Rs. {Number(p.discountedPrice).toLocaleString()}</span>
                                                : <span className="no-discount">—</span>
                                            }
                                        </td>
                                        <td>
                                            <span className={`stock-badge ${p.stock ? 'in' : 'out'}`}>
                                                {p.stock ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </td>
                                        <td className="text-center">{p.maxOrder}</td>
                                        <td className="date-cell">
                                            {new Date(p.createdAt).toLocaleDateString('en-LK', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
