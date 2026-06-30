import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Sun, Moon, Menu, X } from 'lucide-react';
import logoDark from '../logo_dark.png';
import logoWhite from '../logo_white.png';
import './Navbar.css';

const Navbar = ({ cartCount, onOpenCart, theme, onOpenSearch, isHome }) => {
  const [animateCart, setAnimateCart] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (cartCount === 0) return;
    setAnimateCart(true);
    const timer = setTimeout(() => setAnimateCart(false), 500);
    return () => clearTimeout(timer);
  }, [cartCount]);

  return (
    <header className={`site-header ${isHome ? 'site-header--transparent' : ''}`}>
      {/* Main Navbar */}
      <nav className={`navbar ${isHome ? 'navbar--transparent' : ''}`}>
        <div className="container nav-container">
          {/* Mobile Menu Button - Left on mobile */}
          <button 
            className="icon-btn mobile-menu-btn" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>

          {/* Brand Logo - Left */}
          <div className="nav-brand">
            <Link to="/" className="brand-link">
              <img 
                src={isHome || theme === 'dark' ? logoWhite : logoDark} 
                alt="DARTH" 
                className="nav-logo" 
              />
            </Link>
          </div>

          {/* Nav Links - Center on desktop, overlay drawer on mobile */}
          <div className={`nav-links ${isMenuOpen ? 'nav-links--open' : ''}`}>
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/pages/urban-style" onClick={() => setIsMenuOpen(false)}>Urban Style</Link>
            <Link to="/pages/essentials" onClick={() => setIsMenuOpen(false)}>Essentials</Link>
          </div>

          {/* Actions - Right */}
          <div className="nav-actions">
            <button className="icon-btn" onClick={onOpenSearch} aria-label="Search">
              <Search size={20} strokeWidth={1.5} />
            </button>
            <button className="icon-btn cart-btn" onClick={onOpenCart} aria-label="Cart">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className={`cart-badge ${animateCart ? 'bump' : ''}`}>
                  {cartCount}
                </span>
              )}
            </button>

          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;


