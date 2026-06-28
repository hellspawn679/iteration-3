import React, { useState, useEffect } from 'react';
import { fetchCollectionProducts } from '../utils/shopify';
import ProductCard from './ProductCard';
import CollectionBubbles from './CollectionBubbles';
import './UrbanStylePage.css';

const UrbanStylePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const collectionHandle = 'oversized-apparel';

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetchCollectionProducts(collectionHandle).then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="urban-page animate-fade-in">
      {/* Category Bubbles Navigation */}
      <CollectionBubbles activeHandle="urban-style" />

      {/* SECTION 3: Featured Collection Product Grid */}
      <section className="urban-collection-section">
        <div className="container">
          <div className="urban-section-header">
            <h2 className="urban-section-title">URBAN STYLE</h2>
            <p className="urban-section-subtitle">Premium urban style inspired streetwear & oversized tees</p>
          </div>

          {loading ? (
            <div className="urban-loading">
              <div className="urban-loading__spinner"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="urban-empty">
              <p>No products found in the urban style collection.</p>
            </div>
          ) : (
            <div className="urban-product-grid">
              {products.map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  collectionHandle={collectionHandle}
                  eager={index < 4}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default UrbanStylePage;
