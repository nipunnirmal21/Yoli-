import { useState, useEffect } from "react";
import axios from "axios";

const CLOUD_NAME = "dl9v1wdco";
const UPLOAD_PRESET = "yoli_preset";
const PRODUCT_CATEGORIES = [
  "clothing",
  "accessories",
  "skincare",
  "home",
  "jewellery",
  "food",
  "services",
];

async function uploadToCloudinary(file) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", UPLOAD_PRESET);
  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    fd,
  );
  return res.data.secure_url;
}

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Expanded Edit States
  const [editCategory, setEditCategory] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editImagesStr, setEditImagesStr] = useState("");
  const [editStock, setEditStock] = useState(true);
  const [editPopularity, setEditPopularity] = useState(0);
  const [editBadge, setEditBadge] = useState("");
  const [editRating, setEditRating] = useState(4.5);
  const [editReviews, setEditReviews] = useState(0);
  const [editDiscountedPrice, setEditDiscountedPrice] = useState("0");
  const [editMaxOrder, setEditMaxOrder] = useState(5);
  const [editSeller, setEditSeller] = useState(""); // store _id

  const [stores, setStores] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const loadProducts = () =>
    axios.get("/api/products").then((r) => setProducts(r.data.products || []));

  useEffect(() => {
    loadProducts()
      .catch(() => setError("Failed to load products."))
      .finally(() => setLoading(false));

    axios
      .get("/api/stores")
      .then((r) => setStores(r.data.stores || []))
      .catch(() => {});
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const openEdit = (p) => {
    setEditProduct(p);
    setEditName(p.name || "");
    setEditPrice(String(p.price ?? ""));
    setEditDescription(p.description || "");
    setEditCategory(p.category || "");
    setEditImageUrl(p.image || p.image_url || "");
    setEditImagesStr(Array.isArray(p.images) ? p.images.join(", ") : "");
    setEditStock(
      p.stock > 0 ||
        p.stock === undefined ||
        p.stock === null ||
        p.stock === true,
    );
    setEditPopularity(p.popularity ?? 0);
    setEditBadge(p.badge || "");
    setEditRating(p.rating ?? 4.5);
    setEditReviews(p.reviews ?? 0);
    setEditDiscountedPrice(p.discountedPrice || "0");
    setEditMaxOrder(p.maxOrder ?? 5);

    let storeId = "";
    if (p.seller) {
      if (typeof p.seller === "string") {
        if (/^[a-f\d]{24}$/i.test(p.seller)) {
          storeId = p.seller;
        } else {
          const match = stores.find(
            (st) => st.name.toLowerCase() === p.seller.toLowerCase(),
          );
          if (match) storeId = match._id;
        }
      } else if (p.seller._id) {
        storeId = p.seller._id;
      } else if (p.seller.name) {
        const match = stores.find(
          (st) => st.name.toLowerCase() === p.seller.name.toLowerCase(),
        );
        if (match) storeId = match._id;
      }
    }
    setEditSeller(storeId);
    setImageFile(null);
    setImagePreview("");
  };

  const closeEdit = () => {
    if (saving) return;
    setEditProduct(null);
    setImageFile(null);
    setImagePreview("");
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editProduct) return;
    setSaving(true);
    try {
      let imageUrl = editImageUrl;
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      let sellerPayload = editProduct.seller;
      if (editSeller) {
        const selectedStore = stores.find((s) => s._id === editSeller);
        if (selectedStore) {
          sellerPayload = {
            name: selectedStore.name,
            slug:
              selectedStore.slug ||
              selectedStore.name
                .toLowerCase()
                .replace(/ /g, "-")
                .replace(/[^\w-]+/g, ""),
            logo: selectedStore.logo_url || "",
            description: selectedStore.description || "",
            location: selectedStore.location || "",
            rating: selectedStore.rating || 4.5,
          };
        }
      }

      const { data } = await axios.patch(
        `/api/admin/products/${editProduct._id}`,
        {
          name: editName,
          price: Number(editPrice),
          description: editDescription,
          category: editCategory,
          image: imageUrl,
          images: editImagesStr
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean),
          stock: editStock ? 10 : 0,
          popularity: Number(editPopularity),
          badge: editBadge,
          rating: Number(editRating),
          reviews: Number(editReviews),
          discountedPrice: String(editDiscountedPrice),
          maxOrder: Number(editMaxOrder),
          seller: sellerPayload,
        },
      );

      if (data.success && data.product) {
        setProducts((prev) =>
          prev.map((x) =>
            String(x._id) === String(data.product._id) ? data.product : x,
          ),
        );
        showToast("Product updated.");
        setEditProduct(null);
        setImageFile(null);
        setImagePreview("");
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Update failed.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (p) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    axios
      .delete(`/api/admin/products/${p._id}`)
      .then(() => {
        setProducts((prev) =>
          prev.filter((x) => String(x._id) !== String(p._id)),
        );
        showToast("Product deleted.");
      })
      .catch((err) => {
        showToast(err.response?.data?.message || "Delete failed.", "error");
      });
  };

  if (loading)
    return (
      <div className="admin-form-wrapper">
        <div className="list-loading">
          <div className="loading-spinner" />
          <p>Loading products...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="admin-form-wrapper">
        <div className="list-error">{error}</div>
      </div>
    );

  return (
    <div className="admin-form-wrapper" style={{ maxWidth: "1100px" }}>
      {toast && <div className={`admin-toast ${toast.type}`}>{toast.msg}</div>}

      {editProduct && (
        <div
          role="presentation"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(15, 23, 42, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={closeEdit}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-product-title"
            className="form-card"
            style={{
              maxWidth: 480,
              width: "100%",
              margin: 0,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="form-card-header">
              <h2 id="edit-product-title" className="form-card-title">
                Edit Product
              </h2>
              <p className="form-card-sub">
                Update all product details, inventory, and category
              </p>
            </div>
            <form className="admin-form" onSubmit={saveEdit}>
              {/* Store Assignment */}
              <div className="form-section-label" style={{ marginTop: "0px" }}>
                Store Assignment
              </div>
              <div className="form-group">
                <label className="form-label">Business Name</label>
                <select
                  className="form-input form-select"
                  value={editSeller}
                  onChange={(e) => setEditSeller(e.target.value)}
                >
                  <option value="">Select business / store...</option>
                  {stores.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                      {s.location ? ` — ${s.location}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div className="form-group">
                <label className="form-label">
                  Category <span className="required">*</span>
                </label>
                <select
                  className="form-input form-select"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
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

              {/* Product Details */}
              <div className="form-section-label">Product Details</div>
              <div className="form-group">
                <label className="form-label">
                  Product Name <span className="required">*</span>
                </label>
                <input
                  className="form-input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Description <span className="required">*</span>
                </label>
                <textarea
                  className="form-input form-textarea"
                  rows={4}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  required
                />
              </div>

              {/* Pricing */}
              <div className="form-section-label">Pricing</div>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">
                    Price <span className="required">*</span>
                  </label>
                  <div className="input-with-prefix">
                    <span className="input-prefix">Rs.</span>
                    <input
                      className="form-input with-prefix"
                      type="number"
                      min="0"
                      step="any"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Discount Price <span className="required">*</span>
                  </label>
                  <div className="input-with-prefix">
                    <span className="input-prefix">Rs.</span>
                    <input
                      className="form-input with-prefix"
                      type="number"
                      min="0"
                      step="any"
                      value={editDiscountedPrice}
                      onChange={(e) => setEditDiscountedPrice(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="form-section-label">Product Images</div>
              <div className="form-group">
                <label className="form-label">
                  Product Picture <span className="required">*</span>
                </label>
                <label
                  className="upload-box product-img-upload"
                  htmlFor="edit-product-img-upload"
                  style={{ cursor: "pointer" }}
                >
                  {imagePreview || editImageUrl ? (
                    <div className="product-img-preview-wrap">
                      <img
                        src={imagePreview || editImageUrl}
                        alt="Product Preview"
                        className="upload-preview product-img-preview"
                      />
                      <div className="img-preview-overlay">
                        <span>🔄 Click to change photo</span>
                      </div>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <span className="upload-icon">📸</span>
                      <span>Click to upload a photo</span>
                    </div>
                  )}
                  <input
                    id="edit-product-img-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setImageFile(file);
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">Or Direct Image URL</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={editImageUrl}
                  onChange={(e) => {
                    setEditImageUrl(e.target.value);
                    setImageFile(null);
                    setImagePreview("");
                  }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Extra Image URLs (comma-separated)
                </label>
                <textarea
                  className="form-input form-textarea"
                  rows={2}
                  placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                  value={editImagesStr}
                  onChange={(e) => setEditImagesStr(e.target.value)}
                />
              </div>

              {/* Inventory & Limits */}
              <div className="form-section-label">Inventory & Limits</div>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">
                    Max Order <span className="required">*</span>
                  </label>
                  <input
                    className="form-input"
                    type="number"
                    min="1"
                    value={editMaxOrder}
                    onChange={(e) => setEditMaxOrder(e.target.value)}
                    required
                  />
                </div>
                <div
                  className="form-group stock-toggle-group"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <label className="form-label">Stock Status</label>
                  <label className="stock-toggle" style={{ cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={editStock}
                      onChange={(e) => setEditStock(e.target.checked)}
                      className="hidden"
                    />
                    <div className={`toggle-track ${editStock ? "on" : "off"}`}>
                      <div className="toggle-thumb" />
                    </div>
                    <span
                      className={`toggle-label ${editStock ? "in-stock" : "out-stock"}`}
                    >
                      {editStock ? "✅ In Stock" : "❌ Out of Stock"}
                    </span>
                  </label>
                </div>
              </div>

              {/* Stats & Customization */}
              <div className="form-section-label">Stats & Customization</div>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Popularity Score</label>
                  <input
                    className="form-input"
                    type="number"
                    min="0"
                    value={editPopularity}
                    onChange={(e) => setEditPopularity(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Badge</label>
                  <select
                    className="form-input form-select"
                    value={editBadge}
                    onChange={(e) => setEditBadge(e.target.value)}
                  >
                    <option value="">No Badge</option>
                    <option value="New">New</option>
                    <option value="Bestseller">Bestseller</option>
                    <option value="Limited">Limited</option>
                    <option value="Sale">Sale</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Rating (0 - 5)</label>
                  <input
                    className="form-input"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={editRating}
                    onChange={(e) => setEditRating(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Reviews Count</label>
                  <input
                    className="form-input"
                    type="number"
                    min="0"
                    value={editReviews}
                    onChange={(e) => setEditReviews(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row-2" style={{ marginTop: "20px" }}>
                <button
                  type="button"
                  className="chip"
                  onClick={closeEdit}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="form-card">
        <div className="form-card-header">
          <h2 className="form-card-title">🛒 All Products</h2>
          <p className="form-card-sub">
            {products.length} product{products.length !== 1 ? "s" : ""} listed
          </p>
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="product-row">
                    <td>
                      {p.image_url || p.image ? (
                        <img
                          src={p.image_url || p.image}
                          alt={p.name}
                          className="product-thumb"
                        />
                      ) : (
                        <div className="product-thumb-placeholder">📷</div>
                      )}
                    </td>
                    <td>
                      <p className="product-name">{p.name}</p>
                      <p className="product-desc-preview">
                        {p.description?.length > 50
                          ? p.description.slice(0, 50) + "…"
                          : p.description}
                      </p>
                    </td>
                    <td>
                      <span className="seller-chip">
                        {p.seller?.name || "Unknown"}
                      </span>
                    </td>
                    <td>
                      <span className="price-tag">
                        Rs. {Number(p.price).toLocaleString()}
                      </span>
                    </td>
                    <td>
                      {p.discountedPrice &&
                      p.discountedPrice !== "0" &&
                      p.discountedPrice !== "00" ? (
                        <span className="discount-tag">
                          Rs. {Number(p.discountedPrice).toLocaleString()}
                        </span>
                      ) : (
                        <span className="no-discount">—</span>
                      )}
                    </td>
                    <td>
                      <span className={`stock-badge ${p.stock ? "in" : "out"}`}>
                        {p.stock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="text-center">{p.maxOrder ?? "—"}</td>
                    <td className="date-cell">
                      {new Date(p.createdAt).toLocaleDateString("en-LK", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      <div className="chip-group">
                        <button
                          type="button"
                          className="chip"
                          title="Edit product"
                          onClick={() => openEdit(p)}
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          className="chip"
                          title="Delete product"
                          onClick={() => handleDelete(p)}
                        >
                          🗑️
                        </button>
                      </div>
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
