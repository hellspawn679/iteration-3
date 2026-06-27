import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const formatPrice = (price) => {
  return '₹' + Math.round(price).toLocaleString('en-IN');
};

const ProductCard = ({ product, collectionHandle = 'products', eager = false }) => {
  const productLink = `/${collectionHandle}/${product.handle}`;
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolledPast, setIsScrolledPast] = useState(false);

  // Fade-in on scroll into view (existing behavior)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -40px 0px'
    });

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Swap to secondary image when card scrolls up to touch the header on mobile.
  // Uses a narrow trigger zone at the very top of the viewport (header area).
  useEffect(() => {
    if (!product.secondaryImage) return;

    // Only enable scroll-based swap on mobile mode (<= 768px)
    if (window.innerWidth > 768) return;

    // The trigger zone is a thin strip at the top of the viewport.
    // Top: 0px, Bottom: -80% means only the top portion is active.
    // The card's top edge must reach this zone (near the sticky header) to trigger.
    const scrollObserver = new IntersectionObserver(([entry]) => {
      setIsScrolledPast(entry.isIntersecting);
    }, {
      threshold: 0.0,
      rootMargin: '0px 0px -80% 0px'
    });

    if (cardRef.current) {
      scrollObserver.observe(cardRef.current);
    }

    return () => {
      scrollObserver.disconnect();
    };
  }, [product.secondaryImage]);

  return (
    <div 
      ref={cardRef} 
      className={`product-card ${isVisible ? 'is-visible' : 'is-hidden'}${isScrolledPast ? ' is-scrolled-past' : ''}`}
    >
      <Link to={productLink} className="product-card__link">
        <div className="product-card__image-wrapper">
          <img 
            src={product.image} 
            alt={product.name} 
            className="product-card__image product-card__image--primary" 
            loading={eager ? 'eager' : 'lazy'}
            {...(eager ? { fetchPriority: 'high' } : {})}
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
  );
};

export default ProductCard;
