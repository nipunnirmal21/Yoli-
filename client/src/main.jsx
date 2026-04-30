import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { CartProvider } from './context/CartContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <CartProvider>
                <App />
                <Toaster
                    position="bottom-right"
                    toastOptions={{
                        style: {
                            background: '#ffffff',
                            color: '#1f2937',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '13px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        },
                        success: {
                            iconTheme: { primary: '#f85606', secondary: '#ffffff' },
                        },
                    }}
                />
            </CartProvider>
        </BrowserRouter>
    </React.StrictMode>
);
