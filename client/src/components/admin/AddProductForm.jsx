import { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../services/api';

const CLOUD_NAME    = 'dl9v1wdco';
const UPLOAD_PRESET = 'yoli_preset';

const PRODUCT_CATEGORIES = ['clothing', 'accessories', 'skincare', 'home', 'jewellery', 'food', 'services'];

const initialForm = {
    seller:          '',   // store _id (used for dropdown only)
    category:        '',   // Product category *
    name:            '',   // Product Name
    description:     '',   // Product Description
    price:           '',   // Price *
    discountedPrice: '',   // Discount Price *
    image_url:       '',   // Product image (local preview state)
    stock:           true, // Stock *
    maxOrder:        '',   // Max Order *
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

export default function AddProductForm() {
    const [form,          setForm]          = useState(initialForm);
    const [selectedStore, setSelectedStore] = useState(null);   // full store object
    const [imageFile,     setImageFile]     = useState(null);
    const [imagePreview,  setImagePreview]  = useState('');
    const [stores,        setStores]        = useState([]);
    const [loadingStores, setLoadingStores] = useState(true);
    const [loading,       setLoading]       = useState(false);
    const [toast,         setToast]         = useState(null);

    // Fetch stores for Business Name dropdown
    useEffect(() => {
        api.get('/admin/stores')
            .then((r) => setStores(r.data.stores || []))
            .catch(() => setStores([]))
            .finally(() => setLoadingStores(false));
    }, []);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4500);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    };

    // When a store is picked: keep _id in form.seller for the dropdown,
    // but also save the full store object so we can build the seller sub-doc.
    const handleSellerChange = (e) => {
        const storeId = e.target.value;
        const store   = stores.find((s) => s._id === storeId) || null;
        setForm((f) => ({ ...f, seller: storeId }));
        setSelectedStore(store);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedStore || !form.category || !form.name || !form.description ||
            !form.price || !form.maxOrder || (!imageFile && !form.image_url)) {
            showToast('⚠️ Please fill all required fields and upload a product image.', 'error');
            return;
        }

        setLoading(true);
        try {
            // Upload image and get URL
            let imageUrl = form.image_url;
            if (imageFile) imageUrl = await uploadToCloudinary(imageFile);

            // Build seller sub-document expected by the Product schema
            const sellerPayload = {
                name:        selectedStore.name,
                slug:        selectedStore.slug ||
                             selectedStore.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                logo:        selectedStore.logo_url || '',
                description: selectedStore.description || '',
                location:    selectedStore.location || '',
                rating:      selectedStore.rating || 4.5,
            };

            await api.post('/admin/products', {
                name:            form.name,
                description:     form.description,
                price:           Number(form.price),
                discountedPrice: String(form.discountedPrice),
                image:           imageUrl,          // schema field is `image`
                stock:           form.stock ? 10 : 0, // schema expects Number
                maxOrder:        Number(form.maxOrder),
                category:        form.category,     // required enum field
                seller:          sellerPayload,      // required object
            });

            showToast('✅ Product added successfully!');
            setForm(initialForm);
            setSelectedStore(null);
            setImageFile(null);
            setImagePreview('');
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to add product.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-form-wrapper">
            {toast && <div className={`admin-toast ${toast.type}`}>{toast.msg}</div>}

            <div className="form-card">
                <div className="form-card-header">
                    <h2 className="form-card-title">📦 Add New Product</h2>
                    <p className="form-card-sub">List a new product under an existing store</p>
                </div>

                <form onSubmit={handleSubmit} className="admin-form">

                    {/* ══ SECTION 1: Store Assignment ══════════════════════════════ */}
                    <div className="form-section-label">Store Assignment</div>

                    {/* Business Name */}
                    <div className="form-group">
                        <label className="form-label">
                            Business Name <span className="required">*</span>
                        </label>
                        <select
                            className="form-input form-select"
                            name="seller"
                            value={form.seller}
                            onChange={handleSellerChange}
                            required
                            disabled={loadingStores}
                        >
                            <option value="">
                                {loadingStores ? 'Loading stores...' : 'Select business / store...'}
                            </option>
                            {stores.map((s) => (
                                <option key={s._id} value={s._id}>
                                    {s.name}{s.location ? ` — ${s.location}` : ''}
                                </option>
                            ))}
                        </select>
                        {!loadingStores && stores.length === 0 && (
                            <p className="form-hint warn">
                                ⚠️ No stores found. Please register a store first.
                            </p>
                        )}

                    {/* Category */}
                    </div>
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
                            <option value="">Select category...</option>
                            {PRODUCT_CATEGORIES.map((c) => (
                                <option key={c} value={c}>
                                    {c.charAt(0).toUpperCase() + c.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* ══ SECTION 2: Product Details ═══════════════════════════════ */}
                    <div className="form-section-label">Product Details</div>

                    {/* Product Name */}
                    <div className="form-group">
                        <label className="form-label">
                            Product Name <span className="required">*</span>
                        </label>
                        <input
                            className="form-input"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="e.g. Handmade Gold Necklace"
                            required
                        />
                    </div>

                    {/* Product Description */}
                    <div className="form-group">
                        <label className="form-label">
                            Product Description <span className="required">*</span>
                        </label>
                        <textarea
                            className="form-input form-textarea"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Describe the product — materials, size, usage, care instructions..."
                            rows={4}
                            required
                        />
                    </div>

                    {/* ══ SECTION 3: Pricing ═══════════════════════════════════════ */}
                    <div className="form-section-label">Pricing</div>

                    <div className="form-row-2">
                        {/* Price */}
                        <div className="form-group">
                            <label className="form-label">
                                Price <span className="required">*</span>
                            </label>
                            <div className="input-with-prefix">
                                <span className="input-prefix">Rs.</span>
                                <input
                                    className="form-input with-prefix"
                                    name="price"
                                    type="number"
                                    min="0"
                                    value={form.price}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                        </div>

                        {/* Discount Price */}
                        <div className="form-group">
                            <label className="form-label">
                                Discount Price <span className="required">*</span>
                            </label>
                            <div className="input-with-prefix">
                                <span className="input-prefix">Rs.</span>
                                <input
                                    className="form-input with-prefix"
                                    name="discountedPrice"
                                    type="number"
                                    min="0"
                                    value={form.discountedPrice}
                                    onChange={handleChange}
                                    placeholder="0.00  (enter 0 if no discount)"
                                    required
                                />
                            </div>
                            <p className="form-hint">Enter 0 if there is no discount</p>
                        </div>
                    </div>

                    {/* ══ SECTION 4: Product Image ══════════════════════════════════ */}
                    <div className="form-section-label">Product Image</div>

                    <div className="form-group">
                        <label className="form-label">
                            High Quality Product Picture <span className="required">*</span>
                        </label>
                        <label className="upload-box product-img-upload" htmlFor="product-img-upload">
                            {imagePreview
                                ? (
                                    <div className="product-img-preview-wrap">
                                        <img src={imagePreview} alt="Product Preview" className="upload-preview product-img-preview" />
                                        <div className="img-preview-overlay">
                                            <span>🔄 Click to change</span>
                                        </div>
                                    </div>
                                )
                                : (
                                    <div className="upload-placeholder">
                                        <span className="upload-icon">📸</span>
                                        <span>Click to upload a high quality photo</span>
                                        <span className="upload-hint">PNG / JPG · Clear background recommended · Max 10MB</span>
                                    </div>
                                )
                            }
                            <input
                                id="product-img-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>

                    {/* ══ SECTION 5: Inventory ══════════════════════════════════════ */}
                    <div className="form-section-label">Inventory</div>

                    <div className="form-row-2">
                        {/* Max Order */}
                        <div className="form-group">
                            <label className="form-label">
                                Max Order <span className="required">*</span>
                            </label>
                            <input
                                className="form-input"
                                name="maxOrder"
                                type="number"
                                min="1"
                                value={form.maxOrder}
                                onChange={handleChange}
                                placeholder="e.g. 5"
                                required
                            />
                            <p className="form-hint">Maximum quantity a customer can order at once</p>
                        </div>

                        {/* Stock Toggle */}
                        <div className="form-group stock-toggle-group">
                            <label className="form-label">
                                Stock <span className="required">*</span>
                            </label>
                            <label className="stock-toggle">
                                <input
                                    type="checkbox"
                                    name="stock"
                                    checked={form.stock}
                                    onChange={handleChange}
                                    className="hidden"
                                />
                                <div className={`toggle-track ${form.stock ? 'on' : 'off'}`}>
                                    <div className="toggle-thumb" />
                                </div>
                                <span className={`toggle-label ${form.stock ? 'in-stock' : 'out-stock'}`}>
                                    {form.stock ? '✅ In Stock' : '❌ Out of Stock'}
                                </span>
                            </label>
                            <p className="form-hint">Toggle off if this item is currently unavailable</p>
                        </div>
                    </div>

                    {/* Submit */}
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading && <span className="btn-spinner" />}
                        {loading ? 'Adding Product...' : '📦 Add Product'}
                    </button>
                </form>
            </div>
        </div>
    );
}
