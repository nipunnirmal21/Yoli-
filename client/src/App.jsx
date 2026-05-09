import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import ShopPage from './pages/ShopPage';
import DemoNotice from './components/DemoNotice';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
    return (
        <Routes>
            {/* ── Admin (full-screen, no Navbar/Footer) ── */}
            <Route path="/admin/*" element={<AdminDashboard />} />

            {/* ── Public site ── */}
            <Route path="*" element={
                <div className="min-h-screen flex flex-col bg-muted">
                    <DemoNotice />
                    <Navbar />
                    <CartDrawer />
                    <main className="flex-1">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/products" element={<Products />} />
                            <Route path="/products/:id" element={<ProductDetail />} />
                            <Route path="/shop/:slug" element={<ShopPage />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            } />
        </Routes>
    );
}
