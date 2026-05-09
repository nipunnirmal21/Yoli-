import { useState } from 'react';
import '../admin.css';
import AddStoreForm from '../components/admin/AddStoreForm';
import AddProductForm from '../components/admin/AddProductForm';
import StoreList from '../components/admin/StoreList';
import ProductList from '../components/admin/ProductList';

const NAV_ITEMS = [
    { id: 'add-store', label: 'Register Store', icon: '🏪' },
    { id: 'add-product', label: 'Add Product', icon: '📦' },
    { id: 'view-stores', label: 'All Stores', icon: '📋' },
    { id: 'view-products', label: 'All Products', icon: '🛒' },
];

export default function AdminDashboard() {
    const [active, setActive] = useState('add-store');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const renderContent = () => {
        switch (active) {
            case 'add-store': return <AddStoreForm />;
            case 'add-product': return <AddProductForm />;
            case 'view-stores': return <StoreList />;
            case 'view-products': return <ProductList />;
            default: return null;
        }
    };

    const currentNav = NAV_ITEMS.find((n) => n.id === active);

    return (
        <div className="admin-layout">
            {/* ── Sidebar ─────────────────────────────────────── */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                {/* Logo */}
                <div className="sidebar-logo">
                    <span className="logo-icon">✦</span>
                    <div>
                        <p className="logo-title">yoli.lk</p>
                        <p className="logo-sub">Admin Panel</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    <p className="nav-section-label">MANAGEMENT</p>
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            className={`nav-item ${active === item.id ? 'active' : ''}`}
                            onClick={() => { setActive(item.id); setSidebarOpen(false); }}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                            {active === item.id && <span className="nav-indicator" />}
                        </button>
                    ))}
                </nav>

                {/* Footer */}
                <div className="sidebar-footer">
                    <div className="sidebar-footer-avatar">A</div>
                    <div>
                        <p className="sidebar-footer-name">Admin</p>
                        <p className="sidebar-footer-role">Super Admin</p>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
            )}

            {/* ── Main Content ─────────────────────────────────── */}
            <div className="admin-main">
                {/* Topbar */}
                <header className="admin-topbar">
                    <div className="topbar-left">
                        <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
                            <span /><span /><span />
                        </button>
                        <div>
                            <h1 className="topbar-title">
                                {currentNav?.icon} {currentNav?.label}
                            </h1>
                            <p className="topbar-breadcrumb">Dashboard / {currentNav?.label}</p>
                        </div>
                    </div>
                    <div className="topbar-right">
                        <div className="topbar-badge">
                            <span className="badge-dot" />
                            Live
                        </div>
                        <div className="topbar-avatar">A</div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="admin-content">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}
