import { useState, useEffect } from 'react';
import axios from 'axios';

export default function StoreList() {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]   = useState('');

    useEffect(() => {
        axios.get('/api/admin/stores')
            .then((r) => setStores(r.data.stores || []))
            .catch(() => setError('Failed to load stores.'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="admin-form-wrapper">
            <div className="list-loading">
                <div className="loading-spinner" />
                <p>Loading stores...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="admin-form-wrapper">
            <div className="list-error">{error}</div>
        </div>
    );

    return (
        <div className="admin-form-wrapper">
            <div className="form-card">
                <div className="form-card-header">
                    <h2 className="form-card-title">📋 All Stores</h2>
                    <p className="form-card-sub">{stores.length} store{stores.length !== 1 ? 's' : ''} registered</p>
                </div>

                {stores.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">🏪</span>
                        <p>No stores registered yet.</p>
                    </div>
                ) : (
                    <div className="store-grid">
                        {stores.map((store) => (
                            <div key={store._id} className="store-card">
                                {/* Banner */}
                                <div className="store-card-banner">
                                    {store.banner_url
                                        ? <img src={store.banner_url} alt="Banner" />
                                        : <div className="banner-placeholder" />
                                    }
                                    {/* Tagline overlay */}
                                    {store.tagline && (
                                        <div className="banner-tagline">{store.tagline}</div>
                                    )}
                                    {/* Logo */}
                                    <div className="store-card-logo">
                                        {store.logo_url
                                            ? <img src={store.logo_url} alt="Logo" />
                                            : <span>{store.name.charAt(0)}</span>
                                        }
                                    </div>
                                </div>

                                <div className="store-card-body">
                                    <h3 className="store-card-name">{store.name}</h3>
                                    <div className="store-card-meta">
                                        <span className="meta-chip">📍 {store.location}</span>
                                        <span className="meta-chip category-chip">{store.category}</span>
                                    </div>

                                    {store.description && (
                                        <p className="store-card-desc">{store.description}</p>
                                    )}

                                    <p className="store-card-whatsapp">📱 {store.whatsapp}</p>

                                    {store.catalogLink && (
                                        <a href={store.catalogLink} target="_blank" rel="noreferrer" className="store-card-link">
                                            🔗 {store.catalogLink.length > 40 ? store.catalogLink.slice(0, 40) + '…' : store.catalogLink}
                                        </a>
                                    )}

                                    {/* Product categories chips */}
                                    {store.productCategories && store.productCategories.length > 0 && (
                                        <div className="store-card-cats">
                                            {store.productCategories.map((cat) => (
                                                <span key={cat} className="mini-chip">{cat}</span>
                                            ))}
                                        </div>
                                    )}

                                    <p className="store-card-date">
                                        Registered: {new Date(store.createdAt).toLocaleDateString('en-LK', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
