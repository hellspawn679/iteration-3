import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import CartModal from './components/CartModal';
import ProductDetail from './components/ProductDetail';
import EssentialsPage from './components/EssentialsPage';
import CollectionDetail from './components/CollectionDetail';
import CollectionBubbles from './components/CollectionBubbles';
import UrbanStylePage from './components/UrbanStylePage';
import SearchOverlay from './components/SearchOverlay';
import Home from './components/Home';

const announcements = [
  "★ GET FLAT 10% OFF ON ALL PREPAID ORDERS ★",
  "★ FREE SHIPPING ON ORDERS ABOVE ₹999 ★",
  "★ NEW ARRIVALS: GOTHIC STREETWEAR OUT NOW ★"
];

const AnnouncementBar = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="announcement-bar">
      <div className="announcement-bar__text">
        {announcements[index]}
      </div>
    </div>
  );
};

const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./components/TermsOfService'));

import { fetchProducts, fetchCollections, addToCart as shopifyAddToCart } from './utils/shopify';
import logoDark from './logo_dark.png';
import logoWhite from './logo_white.png';
import './App.css';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [flyingItems, setFlyingItems] = useState([]);
  const [transitionData, setTransitionData] = useState(null); // null | { x, y, image, path, state }
  const navTimerRef = React.useRef(null);
  const finishTimerRef = React.useRef(null);

  useEffect(() => {
    const handleTransition = (e) => {
      const { x, y, image, path } = e.detail;

      // Clear any active transition timeouts to prevent overlapping states
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current);

      setTransitionData({ x, y, image, path, state: 'expanding' });

      // Trigger navigation after the 350ms clip-path circle expansion settles
      navTimerRef.current = setTimeout(() => {
        setTransitionData(prev => prev ? { ...prev, state: 'fading' } : null);
        navigate(path);
      }, 350);

      // Finish transition when the 300ms fade-out finishes (350ms + 300ms = 650ms)
      finishTimerRef.current = setTimeout(() => {
        setTransitionData(null);
      }, 650);
    };

    window.addEventListener('trigger-bubble-transition', handleTransition);
    return () => {
      window.removeEventListener('trigger-bubble-transition', handleTransition);
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    };
  }, [navigate]);

  // Set theme dynamically based on route: Home is light, all other pages are dark
  const theme = isHome ? 'light' : 'dark';

  // Apply theme attribute to <html> whenever theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    fetchProducts().then(data => {
      setProducts(data);
      setLoadingProducts(false);
    });
    fetchCollections(); // Prefetch collections so they are cached in memory early
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
      <AnnouncementBar />
      <Navbar
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        theme={theme}
        onOpenSearch={() => setIsSearchOpen(true)}
        isHome={isHome}
      />
      
      <Routes>
        <Route path="/" element={
          loadingProducts ? (
            <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)' }}>
              Loading products...
            </div>
          ) : (
            <Home products={products} onAddToCart={addToCart} />
          )
        } />
        
        <Route path="/pages/essentials" element={<EssentialsPage />} />
        <Route path="/pages/urban-style" element={<UrbanStylePage />} />
        <Route path="/pages/privacy-policy" element={
          <Suspense fallback={
            <div style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)' }}>
              Loading...
            </div>
          }>
            <PrivacyPolicy />
          </Suspense>
        } />
        <Route path="/pages/terms-of-service" element={
          <Suspense fallback={
            <div style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)' }}>
              Loading...
            </div>
          }>
            <TermsOfService />
          </Suspense>
        } />
        
        {/* Dynamic collection and product routes matching Shopify's URL structures */}
        <Route path="/:collection" element={<CollectionDetail />} />
        <Route path="/:collection/:handle" element={<ProductDetail onAddToCart={addToCart} />} />
      </Routes>

      <Footer />

      {isSearchOpen && (
        <SearchOverlay onClose={() => setIsSearchOpen(false)} />
      )}

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
            <img src={theme === 'dark' ? logoWhite : logoDark} alt="Darth Logo" className="transition-logo" />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
