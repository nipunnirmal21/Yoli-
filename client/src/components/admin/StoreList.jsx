import { useState, useEffect } from 'react';
import axios from 'axios';

const STORE_CATEGORIES = ['Food', 'Jewelers', 'Clothing', 'Skincare', 'Accessories', 'Services'];

export default function StoreList() {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]   = useState('');
    
    // Expanded Edit States
    const [editStore, setEditStore] = useState(null);
    const [editName, setEditName] = useState('');
    const [editCategory, setEditCategory] = useState('');
    const [editSlug, setEditSlug] = useState('');
    const [editLogoUrl, setEditLogoUrl] = useState('');
    const [editLocation, setEditLocation] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editCatalogLink, setEditCatalogLink] = useState('');
    const [editWhatsapp, setEditWhatsapp] = useState('');
    const [editProductCategories, setEditProductCategories] = useState('');
    const [editBannerUrl, setEditBannerUrl] = useState('');
    const [editTagline, setEditTagline] = useState('');
    const [editRating, setEditRating] = useState(4.8);
    const [editTotalSales, setEditTotalSales] = useState(0);
    const [editJoined, setEditJoined] = useState('');

    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    const loadStores = () =>
        axios.get('/api/stores').then((r) => setStores(r.data.stores || []));

    useEffect(() => {
        loadStores()
            .catch(() => setError('Failed to load stores.'))
            .finally(() => setLoading(false));
    }, []);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    const openEdit = (store) => {
        setEditStore(store);
        setEditName(store.name || '');
        setEditSlug(store.slug || '');
        setEditCategory(store.category || '');
        setEditLogoUrl(store.logo_url || '');
        setEditLocation(store.location || '');
        setEditDescription(store.description || '');
        setEditCatalogLink(store.catalogLink || '');
        setEditWhatsapp(store.whatsapp || '');
        setEditProductCategories(store.productCategories ? store.productCategories.join(', ') : '');
        setEditBannerUrl(store.banner_url || '');
        setEditTagline(store.tagline || '');
        setEditRating(store.rating ?? 4.8);
        setEditTotalSales(store.totalSales ?? 0);
        setEditJoined(store.joined || '2024');
    };

    const closeEdit = () => {
        if (saving) return;
        setEditStore(null);
    };

    const saveEdit = async (e) => {
        e.preventDefault();
        if (!editStore) return;
        setSaving(true);
        try {
            const { data } = await axios.patch(`/api/admin/stores/${editStore._id}`, {
                name: editName,
                slug: editSlug,
                category: editCategory,
                logo_url: editLogoUrl,
                location: editLocation,
                description: editDescription,
                catalogLink: editCatalogLink,
                whatsapp: editWhatsapp,
                productCategories: editProductCategories.split(',').map(x => x.trim()).filter(Boolean),
                banner_url: editBannerUrl,
                tagline: editTagline,
                rating: Number(editRating),
                totalSales: Number(editTotalSales),
                joined: editJoined,
            });
            if (data.success && data.store) {
                setStores((prev) =>
                    prev.map((s) => (String(s._id) === String(data.store._id) ? data.store : s))
                );
                showToast('Store updated.');
                setEditStore(null);
            }
        } catch (err) {
            showToast(err.response?.data?.message || 'Update failed.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = (store) => {
        if (!window.confirm('Are you sure you want to delete this store?')) return;
        axios
            .delete(`/api/admin/stores/${store._id}`)
            .then(() => {
                setStores((prev) => prev.filter((s) => String(s._id) !== String(store._id)));
                showToast('Store deleted.');
            })
            .catch((err) => {
                showToast(err.response?.data?.message || 'Delete failed.', 'error');
            });
    };

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
            {toast && <div className={`admin-toast ${toast.type}`}>{toast.msg}</div>}

            {editStore && (
                <div
                    role="presentation"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 1000,
                        background: 'rgba(15, 23, 42, 0.45)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 16,
                    }}
                    onClick={closeEdit}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="edit-store-title"
                        className="form-card"
                        style={{ maxWidth: 600, width: '100%', margin: 0, maxHeight: '90vh', overflowY: 'auto' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="form-card-header">
                            <h2 id="edit-store-title" className="form-card-title">Edit store</h2>
                            <p className="form-card-sub">Update full business profile and details</p>
                        </div>
                        <form className="admin-form" onSubmit={saveEdit}>
                            <div className="form-section-label" style={{ marginTop: 0 }}>Basic Info</div>
                            <div className="form-row-2">
                                <div className="form-group">
                                    <label className="form-label">Business Name <span className="required">*</span></label>
                                    <input
                                        className="form-input"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Category <span className="required">*</span></label>
                                    <select
                                        className="form-input form-select"
                                        value={editCategory}
                                        onChange={(e) => setEditCategory(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Category...</option>
                                        {STORE_CATEGORIES.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            
                            <div className="form-row-2">
                                <div className="form-group">
                                    <label className="form-label">Store Slug (URL friendly)</label>
                                    <input
                                        className="form-input"
                                        value={editSlug}
                                        onChange={(e) => setEditSlug(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Location <span className="required">*</span></label>
                                    <input
                                        className="form-input"
                                        value={editLocation}
                                        onChange={(e) => setEditLocation(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-input form-textarea"
                                    rows={3}
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                />
                            </div>

                            <div className="form-section-label">Contact & Links</div>
                            <div className="form-row-2">
                                <div className="form-group">
                                    <label className="form-label">WhatsApp Number <span className="required">*</span></label>
                                    <input
                                        className="form-input"
                                        placeholder="947XXXXXXXX"
                                        value={editWhatsapp}
                                        onChange={(e) => setEditWhatsapp(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Catalog Link</label>
                                    <input
                                        className="form-input"
                                        placeholder="https://..."
                                        value={editCatalogLink}
                                        onChange={(e) => setEditCatalogLink(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-section-label">Branding Images</div>
                            <div className="form-row-2">
                                <div className="form-group">
                                    <label className="form-label">Logo URL <span className="required">*</span></label>
                                    <input
                                        className="form-input"
                                        value={editLogoUrl}
                                        onChange={(e) => setEditLogoUrl(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Banner URL</label>
                                    <input
                                        className="form-input"
                                        value={editBannerUrl}
                                        onChange={(e) => setEditBannerUrl(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Tagline / Slogan</label>
                                <input
                                    className="form-input"
                                    value={editTagline}
                                    onChange={(e) => setEditTagline(e.target.value)}
                                />
                            </div>

                            <div className="form-section-label">Additional Setup</div>
                            <div className="form-group">
                                <label className="form-label">Product Categories (comma-separated)</label>
                                <input
                                    className="form-input"
                                    placeholder="Shirts, Pants, Shoes"
                                    value={editProductCategories}
                                    onChange={(e) => setEditProductCategories(e.target.value)}
                                />
                            </div>

                            <div className="form-row-2">
                                <div className="form-group">
                                    <label className="form-label">Rating</label>
                                    <input
                                        className="form-input"
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="5"
                                        value={editRating}
                                        onChange={(e) => setEditRating(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Total Sales</label>
                                    <input
                                        className="form-input"
                                        type="number"
                                        min="0"
                                        value={editTotalSales}
                                        onChange={(e) => setEditTotalSales(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-group" style={{ maxWidth: '50%' }}>
                                <label className="form-label">Joined Year</label>
                                <input
                                    className="form-input"
                                    value={editJoined}
                                    onChange={(e) => setEditJoined(e.target.value)}
                                />
                            </div>

                            <div className="form-row-2" style={{ marginTop: 24 }}>
                                <button type="button" className="chip" onClick={closeEdit} disabled={saving}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary" disabled={saving}>
                                    {saving ? 'Saving…' : 'Save changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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
                                <div className="store-card-banner">
                                    {store.banner_url
                                        ? <img src={store.banner_url} alt="Banner" />
                                        : <div className="banner-placeholder" />
                                    }
                                    {store.tagline && (
                                        <div className="banner-tagline">{store.tagline}</div>
                                    )}
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

                                    <div className="chip-group" style={{ marginTop: 12 }}>
                                        <button
                                            type="button"
                                            className="chip"
                                            title="Edit store"
                                            onClick={() => openEdit(store)}
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            type="button"
                                            className="chip"
                                            title="Delete store"
                                            onClick={() => handleDelete(store)}
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
