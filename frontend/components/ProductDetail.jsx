import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronLeft, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import { fetchProduct } from '../utils/shopify';
import './ProductDetail.css';

const formatPrice = (price) => {
  return '₹' + Math.round(price).toLocaleString('en-IN');
};

const ProductDetail = ({ onAddToCart }) => {
  const { handle } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [activeImage, setActiveImage] = useState('');
  const [selectedOptions, setSelectedOptions] = useState({});
  const [currentVariant, setCurrentVariant] = useState(null);
  const [cartState, setCartState] = useState('idle'); // 'idle' | 'animating'

  // Derive displayImages at the top so hooks can safely access it
  const selectedColor = (product && product.colorOptionIdx > 0)
    ? selectedOptions[`option${product.colorOptionIdx}`]
    : null;
  const colorSpecificImages = selectedColor && product?.colorImageMap?.[selectedColor];
  const displayImages = product
    ? ((colorSpecificImages && colorSpecificImages.length > 0) ? colorSpecificImages : product.images)
    : [];

  const [activeIndex, setActiveIndex] = useState(0);
  const galleryRef = React.useRef(null);

  // Sync scrolling position with external state changes (like variant color changes)
  useEffect(() => {
    if (displayImages.length > 0 && activeImage) {
      const idx = displayImages.indexOf(activeImage);
      if (idx !== -1 && idx !== activeIndex) {
        setActiveIndex(idx);
        if (galleryRef.current) {
          const currentScrollIndex = Math.round(galleryRef.current.scrollLeft / galleryRef.current.clientWidth);
          if (currentScrollIndex !== idx) {
            galleryRef.current.scrollTo({
              left: idx * galleryRef.current.clientWidth,
              behavior: 'auto'
            });
          }
        }
      }
    }
  }, [activeImage, displayImages, activeIndex]);

  const handleScroll = () => {
    if (galleryRef.current) {
      const { scrollLeft, clientWidth } = galleryRef.current;
      if (clientWidth > 0) {
        const index = Math.round(scrollLeft / clientWidth);
        if (index !== activeIndex && index >= 0 && index < displayImages.length) {
          setActiveIndex(index);
          setActiveImage(displayImages[index]);
        }
      }
    }
  };

  const handleDotClick = (idx) => {
    setActiveImage(displayImages[idx]);
    setActiveIndex(idx);
    if (galleryRef.current) {
      galleryRef.current.scrollTo({
        left: idx * galleryRef.current.clientWidth,
        behavior: 'smooth'
      });
    }
  };

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleImageClick = (img) => {
    setLightboxImage(img);
    setIsLightboxOpen(true);
    setIsZoomed(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
        setIsZoomed(false);
      }
    };
    if (isLightboxOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen]);

  useEffect(() => {
    let timer;
    if (cartState === 'animating') {
      timer = setTimeout(() => {
        setCartState('idle');
      }, 1800);
    }
    return () => clearTimeout(timer);
  }, [cartState]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetchProduct(handle).then(data => {
      setProduct(data);
      if (data) {
        setActiveImage(data.images.length > 0 ? data.images[0] : '');
        
        const defaultOptions = {};
        if (data.options) {
          data.options.forEach((opt, idx) => {
            defaultOptions[`option${idx + 1}`] = opt.values[0];
          });
        }
        setSelectedOptions(defaultOptions);
        
        const variant = data.variants.find(v => 
          data.options.every((opt, idx) => v.options[idx] === defaultOptions[`option${idx + 1}`])
        );
        setCurrentVariant(variant || data.variants[0]);
      }
      setLoading(false);
    });
  }, [handle]);

  const handleOptionChange = (optionIndex, value) => {
    const newOptions = { ...selectedOptions, [`option${optionIndex}`]: value };
    setSelectedOptions(newOptions);

    if (product && product.variants) {
      // If the changed option is the Color option, switch gallery to that colour's images
      if (product.colorOptionIdx > 0 && optionIndex === product.colorOptionIdx) {
        const colorImgs = product.colorImageMap?.[value];
        if (colorImgs && colorImgs.length > 0) {
          setActiveImage(colorImgs[0]);
        }
      }

      const variant = product.variants.find(v =>
        product.options.every((opt, idx) => v.options[idx] === newOptions[`option${idx + 1}`])
      );
      if (variant) {
        setCurrentVariant(variant);
        // Only override activeImage from featured_image if no color-map image was set above
        if (variant.featured_image && !(product.colorOptionIdx > 0 && optionIndex === product.colorOptionIdx)) {
          setActiveImage(variant.featured_image);
        }
      } else {
        setCurrentVariant(null);
      }
    }
  };

  const handleAddToCart = (e) => {
    if (cartState !== 'idle') return;
    if (currentVariant && currentVariant.available) {
      setCartState('animating');
      onAddToCart({
        id: currentVariant.id,
        name: `${product.name} - ${currentVariant.title}`,
        price: currentVariant.price,
        image: currentVariant.featured_image || activeImage,
        handle: product.handle
      }, e);
    }
  };

  if (loading) {
    return (
      <div className="pdp-loading">
        <div className="pdp-loading__spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pdp-not-found">
        <h2>Product not found</h2>
        <p>The product you're looking for doesn't exist or has been removed.</p>
        <button className="btn-primary" onClick={() => navigate('/')}>
          Back to Shop
        </button>
      </div>
    );
  }

  const isAvailable = currentVariant ? currentVariant.available : false;
  const currentPrice = currentVariant ? currentVariant.price : product.price;
  const currentCompareAt = currentVariant ? currentVariant.compareAtPrice : product.compareAtPrice;
  const currentDiscount = currentVariant ? currentVariant.discountPercent : product.discountPercent;

  // displayImages is derived at the top of the component

  return (
    <section className="pdp animate-fade-in">
      <div className="container">
        
        {/* Breadcrumb */}
        <nav className="pdp-breadcrumb">
          <button className="pdp-breadcrumb__back" onClick={() => navigate('/')}>
            <ChevronLeft size={14} />
            <span>Back to collection</span>
          </button>
        </nav>

        <div className="pdp-layout">
          {/* Gallery */}
          <div className="pdp-gallery">
                      {/* Thumbnails on left */}
            {displayImages && displayImages.length > 1 && (
              <div className="pdp-gallery__thumbs">
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    className={`pdp-gallery__thumb ${activeIndex === idx ? 'pdp-gallery__thumb--active' : ''}`}
                    onClick={() => handleDotClick(idx)}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
            
            {/* Main image carousel wrapper */}
            <div className="pdp-gallery__main">
              <div 
                className="pdp-gallery__slides"
                ref={galleryRef}
                onScroll={handleScroll}
              >
                {displayImages.map((img, idx) => (
                  <div className="pdp-gallery__slide" key={idx}>
                    <img 
                      src={img} 
                      alt={`${product.name} ${idx + 1}`} 
                      className="pdp-gallery__main-img pdp-gallery__main-img--clickable" 
                      onClick={() => handleImageClick(img)}
                    />
                  </div>
                ))}
              </div>
              
              {currentDiscount && (
                <div className="pdp-gallery__badge">Sale</div>
              )}

              {/* Mobile Swipe Pagination Dots */}
              {displayImages && displayImages.length > 1 && (
                <div className="pdp-gallery__dots">
                  {displayImages.map((img, idx) => (
                    <span
                      key={idx}
                      className={`pdp-gallery__dot ${activeIndex === idx ? 'pdp-gallery__dot--active' : ''}`}
                      onClick={() => handleDotClick(idx)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="pdp-info">
            <h1 className="pdp-info__title">{product.name}</h1>
            
            {/* Pricing */}
            <div className="pdp-info__pricing">
              {currentCompareAt && currentCompareAt > currentPrice ? (
                <>
                  <span className="pdp-info__price--compare">{formatPrice(currentCompareAt)}</span>
                  <span className="pdp-info__price--sale">{formatPrice(currentPrice)}</span>
                  <span className="pdp-info__price--savings">Save {currentDiscount}%</span>
                </>
              ) : (
                <span className="pdp-info__price">{formatPrice(currentPrice)}</span>
              )}
            </div>

            <p className="pdp-info__tax-note">Tax included. Shipping calculated at checkout.</p>

            {/* Variant Options */}
            {product.options && product.options.map((opt, optIdx) => (
              <div key={opt.name} className="pdp-option">
                <div className="pdp-option__label">
                  {opt.name}: <span className="pdp-option__selected">{selectedOptions[`option${optIdx + 1}`]}</span>
                </div>
                <div className="pdp-option__values">
                  {opt.values.map(val => (
                    <button
                      key={val}
                      className={`pdp-option__btn ${selectedOptions[`option${optIdx + 1}`] === val ? 'pdp-option__btn--active' : ''}`}
                      onClick={() => handleOptionChange(optIdx + 1, val)}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Add to Cart */}
            <div className="pdp-actions">
              <button 
                className={`pdp-actions__atc ${cartState === 'animating' ? 'animate' : ''}`}
                onClick={handleAddToCart}
                disabled={!isAvailable || cartState === 'animating'}
              >
                <div className="particle p1"></div>
                <div className="particle p2"></div>
                <div className="particle p3"></div>

                <span className="cart-icon">
                  <ShoppingBag size={18} />
                </span>

                <span className="btn-text">
                  {!isAvailable ? 'Sold Out' : 'Add to Cart'}
                </span>
              </button>
            </div>

            {/* Description */}
            {product.description && (
              <div className="pdp-description">
                <h3 className="pdp-description__title">Description</h3>
                <div className="pdp-description__content" dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
            )}

            {/* Trust badges */}
            <div className="pdp-trust">
              <div className="pdp-trust__item">
                <span className="pdp-trust__icon">
                  <Truck size={16} strokeWidth={1.5} />
                </span>
                <span>Free Shipping on ₹999+</span>
              </div>
              <div className="pdp-trust__item">
                <span className="pdp-trust__icon">
                  <RotateCcw size={16} strokeWidth={1.5} />
                </span>
                <span>Easy Returns & Exchange</span>
              </div>
              <div className="pdp-trust__item">
                <span className="pdp-trust__icon">
                  <ShieldCheck size={16} strokeWidth={1.5} />
                </span>
                <span>Secure Payments</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isLightboxOpen && (
        <div 
          className="pdp-lightbox"
          onClick={() => {
            setIsLightboxOpen(false);
            setIsZoomed(false);
          }}
        >
          <button 
            className="pdp-lightbox__close"
            onClick={() => {
              setIsLightboxOpen(false);
              setIsZoomed(false);
            }}
            aria-label="Close Preview"
          >
            &times;
          </button>
          
          <div 
            className="pdp-lightbox__content"
          >
            <div 
              className="pdp-lightbox__img-wrap"
              onMouseMove={handleMouseMove}
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(!isZoomed);
              }}
              style={{
                '--zoom-x': `${zoomPos.x}%`,
                '--zoom-y': `${zoomPos.y}%`
              }}
            >
              <img 
                src={lightboxImage} 
                alt="Product Preview Zoomed" 
                className={`pdp-lightbox__img ${isZoomed ? 'pdp-lightbox__img--zoomed' : ''}`}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductDetail;
