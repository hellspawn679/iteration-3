import React, { useState, useEffect } from 'react';
import { fetchCollectionProducts } from '../utils/shopify';
import ProductCard from './ProductCard';
import CollectionBubbles from './CollectionBubbles';
import './GothPage.css';

const GothPage = () => {
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
    <div className="goth-page animate-fade-in">
      {/* Category Bubbles Navigation */}
      <CollectionBubbles activeHandle="goth" />

      {/* SECTION 3: Featured Collection Product Grid */}
      <section className="goth-collection-section">
        <div className="container">
          <div className="goth-section-header">
            <h2 className="goth-section-title">GOTH COLLECTION</h2>
            <p className="goth-section-subtitle">Premium gothic inspired streetwear & oversized tees</p>
          </div>

          {loading ? (
            <div className="goth-loading">
              <div className="goth-loading__spinner"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="goth-empty">
              <p>No products found in the goth collection.</p>
            </div>
          ) : (
            <div className="goth-product-grid">
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

export default GothPage;
