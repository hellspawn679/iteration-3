import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

      {/* SECTION 1: Two-Image Grid Block */}
      <section className="goth-grid-banner">
        <div className="container-full">
          <div className="goth-grid-row">
            <div className="goth-grid-col">
              <img 
                src="https://cdn.shopify.com/s/files/1/0806/1199/9974/files/Gemini_Generated_Image_icz2jkicz2jkicz2_edited.png?v=1781904436" 
                alt="DARTH GOTH Graphic Front" 
                className="goth-banner-img"
                loading="lazy"
              />
            </div>
            <div className="goth-grid-col">
              <img 
                src="https://cdn.shopify.com/s/files/1/0806/1199/9974/files/Gemini_Generated_Image_lvdw7lvdw7lvdw7l_edited.png?v=1781904514" 
                alt="DARTH GOTH Graphic Back" 
                className="goth-banner-img"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Slideshow Hero Banner (Square/Featured Aspect Ratio) */}
      <section className="goth-hero">
        <Link to={`/${collectionHandle}`} className="goth-hero__link-wrapper">
          <div className="goth-hero__image-container">
            <img 
              src="https://cdn.shopify.com/s/files/1/0806/1199/9974/files/Gemini_Generated_Image_tvpgihtvpgihtvpg.png?v=1781902032" 
              alt="Shop Goth Collection Banner" 
              className="goth-hero__bg-img"
              loading="lazy"
            />
            {/* CTA Overlay */}
            <div className="goth-hero__overlay">
              <span className="goth-hero__cta-btn btn-primary">
                SHOP NOW
              </span>
            </div>
          </div>
        </Link>
      </section>

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
              {products.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  collectionHandle={collectionHandle}
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
