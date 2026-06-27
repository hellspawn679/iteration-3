import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCollectionProducts } from '../utils/shopify';
import ProductCard from './ProductCard';
import CollectionBubbles from './CollectionBubbles';
import './EssentialsPage.css';

const EssentialsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const collectionHandle = 'essential-t-shirts-plain-color';

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetchCollectionProducts(collectionHandle).then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="essentials-page animate-fade-in">
      {/* Category Bubbles Navigation */}
      <CollectionBubbles activeHandle={collectionHandle} />

      {/* SECTION 1: Two-Image Grid Block */}
      <section className="essentials-grid-banner">
        <div className="container-full">
          <div className="essentials-grid-row">
            <div className="essentials-grid-col">
              <img 
                src="https://pronk.in/cdn/shop/files/9_803e2367-56e0-446d-a80e-1ca9ba9bc1a4.png?v=1770987176&width=1200" 
                alt="PRONK ESSENTIALS Graphic 1" 
                className="essentials-banner-img"
                loading="lazy"
              />
            </div>
            <div className="essentials-grid-col">
              <img 
                src="https://pronk.in/cdn/shop/files/4_b583655b-7a20-4f9d-a930-9936f2008c7b.png?v=1770987177&width=1200" 
                alt="PRONK ESSENTIALS Graphic 2" 
                className="essentials-banner-img"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Slideshow Hero Banner (Square Aspect Ratio) */}
      <section className="essentials-hero">
        <Link to={`/${collectionHandle}`} className="essentials-hero__link-wrapper">
          <div className="essentials-hero__image-container">
            <img 
              src="https://pronk.in/cdn/shop/files/8_3.jpg?v=1770987175&width=2400" 
              alt="Shop Essentials Collection Banner" 
              className="essentials-hero__bg-img"
              loading="lazy"
            />
            {/* CTA Overlay */}
            <div className="essentials-hero__overlay">
              <span className="essentials-hero__cta-btn btn-primary">
                SHOP NOW
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* SECTION 3: Featured Collection Product Grid */}
      <section className="essentials-collection-section">
        <div className="container">
          <div className="essentials-section-header">
            <h2 className="essentials-section-title">ESSENTIALS COLLECTION</h2>
            <p className="essentials-section-subtitle">Premium quality plain color oversized apparel</p>
          </div>

          {loading ? (
            <div className="essentials-loading">
              <div className="essentials-loading__spinner"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="essentials-empty">
              <p>No products found in the essentials collection.</p>
            </div>
          ) : (
            <div className="essentials-product-grid">
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

export default EssentialsPage;
