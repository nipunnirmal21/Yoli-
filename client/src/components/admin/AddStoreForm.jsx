import { useState } from 'react';
import axios from 'axios';

const CLOUD_NAME   = 'dl9v1wdco';
const UPLOAD_PRESET = 'yoli_preset';

// Store main categories
const STORE_CATEGORIES = ['Food', 'Jewelers', 'Clothing', 'Skincare', 'Accessories'];

// Product categories sold inside a store (multi-select chips)
const PRODUCT_CATS = ['Food', 'Jewelers', 'Clothing', 'Skincare', 'Accessories', 'Home Decor', 'Electronics', 'Gifts', 'Beauty', 'Health'];

const initialForm = {
    name:              '',
    logo_url:          '',
    location:          '',
    description:       '',
    catalogLink:       '',
    whatsapp:          '',
    category:          '',
    productCategories: [],   // multi-select chips
    banner_url:        '',
    tagline:           '',
};

async function uploadToCloudinary(file) {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', UPLOAD_PRESET);
    const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, fd
    );
    return res.data.secure_url;
}

export default function AddStoreForm() {
    const [form,         setForm]         = useState(initialForm);
    const [logoFile,     setLogoFile]     = useState(null);
    const [bannerFile,   setBannerFile]   = useState(null);
    const [logoPreview,  setLogoPreview]  = useState('');
    const [bannerPreview,setBannerPreview]= useState('');
    const [loading,      setLoading]      = useState(false);
    const [toast,        setToast]        = useState(null);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4500);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    // Toggle a product category chip on/off
    const toggleProductCat = (cat) => {
        setForm((f) => {
            const already = f.productCategories.includes(cat);
            return {
                ...f,
                productCategories: already
                    ? f.productCategories.filter((c) => c !== cat)
                    : [...f.productCategories, cat],
            };
        });
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;
        const preview = URL.createObjectURL(file);
        if (type === 'logo') { setLogoFile(file);   setLogoPreview(preview); }
        else                 { setBannerFile(file);  setBannerPreview(preview); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Required field check
        if (!form.name || !logoFile && !form.logo_url || !form.location || !form.whatsapp || !form.category) {
            showToast('⚠️ Please fill all required fields and upload a logo.', 'error');
            return;
        }

        setLoading(true);
        try {
            let logo_url   = form.logo_url;
            let banner_url = form.banner_url;
            if (logoFile)   logo_url   = await uploadToCloudinary(logoFile);
            if (bannerFile) banner_url = await uploadToCloudinary(bannerFile);

            await axios.post('/api/admin/stores', { ...form, logo_url, banner_url });
            showToast('✅ Store registered successfully!');
            setForm(initialForm);
            setLogoFile(null); setBannerFile(null);
            setLogoPreview(''); setBannerPreview('');
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to register store.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-form-wrapper">
            {toast && <div className={`admin-toast ${toast.type}`}>{toast.msg}</div>}

            <div className="form-card">
                <div className="form-card-header">
                    <h2 className="form-card-title">🏪 Register New Store</h2>
                    <p className="form-card-sub">Add a new SME store to the yoli.lk marketplace</p>
                </div>

                <form onSubmit={handleSubmit} className="admin-form">

                    {/* ══ SECTION 1: Identity ══════════════════════════════════════ */}
                    <div className="form-section-label">Store Identity</div>

                    {/* Name */}
                    <div className="form-group">
                        <label className="form-label">
                            Name <span className="required">*</span>
                        </label>
                        <input
                            className="form-input"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="e.g. Nimal's Fashion"
                            required
                        />
                    </div>

                    {/* Logo Upload */}
                    <div className="form-group">
                        <label className="form-label">
                            Logo <span className="required">*</span>
                        </label>
                        <label className="upload-box logo-sq-upload" htmlFor="logo-upload">
                            {logoPreview
                                ? <img src={logoPreview} alt="Logo" className="upload-preview logo-preview" />
                                : (
                                    <div className="upload-placeholder">
                                        <span className="upload-icon">🏷️</span>
                                        <span>Click to upload store logo</span>
                                        <span className="upload-hint">Square image recommended · PNG / JPG</span>
                                    </div>
                                )
                            }
                            <input id="logo-upload" type="file" accept="image/*" className="hidden"
                                onChange={(e) => handleFileChange(e, 'logo')} />
                        </label>
                    </div>

                    {/* Location */}
                    <div className="form-group">
                        <label className="form-label">
                            Location <span className="required">*</span>
                        </label>
                        <input
                            className="form-input"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            placeholder="e.g. Colombo 7, Kandy, Galle..."
                            required
                        />
                    </div>

                    {/* Shop Description */}
                    <div className="form-group">
                        <label className="form-label">Shop Description</label>
                        <textarea
                            className="form-input form-textarea"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="A short sentence about this store (shown on store card)..."
                            rows={2}
                        />
                    </div>

                    {/* Shop Tagline */}
                    <div className="form-group">
                        <label className="form-label">Shop Tagline</label>
                        <input
                            className="form-input"
                            name="tagline"
                            value={form.tagline}
                            onChange={handleChange}
                            placeholder='e.g. "Wear Your Story" or "Fresh from the Farm"'
                        />
                        <p className="form-hint">A catchy one-liner displayed on the store banner</p>
                    </div>

                    {/* ══ SECTION 2: Contact & Links ═══════════════════════════════ */}
                    <div className="form-section-label">Contact &amp; Links</div>

                    {/* Web / FB / Catalog link */}
                    <div className="form-group">
                        <label className="form-label">Web / FB / Catalog (WhatsApp)</label>
                        <div className="input-with-icon">
                            <span className="input-icon">🔗</span>
                            <input
                                className="form-input with-icon"
                                name="catalogLink"
                                value={form.catalogLink}
                                onChange={handleChange}
                                placeholder="https://facebook.com/yourpage  or  https://yourwebsite.com"
                            />
                        </div>
                        <p className="form-hint">Paste your website, Facebook page, or WhatsApp catalog link</p>
                    </div>

                    {/* WhatsApp Number */}
                    <div className="form-group">
                        <label className="form-label">
                            WhatsApp Number <span className="required">*</span>
                        </label>
                        <div className="input-with-icon">
                            <span className="input-icon">📱</span>
                            <input
                                className="form-input with-icon"
                                name="whatsapp"
                                value={form.whatsapp}
                                onChange={handleChange}
                                placeholder="947XXXXXXXX"
                                maxLength={11}
                                required
                            />
                        </div>
                        <p className="form-hint">Format: 947XXXXXXXX — 11 digits, starting with 947</p>
                    </div>

                    {/* ══ SECTION 3: Categories ════════════════════════════════════ */}
                    <div className="form-section-label">Categories</div>

                    {/* Main Store Category */}
                    <div className="form-group">
                        <label className="form-label">
                            Category <span className="required">*</span>
                        </label>
                        <select
                            className="form-input form-select"
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select main category...</option>
                            {STORE_CATEGORIES.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    {/* Product Categories (multi-chip) */}
                    <div className="form-group">
                        <label className="form-label">Many Products Category Sale In Store?</label>
                        <p className="form-hint" style={{ marginBottom: 10 }}>
                            Select all product types this store sells
                        </p>
                        <div className="chip-group">
                            {PRODUCT_CATS.map((cat) => {
                                const active = form.productCategories.includes(cat);
                                return (
                                    <button
                                        key={cat}
                                        type="button"
                                        className={`chip ${active ? 'chip-active' : ''}`}
                                        onClick={() => toggleProductCat(cat)}
                                    >
                                        {active ? '✓ ' : ''}{cat}
                                    </button>
                                );
                            })}
                        </div>
                        {form.productCategories.length > 0 && (
                            <p className="form-hint" style={{ marginTop: 8 }}>
                                Selected: {form.productCategories.join(', ')}
                            </p>
                        )}
                    </div>

                    {/* ══ SECTION 4: Store Images ══════════════════════════════════ */}
                    <div className="form-section-label">Store Images</div>

                    {/* Banner */}
                    <div className="form-group">
                        <label className="form-label">Shop Banner Image</label>
                        <label className="upload-box banner-upload-box" htmlFor="banner-upload">
                            {bannerPreview
                                ? <img src={bannerPreview} alt="Banner" className="upload-preview banner-preview" />
                                : (
                                    <div className="upload-placeholder">
                                        <span className="upload-icon">🏞️</span>
                                        <span>Click to upload shop banner</span>
                                        <span className="upload-hint">Recommended size: 1200 × 400 px</span>
                                    </div>
                                )
                            }
                            <input id="banner-upload" type="file" accept="image/*" className="hidden"
                                onChange={(e) => handleFileChange(e, 'banner')} />
                        </label>
                    </div>

                    {/* Submit */}
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading && <span className="btn-spinner" />}
                        {loading ? 'Registering Store...' : '🏪 Register Store'}
                    </button>
                </form>
            </div>
        </div>
    );
}
