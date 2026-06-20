import React, { useState } from 'react';
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ cartCount, onOpenCart }) => {
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
            <a href="/">HOME</a>
            <a href="/#shop">SHOP ALL</a>
            <a href="/#collections">T-SHIRTS</a>
            <a href="/#hoodies">HOODIES</a>
          </div>

          {/* Brand Logo - Center */}
          <div className="nav-brand">
            <a href="/" className="brand-link">
              <span className="brand-title">DARTH</span>
            </a>
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
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
