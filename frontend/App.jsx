import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import CartModal from './components/CartModal';
import ProductDetail from './components/ProductDetail';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import EssentialsPage from './components/EssentialsPage';
import CollectionDetail from './components/CollectionDetail';
import CollectionBubbles from './components/CollectionBubbles';
import GothPage from './components/GothPage';

import { fetchProducts, addToCart as shopifyAddToCart } from './utils/shopify';
import './App.css';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Dark mode is default — read from localStorage, fallback to 'dark'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('darth-theme') || 'dark';
  });

  // Apply theme attribute to <html> whenever theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('darth-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    fetchProducts().then(data => {
      setProducts(data);
      setLoadingProducts(false);
    });
  }, []);

  const addToCart = async (product) => {
    try {
      await shopifyAddToCart(product.id, 1);
      
      setCartItems(prev => {
        const existing = prev.find(item => item.id === product.id);
        if (existing) {
          return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
        }
        return [...prev, { ...product, quantity: 1 }];
      });
      setIsCartOpen(true);
    } catch (err) {
      console.error('Error adding to Shopify cart:', err);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item));
  };

  return (
    <div className="app-container">
      <Navbar
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      
      <Routes>
        <Route path="/" element={
          <main>
            <CollectionBubbles />
            {loadingProducts ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                Loading products...
              </div>
            ) : (
              <ProductGrid products={products} onAddToCart={addToCart} />
            )}
          </main>
        } />
        
        <Route path="/pages/essentials" element={<EssentialsPage />} />
        <Route path="/pages/goth" element={<GothPage />} />
        <Route path="/pages/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/pages/terms-of-service" element={<TermsOfService />} />
        
        {/* Dynamic collection and product routes matching Shopify's URL structures */}
        <Route path="/:collection" element={<CollectionDetail />} />
        <Route path="/:collection/:handle" element={<ProductDetail onAddToCart={addToCart} />} />
      </Routes>

      <Footer />

      {isCartOpen && (
        <CartModal 
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity}
        />
      )}
    </div>
  );
}

export default App;
