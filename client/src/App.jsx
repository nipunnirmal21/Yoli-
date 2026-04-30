import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import ShopPage from './pages/ShopPage';
import LaunchOverlay from './components/LaunchOverlay';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

export default function App() {
    const [isLaunched, setIsLaunched] = useState(() => {
        return sessionStorage.getItem('yoli_launched') === 'true';
    });

    const handleLaunch = () => {
        setIsLaunched(true);
        sessionStorage.setItem('yoli_launched', 'true');
    };

    return (
        <div className="min-h-screen flex flex-col bg-muted">
            <AnimatePresence>
                {!isLaunched && (
                    <LaunchOverlay onLaunch={handleLaunch} />
                )}
            </AnimatePresence>

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
    );
}
