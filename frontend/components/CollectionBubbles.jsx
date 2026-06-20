import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCollections } from '../utils/shopify';
import './CollectionBubbles.css';

const CollectionBubbles = ({ activeHandle }) => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollections().then(data => {
      setCollections(data);
      setLoading(false);
    });
  }, []);

  if (loading || collections.length === 0) {
    return null;
  }

  return (
    <div className="collection-bubbles-section">
      <div className="collection-bubbles-container">
        {collections.map(col => {
          const isEssential = col.handle === 'essential-t-shirts-plain-color';
          const isGoth = col.handle === 'oversized-apparel';
          
          let linkTo = `/${col.handle}`;
          if (isEssential) linkTo = '/pages/essentials';
          if (isGoth) linkTo = '/pages/goth';
          
          const isActive = 
            activeHandle === col.handle || 
            (isEssential && (activeHandle === 'essentials' || activeHandle === 'essential-t-shirts-plain-color')) ||
            (isGoth && (activeHandle === 'goth' || activeHandle === 'oversized-apparel'));

          return (
            <Link 
              key={col.id} 
              to={linkTo} 
              className={`collection-bubble-item ${isActive ? 'is-active' : ''}`}
            >
              <div className="collection-bubble-img-wrapper">
                <img 
                  src={col.image} 
                  alt={col.title} 
                  loading="lazy" 
                  className="collection-bubble-img"
                />
              </div>
              <span className="collection-bubble-title">{col.title}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CollectionBubbles;
