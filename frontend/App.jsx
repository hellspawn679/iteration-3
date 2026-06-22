import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
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
import darthLogo from './logo.png';
import './App.css';

function App() {
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [flyingItems, setFlyingItems] = useState([]);
  const [transitionData, setTransitionData] = useState(null); // null | { x, y, image, path, state }

  useEffect(() => {
    const handleTransition = (e) => {
      const { x, y, image, path } = e.detail;
      setTransitionData({ x, y, image, path, state: 'expanding' });

      const navTimer = setTimeout(() => {
        setTransitionData(prev => prev ? { ...prev, state: 'fading' } : null);
        navigate(path);
      }, 600);

      const finishTimer = setTimeout(() => {
        setTransitionData(null);
      }, 1100);

      return () => {
        clearTimeout(navTimer);
        clearTimeout(finishTimer);
      };
    };

    window.addEventListener('trigger-bubble-transition', handleTransition);
    return () => {
      window.removeEventListener('trigger-bubble-transition', handleTransition);
    };
  }, [navigate]);

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

  const addToCart = async (product, clickEvent) => {
    try {
      await shopifyAddToCart(product.id, 1);
      
      setCartItems(prev => {
        const existing = prev.find(item => item.id === product.id);
        if (existing) {
          return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
        }
        return [...prev, { ...product, quantity: 1 }];
      });

      // Spawn flying animation if click event coordinates are available
      if (clickEvent && clickEvent.clientX) {
        const startX = clickEvent.clientX;
        const startY = clickEvent.clientY;

        // Find target cart button in the header
        const cartBtn = document.querySelector('.cart-btn');
        let targetX = window.innerWidth - 80;
        let targetY = 30;
        if (cartBtn) {
          const rect = cartBtn.getBoundingClientRect();
          targetX = rect.left + rect.width / 2;
          targetY = rect.top + rect.height / 2;
        }

        const newId = Date.now();
        setFlyingItems(prev => [...prev, {
          id: newId,
          startX,
          startY,
          targetX,
          targetY,
          image: product.image
        }]);

        // Cleanup after animation completes
        setTimeout(() => {
          setFlyingItems(prev => prev.filter(item => item.id !== newId));
        }, 800);
      }
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

      {/* Flying Cart Items Overlay */}
      {flyingItems.map(item => (
        <div
          key={item.id}
          className="flying-cart-item"
          style={{
            '--start-x': `${item.startX}px`,
            '--start-y': `${item.startY}px`,
            '--target-x': `${item.targetX}px`,
            '--target-y': `${item.targetY}px`,
            backgroundImage: `url(${item.image})`
          }}
        />
      ))}

      {/* Dynamic page transition circular wipe overlay */}
      {transitionData && (
        <div 
          className={`bubble-transition-overlay ${transitionData.state === 'fading' ? 'fade-out' : ''}`}
          style={{
            '--spawn-x': `${transitionData.x}px`,
            '--spawn-y': `${transitionData.y}px`
          }}
        >
          <div className="transition-logo-container">
            <img src={darthLogo} alt="Darth Logo" className="transition-logo" />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
