import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X, Sun, Moon } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ cartCount, onOpenCart, theme, onToggleTheme }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="site-header">
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <p>Get Flat 10% Off on PREPAID ORDERS | Free Shipping on Orders Above ₹999</p>
      </div>

      {/* Main Navbar */}
      <nav className="navbar">
        <div className="container nav-container">
          {/* Mobile menu toggle */}
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Navigation Links - Left */}
          <div className={`nav-links nav-links-left ${mobileMenuOpen ? 'nav-links--open' : ''}`}>
            <Link to="/">HOME</Link>
            <Link to="/pages/essentials">ESSENTIALS</Link>
            <a href="/#shop">SHOP ALL</a>
            <a href="/#collections">T-SHIRTS</a>
            <a href="/#hoodies">HOODIES</a>
          </div>

          {/* Brand Logo - Center */}
          <div className="nav-brand">
            <Link to="/" className="brand-link">
              <span className="brand-title">DARTH</span>
            </Link>
          </div>

          {/* Actions - Right */}
          <div className="nav-actions">
            <button className="icon-btn" aria-label="Search">
              <Search size={20} strokeWidth={1.5} />
            </button>
            <button className="icon-btn" aria-label="Account">
              <User size={20} strokeWidth={1.5} />
            </button>
            <button className="icon-btn cart-btn" onClick={onOpenCart} aria-label="Cart">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            {/* Theme Toggle */}
            <button
              className="icon-btn theme-toggle"
              onClick={onToggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark'
                ? <Sun size={18} strokeWidth={1.5} />
                : <Moon size={18} strokeWidth={1.5} />
              }
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
