import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCollections } from '../utils/shopify';
import './CollectionBubbles.css';

const CollectionBubbleItem = ({ col, idx, activeHandle, handleBubbleClick }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    if (col.images && col.images.length > 1) {
      // Cycle every 3.5 seconds, staggered by bubble index to create a cascaded cascade slide!
      const interval = setInterval(() => {
        setCurrentImgIndex((prev) => (prev + 1) % col.images.length);
      }, 3500 + idx * 250);
      return () => clearInterval(interval);
    }
  }, [col.images, idx]);

  const activeImage = col.images && col.images.length > 0 
    ? col.images[currentImgIndex] 
    : col.image;

  const isEssential = col.handle === 'essential-t-shirts-plain-color';
  const isUrban = col.handle === 'oversized-apparel';
  
  let linkTo = `/${col.handle}`;
  if (isEssential) linkTo = '/pages/essentials';
  if (isUrban) linkTo = '/pages/urban-style';
  
  const isActive = 
    activeHandle === col.handle || 
    (isEssential && (activeHandle === 'essentials' || activeHandle === 'essential-t-shirts-plain-color')) ||
    (isUrban && (activeHandle === 'urban-style' || activeHandle === 'oversized-apparel'));

  return (
    <Link 
      to={linkTo} 
      className={`collection-bubble-item ${isActive ? 'is-active' : ''}`}
      style={{ animationDelay: `${idx * 80}ms` }}
      onClick={(e) => handleBubbleClick(e, linkTo, activeImage)}
    >
      <div className="collection-bubble-img-wrapper">
        <img 
          key={activeImage} // Re-mounting triggers CSS keyframe animation fade-in transition
          src={activeImage} 
          alt={col.title} 
          loading="lazy" 
          className="collection-bubble-img"
        />
      </div>
      <span className="collection-bubble-title">{col.title}</span>
    </Link>
  );
};

const CollectionBubbles = ({ activeHandle }) => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollections().then(data => {
      const filtered = data.filter(col => {
        const handle = col.handle.toLowerCase();
        return handle !== 'best-sellers' && handle !== 'best-seller';
      });
      setCollections(filtered);
      setLoading(false);
    });
  }, []);

  if (loading || collections.length === 0) {
    return null;
  }

  const handleBubbleClick = (e, linkTo, colImage) => {
    e.preventDefault();
    const wrapper = e.currentTarget.querySelector('.collection-bubble-img-wrapper');
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const event = new CustomEvent('trigger-bubble-transition', {
      detail: { x, y, image: colImage, path: linkTo }
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="collection-bubbles-section">
      <div className="collection-bubbles-container">
        {collections.map((col, idx) => (
          <CollectionBubbleItem
            key={col.id}
            col={col}
            idx={idx}
            activeHandle={activeHandle}
            handleBubbleClick={handleBubbleClick}
          />
        ))}
      </div>
    </div>
  );
};

export default CollectionBubbles;
