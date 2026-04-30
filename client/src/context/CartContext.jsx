import { createContext, useContext, useState, useCallback } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const addToCart = useCallback((product) => {
        setCartItems((prev) => {
            const existing = prev.find((i) => i._id === product._id);
            if (existing) {
                toast.success(`${product.name} quantity updated`);
                return prev.map((i) =>
                    i._id === product._id ? { ...i, qty: i.qty + 1 } : i
                );
            }
            toast.success(`${product.name} added to cart`);
            return [...prev, { ...product, qty: 1 }];
        });
    }, []);

    const removeFromCart = useCallback((id) => {
        setCartItems((prev) => prev.filter((i) => i._id !== id));
    }, []);

    const updateQty = useCallback((id, qty) => {
        if (qty < 1) return;
        setCartItems((prev) =>
            prev.map((i) => (i._id === id ? { ...i, qty } : i))
        );
    }, []);

    const clearCart = useCallback(() => setCartItems([]), []);

    const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
    const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    return (
        <CartContext.Provider
            value={{
                cartItems, cartTotal, cartCount,
                isCartOpen, openCart, closeCart,
                addToCart, removeFromCart, updateQty, clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used inside CartProvider');
    return ctx;
};
