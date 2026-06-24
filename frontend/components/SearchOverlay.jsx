import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { fetchProducts } from '../utils/shopify';
import './SearchOverlay.css';

const SearchOverlay = ({ onClose }) => {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef(null);

  // Fetch all products for fast local search
  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });

    // Auto-focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Dismiss on Escape key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Prevent body scrolling when search overlay is open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Live filter results as query changes
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const cleanQuery = query.toLowerCase().trim();
    const filtered = products.filter((p) => {
      const nameMatch = p.name?.toLowerCase().includes(cleanQuery);
      const typeMatch = p.type?.toLowerCase().includes(cleanQuery);
      const handleMatch = p.handle?.toLowerCase().includes(cleanQuery);
      return nameMatch || typeMatch || handleMatch;
    });

    setResults(filtered);
  }, [query, products]);

  // Handle clicking search suggestions
  const handleTagClick = (tag) => {
    setQuery(tag);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Format currency
  const formatPrice = (price) => {
    return '₹' + Math.round(price).toLocaleString('en-IN');
  };

  const trendingProducts = products.slice(0, 3);

  return (
    <div className="search-overlay-backdrop" onClick={onClose}>
      <div 
        className="search-overlay-container animate-slide-down" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Search Field */}
        <div className="search-overlay-header">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} strokeWidth={1.5} />
            <input
              ref={inputRef}
              type="text"
              className="search-input"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button 
                className="search-clear-btn" 
                onClick={() => setQuery('')}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button 
            className="search-close-btn" 
            onClick={onClose} 
            aria-label="Close search overlay"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="search-overlay-body">
          {loading ? (
            <div className="search-loading">
              <div className="search-spinner" />
              <span>Loading products...</span>
            </div>
          ) : query.trim() ? (
            /* Search Results View */
            <div className="search-results-section">
              <div className="search-section-header">
                <h3>Search Results ({results.length})</h3>
              </div>
              
              {results.length > 0 ? (
                <div className="search-results-grid">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.handle}`}
                      className="search-result-card"
                      onClick={onClose}
                    >
                      <div className="search-result-image-wrapper">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="search-result-image" 
                        />
                        {product.discountPercent > 0 && (
                          <span className="search-result-sale-badge">Sale</span>
                        )}
                      </div>
                      <div className="search-result-info">
                        <h4 className="search-result-title">{product.name}</h4>
                        <div className="search-result-pricing">
                          {product.compareAtPrice && product.compareAtPrice > product.price ? (
                            <>
                              <span className="search-result-price-compare">
                                {formatPrice(product.compareAtPrice)}
                              </span>
                              <span className="search-result-price-sale">
                                {formatPrice(product.price)}
                              </span>
                            </>
                          ) : (
                            <span className="search-result-price-regular">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="search-no-results">
                  <p>No products found matching "{query}"</p>
                  <span>Double check your spelling or try another term.</span>
                </div>
              )}
            </div>
          ) : (
            /* Suggestions & Trending Products View */
            <div className="search-suggestions-section">
              {/* Popular Searches */}
              <div className="search-suggestions-block">
                <h3>Popular Searches</h3>
                <div className="search-tags">
                  {['essential', 'goth', 't-shirts', 'hoodies'].map((tag) => (
                    <button
                      key={tag}
                      className="search-tag-btn"
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending Products */}
              {trendingProducts.length > 0 && (
                <div className="search-trending-block">
                  <h3>Trending Right Now</h3>
                  <div className="search-results-grid">
                    {trendingProducts.map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.handle}`}
                        className="search-result-card"
                        onClick={onClose}
                      >
                        <div className="search-result-image-wrapper">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="search-result-image" 
                          />
                        </div>
                        <div className="search-result-info">
                          <h4 className="search-result-title">{product.name}</h4>
                          <div className="search-result-pricing">
                            <span className="search-result-price-regular">
                              {formatPrice(product.price)}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
