import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, User, Sun, Moon } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ cartCount, onOpenCart, theme, onToggleTheme }) => {
  return (
    <header className="site-header">
      {/* Main Navbar */}
      <nav className="navbar">
        <div className="container nav-container">
          {/* Brand Logo - Left */}
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
