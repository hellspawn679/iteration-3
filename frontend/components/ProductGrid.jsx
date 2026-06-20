import React from 'react';
import { Link } from 'react-router-dom';
import './ProductGrid.css';

const formatPrice = (price) => {
  return '₹' + Math.round(price).toLocaleString('en-IN');
};

const ProductGrid = ({ products, onAddToCart }) => {
  return (
    <section id="shop" className="products-section">
      <div className="container">
        <div className="product-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <Link to={`/products/${product.handle}`} className="product-card__link">
                <div className="product-card__image-wrapper">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="product-card__image product-card__image--primary" 
                    loading="lazy"
                  />
                  {product.secondaryImage && (
                    <img 
                      src={product.secondaryImage} 
                      alt={`${product.name} alternate`} 
                      className="product-card__image product-card__image--secondary" 
                      loading="lazy"
                    />
                  )}
                  
                  {product.discountPercent && (
                    <div className="product-card__badge product-card__badge--sale">
                      Sale
                    </div>
                  )}
                  
                  {product.status === 'SOLD_OUT' && (
                    <div className="product-card__badge product-card__badge--soldout">
                      Sold Out
                    </div>
                  )}
                </div>

                <div className="product-card__info">
                  <h3 className="product-card__title">{product.name}</h3>
                  
                  <div className="product-card__price">
                    {product.compareAtPrice && product.compareAtPrice > product.price ? (
                      <>
                        <span className="product-card__price--compare">
                          {formatPrice(product.compareAtPrice)}
                        </span>
                        <span className="product-card__price--sale">
                          {formatPrice(product.price)}
                        </span>
                        <span className="product-card__price--savings">
                          Save {product.discountPercent}%
                        </span>
                      </>
                    ) : (
                      <span className="product-card__price--regular">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
