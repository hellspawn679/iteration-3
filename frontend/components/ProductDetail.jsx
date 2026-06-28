import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronLeft, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import { fetchProduct, fetchCollectionProducts } from '../utils/shopify';
import ProductCard from './ProductCard';
import darkBanner from '../back.png';
import lightBanner from '../white.png';
import './ProductGrid.css';
import './ProductDetail.css';

const formatPrice = (price) => {
  return '₹' + Math.round(price).toLocaleString('en-IN');
};

const getColorValue = (colorName) => {
  const name = colorName.toLowerCase();
  const map = {
    'acid grey': '#5a5a5d',
    'navy blue': '#1c2235',
    'cobalt blue': '#0047ab',
    'charcoal': '#36454f',
    'burgundy': '#5c0617',
    'olive': '#3d4a3e',
    'off white': '#faf9f6',
    'off-white': '#faf9f6',
    'black': '#000000',
    'white': '#ffffff',
    'red': '#b80f0a',
    'grey': '#808080',
    'blue': '#1b365d'
  };
  return map[name] || name;
};

const ProductDetail = ({ onAddToCart }) => {
  const { handle, collection } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [activeImage, setActiveImage] = useState('');
  const [selectedOptions, setSelectedOptions] = useState({});
  const [currentVariant, setCurrentVariant] = useState(null);
  const [cartState, setCartState] = useState('idle'); // 'idle' | 'animating'
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (!handle) return;
    // Fallback to 'all' if collection parameter is missing, products, or pages
    const targetColl = (collection && collection !== 'products' && collection !== 'pages') ? collection : 'all';
    
    fetchCollectionProducts(targetColl)
      .then(products => {
        const filtered = products.filter(p => p.handle !== handle);
        setRelatedProducts(filtered.slice(0, 4));
      })
      .catch(err => {
        console.error('Error fetching collection products:', err);
      });
  }, [handle, collection]);
 
  const recRef = React.useRef(null);
  const [recVisible, setRecVisible] = useState(false);

  useEffect(() => {
    if (relatedProducts.length === 0) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setRecVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });

    if (recRef.current) {
      observer.observe(recRef.current);
    }
    return () => observer.disconnect();
  }, [relatedProducts]);

  const [openTabs, setOpenTabs] = useState({
    description: true,
    shipping: false,
    details: false
  });

  const toggleTab = (tab) => {
    setOpenTabs(prev => ({
      ...prev,
      [tab]: !prev[tab]
    }));
  };

  const isOptionValueAvailable = (optionName, optionValue) => {
    if (!product || !product.variants) return true;
    const optIdx = product.options.findIndex(opt => opt.name === optionName);
    if (optIdx === -1) return true;

    // Check if there is any available variant with this option value, matching other currently selected options
    return product.variants.some(v => {
      if (!v.available) return false;
      return product.options.every((opt, idx) => {
        if (idx === optIdx) {
          return v.options[idx] === optionValue;
        }
        return v.options[idx] === selectedOptions[`option${idx + 1}`];
      });
    });
  };

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

  const handleBuyItNow = async (e) => {
    if (currentVariant && currentVariant.available) {
      try {
        await onAddToCart({
          id: currentVariant.id,
          name: `${product.name} - ${currentVariant.title}`,
          price: currentVariant.price,
          image: currentVariant.featured_image || activeImage,
          handle: product.handle
        }, e);
        window.location.href = '/checkout';
      } catch (err) {
        console.error('Error in Buy It Now:', err);
      }
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
            
            {/* Cotton/GSM Detail Badges */}
            {product.type && (product.type.toLowerCase().includes('t-shirt') || product.type.toLowerCase().includes('apparel')) && (
              <div className="pdp-detail-boxes">
                <span className="pdp-detail-box">100% COTTON</span>
                <span className="pdp-detail-box">220 GSM</span>
                <span className="pdp-detail-box">OVERSIZED FIT</span>
              </div>
            )}

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
            {product.options && product.options.map((opt, optIdx) => {
              const isColor = opt.name.toLowerCase() === 'color';
              return (
                <div key={opt.name} className={`pdp-option pdp-option--${opt.name.toLowerCase()}`}>
                  <div className="pdp-option__label">
                    {opt.name}: <span className="pdp-option__selected">{selectedOptions[`option${optIdx + 1}`]}</span>
                  </div>
                  <div className="pdp-option__values">
                    {opt.values.map(val => {
                      const isActive = selectedOptions[`option${optIdx + 1}`] === val;
                      const isOptionAvailable = isOptionValueAvailable(opt.name, val);

                      if (isColor) {
                        return (
                          <button
                            key={val}
                            className={`pdp-option__swatch ${isActive ? 'pdp-option__swatch--active' : ''} ${!isOptionAvailable ? 'pdp-option__swatch--unavailable' : ''}`}
                            style={{ backgroundColor: getColorValue(val) }}
                            onClick={() => handleOptionChange(optIdx + 1, val)}
                            title={val}
                          />
                        );
                      }

                      return (
                        <button
                          key={val}
                          className={`pdp-option__btn ${isActive ? 'pdp-option__btn--active' : ''} ${!isOptionAvailable ? 'pdp-option__btn--unavailable' : ''}`}
                          onClick={() => handleOptionChange(optIdx + 1, val)}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Add to Cart / Buy Now CTAs */}
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

              {isAvailable && (
                <button
                  className="pdp-actions__buy-now"
                  onClick={handleBuyItNow}
                >
                  BUY IT NOW
                </button>
              )}
            </div>

            {/* Banner Image */}
            <div className="pdp-info__banner">
              <img src={darkBanner} alt="Website Banner" className="pdp-info__banner-img pdp-info__banner-img--dark" />
              <img src={lightBanner} alt="Website Banner" className="pdp-info__banner-img pdp-info__banner-img--light" />
            </div>

            {/* Accordion Tabs */}
            <div className="pdp-tabs">
              {product.description && (
                <div className="pdp-tab">
                  <button 
                    className={`pdp-tab__trigger ${openTabs.description ? 'pdp-tab__trigger--open' : ''}`}
                    onClick={() => toggleTab('description')}
                  >
                    <span>Description</span>
                    <span className="pdp-tab__icon">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 4.5L6 8.5L10 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </button>
                  <div className={`pdp-tab__content ${openTabs.description ? 'pdp-tab__content--open' : ''}`}>
                    <div className="pdp-tab__inner" dangerouslySetInnerHTML={{ __html: product.description }} />
                  </div>
                </div>
              )}

              <div className="pdp-tab">
                <button 
                  className={`pdp-tab__trigger ${openTabs.shipping ? 'pdp-tab__trigger--open' : ''}`}
                  onClick={() => toggleTab('shipping')}
                >
                  <span>Shipping & Returns</span>
                  <span className="pdp-tab__icon">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 4.5L6 8.5L10 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </button>
                <div className={`pdp-tab__content ${openTabs.shipping ? 'pdp-tab__content--open' : ''}`}>
                  <div className="pdp-tab__inner">
                    <p>Free shipping across India on all orders above ₹999. A shipping charge of ₹99 is applicable for orders below ₹999.</p>
                    <p>We dispatch orders within 24-48 hours. Delivery takes 3-7 business days depending on your location.</p>
                    <p>Easy 7-day returns & exchanges. Simply raise a request via our support within 7 days of delivery.</p>
                  </div>
                </div>
              </div>

              <div className="pdp-tab">
                <button 
                  className={`pdp-tab__trigger ${openTabs.details ? 'pdp-tab__trigger--open' : ''}`}
                  onClick={() => toggleTab('details')}
                >
                  <span>Material & Wash Care</span>
                  <span className="pdp-tab__icon">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 4.5L6 8.5L10 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </button>
                <div className={`pdp-tab__content ${openTabs.details ? 'pdp-tab__content--open' : ''}`}>
                  <div className="pdp-tab__inner">
                    <ul>
                      <li>100% Premium Combed Cotton</li>
                      <li>Heavyweight 220-240 GSM Fabric</li>
                      <li>Super-soft silicone wash finish</li>
                      <li>High-density graphic print</li>
                      <li>Cold machine wash inside out</li>
                      <li>Do not iron directly on print</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

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

      {/* You May Also Like Section */}
      {relatedProducts.length > 0 && (
        <div ref={recRef} className={`pdp-recommendations ${recVisible ? 'is-visible' : ''}`}>
          <div className="container">
            <h2 className="pdp-recommendations__title">YOU MAY ALSO LIKE</h2>
            <div className="pdp-recommendations__grid">
              {relatedProducts.map(prod => (
                <ProductCard 
                  key={prod.id} 
                  product={prod} 
                  collectionHandle={collection || 'products'} 
                />
              ))}
            </div>
          </div>
        </div>
      )}

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
